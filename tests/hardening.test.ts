/*
 * Regression tests for the security and payment hardening: shared rate limits, idempotent Website Care checkout,
 * the email outbox, the upload quota, and step-up verification for financial admin actions.
 */
import assert from "node:assert/strict";
import { after, afterEach, beforeEach, describe, test } from "node:test";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import type { PGlite } from "@electric-sql/pglite";
import { WEBSITE_CARE_TERMS } from "@/content/agreements";
import { createSession, findUserForLogin, type SessionUser } from "@/lib/auth/core";
import { createStepUpCode, sessionElevatedUntil, verifyStepUpCode } from "@/lib/auth/step-up-core";
import { inviteCare, startCareCheckout } from "@/lib/billing/service";
import { processStripeEvent } from "@/lib/billing/webhook";
import { buildCsp, cspHeaderName, cspMode } from "@/lib/csp";
import type { Db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { MAX_ATTEMPTS, deliverDue, deliverNotification, enqueueNotifications, requeueDead, sendNotification } from "@/lib/notify/send";
import { MAX_UPLOADS_PER_PROJECT, deleteUpload, storeUpload } from "@/lib/portal/uploads";
import { checkRateLimits, hitRateLimit } from "@/lib/rate-limit";
import { sha256 } from "@/lib/security";
import { closeDbs, event, makeDb, makeStripe, subscriptionFixture } from "./helpers";

let db: Db;
after(closeDbs);
beforeEach(async () => {
  db = await makeDb();
  process.env.ADMIN_EMAILS = "owner@fluxline.test";
  process.env.EMAIL_DELIVERY = "log";
});

async function clientProject(status: t.ProjectStatus = "ready_for_launch", email = "pat@example.com") {
  const [user] = await db.insert(t.users).values({ email, role: "client" }).returning();
  const [customer] = await db
    .insert(t.customers)
    .values({ userId: user.id, contactName: "Pat Lee", businessName: "Client Co", stripeCustomerId: `cus_test_${email}` })
    .returning();
  const [project] = await db
    .insert(t.projects)
    .values({ customerId: customer.id, plan: "business", status, devPriceCents: 130_000, depositCents: 65_000, monthlyCents: 9_900 })
    .returning();
  return { user: user as SessionUser, project };
}

/* ---------------- Rate limits ---------------- */

describe("shared rate limits", () => {
  const rule = { limit: 5, windowMs: 60_000 };

  test("two server instances (separate database handles) share one quota", async () => {
    // Two Drizzle instances over the same database, as two Vercel functions share one Postgres.
    const client = (db as unknown as { $client: PGlite }).$client;
    const instanceA = drizzle(client, { schema: t }) as unknown as Db;
    const instanceB = drizzle(client, { schema: t }) as unknown as Db;
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await hitRateLimit(instanceA, "login:email", "dana@example.com", rule));
    for (let i = 0; i < 4; i++) results.push(await hitRateLimit(instanceB, "login:email", "DANA@example.com ", rule));
    assert.equal(results.filter((result) => result.allowed).length, 5);
    assert.ok(results.at(-1)!.retryAfterSeconds > 0 && results.at(-1)!.retryAfterSeconds <= 60);
  });

  test("concurrent requests can't get past the limit", async () => {
    const results = await Promise.all(Array.from({ length: 40 }, () => hitRateLimit(db, "checkout:ip", "203.0.113.7", rule)));
    assert.equal(results.filter((result) => result.allowed).length, 5);
    const [row] = await db.select().from(t.rateLimits);
    assert.equal(row.count, 40);
    // The identifier is stored hashed, never as the raw IP or email.
    assert.ok(!row.key.includes("203.0.113.7"));
  });

  test("the window resets after it expires", async () => {
    for (let i = 0; i < 6; i++) await hitRateLimit(db, "support:user", "u1", rule);
    assert.equal((await hitRateLimit(db, "support:user", "u1", rule)).allowed, false);
    await db.update(t.rateLimits).set({ resetAt: new Date(Date.now() - 1000) });
    assert.equal((await hitRateLimit(db, "support:user", "u1", rule)).allowed, true);
  });

  test("separate keys don't interfere, and every limit in a check is counted", async () => {
    for (let i = 0; i < 5; i++) await hitRateLimit(db, "login:ip", "198.51.100.1", rule);
    const blocked = await checkRateLimits(db, [
      ["login:ip", "198.51.100.1", rule],
      ["login:email", "new@example.com", rule],
    ]);
    assert.equal(blocked.allowed, false);
    assert.equal((await checkRateLimits(db, [["login:ip", "198.51.100.2", rule]])).allowed, true);
  });

  test("if the limiter's database fails, sensitive actions are refused and lead forms are allowed", async () => {
    const broken = { insert: () => { throw new Error("db down"); } } as unknown as Db;
    const quiet = console.error;
    console.error = () => {};
    try {
      assert.deepEqual(await checkRateLimits(broken, [["login:ip", "x", rule]]), { allowed: false, retryAfterSeconds: 60 });
      assert.equal((await checkRateLimits(broken, [["leads:ip", "x", rule]], { onFailure: "allow" })).allowed, true);
    } finally {
      console.error = quiet;
    }
  });
});

/* ---------------- Website Care checkout ---------------- */

describe("Website Care checkout is idempotent per activation", () => {
  const admin = async () => (await findUserForLogin(db, "owner@fluxline.test"))!;
  const args = (projectId: string) => ({ projectId, termsVersion: WEBSITE_CARE_TERMS.version, ip: "198.51.100.1", userAgent: "test" });
  const keys = (stub: ReturnType<typeof makeStripe>) =>
    stub.calls.filter((call) => call.method === "checkout.sessions.create").map((call) => (call.args[1] as { idempotencyKey: string }).idempotencyKey);

  test("a sequential retry returns the same checkout without creating another", async () => {
    const stub = makeStripe();
    const { user, project } = await clientProject();
    await inviteCare(db, await admin(), project.id);
    const first = await startCareCheckout(db, stub.stripe, user, args(project.id));
    const second = await startCareCheckout(db, stub.stripe, user, args(project.id));
    assert.equal(first.ok && second.ok && first.value === second.value, true);
    assert.equal(stub.sessionsCreated.length, 1);
    // The stored URL is reused, so the second call doesn't reach Stripe at all.
    assert.equal(stub.count("checkout.sessions.create"), 1);
    assert.equal((await db.select().from(t.agreementAcceptances)).length, 1);
  });

  test("concurrent submissions produce one Stripe session", async () => {
    const stub = makeStripe();
    const { user, project } = await clientProject();
    await inviteCare(db, await admin(), project.id);
    const results = await Promise.all(Array.from({ length: 5 }, () => startCareCheckout(db, stub.stripe, user, args(project.id))));
    const urls = new Set(results.map((result) => (result.ok ? result.value : result.error)));
    assert.equal(urls.size, 1);
    assert.equal(stub.sessionsCreated.length, 1);
    assert.equal(new Set(keys(stub)).size, 1);
    assert.equal((await db.select().from(t.agreementAcceptances)).length, 1);
  });

  test("a crash after Stripe created the session (before it was saved) recovers the same session", async () => {
    const stub = makeStripe();
    const { user, project } = await clientProject();
    await inviteCare(db, await admin(), project.id);
    const first = await startCareCheckout(db, stub.stripe, user, args(project.id));
    // As if the process died before the update that stores the session.
    await db.update(t.careActivations).set({ stripeSessionId: null, stripeSessionUrl: null });
    const retry = await startCareCheckout(db, stub.stripe, user, args(project.id));
    assert.equal(first.ok && retry.ok && first.value === retry.value, true);
    assert.equal(stub.sessionsCreated.length, 1);
    // Same key and identical parameters (including expires_at), so Stripe replays instead of erroring.
    const [a, b] = stub.calls.filter((call) => call.method === "checkout.sessions.create");
    assert.deepEqual(a.args, b.args);
  });

  test("an expired checkout gets a fresh attempt; Stripe's expiry event releases the old one", async () => {
    const stub = makeStripe();
    const { user, project } = await clientProject();
    await inviteCare(db, await admin(), project.id);
    const first = await startCareCheckout(db, stub.stripe, user, args(project.id));
    const [before] = await db.select().from(t.careActivations);
    await processStripeEvent(db, stub.stripe, event("checkout.session.expired", { id: before.stripeSessionId, status: "expired", metadata: { kind: "care", projectId: project.id, attemptId: before.attemptId } }));
    const [released] = await db.select().from(t.careActivations);
    assert.equal(released.status, "invited");
    assert.equal(released.attemptId, null);

    const second = await startCareCheckout(db, stub.stripe, user, args(project.id));
    assert.equal(first.ok && second.ok && first.value !== second.value, true);
    assert.equal(stub.sessionsCreated.length, 2);
    assert.equal(new Set(keys(stub)).size, 2);

    // Even without the event (it may be late), a lapsed link isn't reused.
    await db.update(t.careActivations).set({ sessionExpiresAt: new Date(Date.now() - 1000) });
    const third = await startCareCheckout(db, stub.stripe, user, args(project.id));
    assert.equal(third.ok && second.ok && third.value !== second.value, true);
  });

  test("a second subscription for the same activation is cancelled immediately and flagged", async () => {
    const stub = makeStripe();
    const { project } = await clientProject("live");
    await processStripeEvent(db, stub.stripe, event("customer.subscription.created", subscriptionFixture({ id: "sub_first", projectId: project.id })));
    const outcome = await processStripeEvent(db, stub.stripe, event("customer.subscription.created", subscriptionFixture({ id: "sub_second", projectId: project.id })));
    assert.equal(outcome, "rejected");
    const cancels = stub.calls.filter((call) => call.method === "subscriptions.cancel");
    assert.equal(cancels.length, 1);
    assert.equal(cancels[0].args[0], "sub_second");
    const rows = await db.select().from(t.subscriptions);
    assert.deepEqual(rows.map((row) => row.stripeSubscriptionId), ["sub_first"]);
    assert.equal((await db.select().from(t.billingQuarantine))[0].reason, "duplicate_subscription");
  });

  test("cancel, then re-activate: a new offer starts a new attempt and the new subscription replaces the ended one", async () => {
    const stub = makeStripe();
    const { user, project } = await clientProject("live");
    await processStripeEvent(db, stub.stripe, event("customer.subscription.created", subscriptionFixture({ id: "sub_old", projectId: project.id })));
    await processStripeEvent(db, stub.stripe, event("customer.subscription.deleted", subscriptionFixture({ id: "sub_old", projectId: project.id, status: "canceled", canceled_at: Math.floor(Date.now() / 1000) })));
    assert.equal((await db.select().from(t.projects))[0].status, "live");

    assert.equal((await inviteCare(db, await admin(), project.id)).ok, true);
    const started = await startCareCheckout(db, stub.stripe, user, args(project.id));
    assert.equal(started.ok, true);
    const [activation] = await db.select().from(t.careActivations);
    await processStripeEvent(
      db,
      stub.stripe,
      event("customer.subscription.created", subscriptionFixture({ id: "sub_new", projectId: project.id, metadata: { kind: "care", projectId: project.id, attemptId: activation.attemptId } })),
    );
    const rows = await db.select().from(t.subscriptions);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].stripeSubscriptionId, "sub_new");
    assert.equal(rows[0].status, "active");
    assert.equal(stub.count("subscriptions.cancel"), 0);
    // While a live subscription exists, no further checkout can be started.
    assert.equal((await startCareCheckout(db, stub.stripe, user, args(project.id))).ok, false);
  });
});

/* ---------------- Email outbox ---------------- */

describe("email outbox", () => {
  const savedFetch = globalThis.fetch;
  let providerCalls: { idempotencyKey: string | null; body: { to: string[]; text: string } }[] = [];
  let failNext = 0;

  beforeEach(() => {
    providerCalls = [];
    failNext = 0;
    process.env.EMAIL_DELIVERY = "live";
    process.env.RESEND_API_KEY = "re_unit_test";
    process.env.LEAD_FROM_EMAIL = "Fluxline <hello@fluxline.test>";
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      const headers = init.headers as Record<string, string>;
      providerCalls.push({ idempotencyKey: headers["Idempotency-Key"] ?? null, body: JSON.parse(String(init.body)) });
      if (failNext > 0) {
        failNext--;
        return new Response("provider unavailable", { status: 503 });
      }
      return Response.json({ id: `msg_${providerCalls.length}` });
    }) as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = savedFetch;
    process.env.EMAIL_DELIVERY = "log";
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_FROM_EMAIL;
  });

  const support = (key: string) => ({ template: "supportConfirmation" as const, to: "pat@example.com", dedupeKey: key, data: { name: "Pat", subject: "Hi" } });
  const row = async (key: string) => (await db.select().from(t.emailLog).where(eq(t.emailLog.dedupeKey, key)))[0];
  const quietly = async <T>(work: () => Promise<T>) => {
    const original = console.error;
    console.error = () => {};
    try {
      return await work();
    } finally {
      console.error = original;
    }
  };

  test("marked sent only after the provider accepts it, and sent once per key", async () => {
    assert.equal(await sendNotification(db, support("s1")), "sent");
    assert.equal(await sendNotification(db, support("s1")), "skipped");
    assert.equal(await deliverNotification(db, "s1"), "skipped");
    assert.equal(providerCalls.length, 1);
    assert.equal(providerCalls[0].idempotencyKey, "fluxline:s1");
    const sent = await row("s1");
    assert.equal(sent.status, "sent");
    assert.equal(sent.providerMessageId, "msg_1");
    assert.ok(sent.sentAt);
  });

  test("a provider failure is recorded as failed with a backoff, then retried", async () => {
    failNext = 1;
    assert.equal(await quietly(() => sendNotification(db, support("s2"))), "failed");
    let state = await row("s2");
    assert.equal(state.status, "failed");
    assert.equal(state.sentAt, null);
    assert.ok(state.nextAttemptAt! > new Date());
    // Not due yet: the drain leaves it alone.
    assert.deepEqual(await deliverDue(db), []);
    await db.update(t.emailLog).set({ nextAttemptAt: new Date(Date.now() - 1000) }).where(eq(t.emailLog.dedupeKey, "s2"));
    assert.deepEqual(await deliverDue(db), ["sent"]);
    state = await row("s2");
    assert.equal(state.status, "sent");
    assert.equal(state.attempts, 2);
    // Both attempts used the same provider idempotency key, so a send that actually went through isn't doubled.
    assert.deepEqual([...new Set(providerCalls.map((call) => call.idempotencyKey))], ["fluxline:s2"]);
  });

  test("a crash after the transaction commits leaves the email queued, and the drain sends it", async () => {
    // The webhook path: enqueue inside the transaction, then the process dies before delivering.
    await db.transaction(async (tx) => enqueueNotifications(tx, [support("s3")]));
    assert.equal((await row("s3")).status, "queued");
    assert.deepEqual(await deliverDue(db), ["sent"]);
    assert.equal(providerCalls.length, 1);
  });

  test("a rolled-back transaction leaves no email behind", async () => {
    await assert.rejects(
      db.transaction(async (tx) => {
        await enqueueNotifications(tx, [support("s4")]);
        throw new Error("rollback");
      }),
    );
    assert.equal(await row("s4"), undefined);
  });

  test("a crash while sending is recovered after the lease expires, not before", async () => {
    await enqueueNotifications(db, [support("s5")]);
    await db.update(t.emailLog).set({ status: "sending", lockedUntil: new Date(Date.now() + 60_000), attempts: 1 }).where(eq(t.emailLog.dedupeKey, "s5"));
    assert.equal(await deliverNotification(db, "s5"), "skipped");
    await db.update(t.emailLog).set({ lockedUntil: new Date(Date.now() - 1000) }).where(eq(t.emailLog.dedupeKey, "s5"));
    assert.equal(await deliverNotification(db, "s5"), "sent");
    assert.equal(providerCalls.length, 1);
  });

  test("concurrent deliveries of one email send it once", async () => {
    await enqueueNotifications(db, [support("s6")]);
    const outcomes = await Promise.all(Array.from({ length: 5 }, () => deliverNotification(db, "s6")));
    assert.equal(outcomes.filter((outcome) => outcome === "sent").length, 1);
    assert.equal(providerCalls.length, 1);
  });

  test("gives up after the maximum attempts, then an admin retry sends it", async () => {
    failNext = MAX_ATTEMPTS;
    await enqueueNotifications(db, [support("s7")]);
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await db.update(t.emailLog).set({ nextAttemptAt: new Date(Date.now() - 1000) }).where(eq(t.emailLog.dedupeKey, "s7"));
      await quietly(() => deliverNotification(db, "s7"));
    }
    assert.equal((await row("s7")).status, "dead");
    assert.deepEqual(await deliverDue(db), []);
    assert.deepEqual(await requeueDead(db), ["s7"]);
    assert.deepEqual(await deliverDue(db), ["sent"]);
  });

  test("sign-in links are minted at send time: the outbox never stores a token, and each retry gets a fresh link", async () => {
    failNext = 1;
    await quietly(() =>
      sendNotification(db, { template: "signInLink", to: "pat@example.com", dedupeKey: "login:abc", data: { minutes: 15 }, signIn: { next: "/client/dashboard", ttlMinutes: 15 } }),
    );
    const stored = await row("login:abc");
    assert.ok(!JSON.stringify(stored.data).includes("token="));
    await db.update(t.emailLog).set({ nextAttemptAt: new Date(Date.now() - 1000) }).where(eq(t.emailLog.dedupeKey, "login:abc"));
    await deliverDue(db);
    const links = providerCalls.map((call) => call.body.text.match(/token=([\w-]+)/)?.[1]);
    assert.equal(links.length, 2);
    assert.ok(links[0] && links[1] && links[0] !== links[1]);
    // Only hashes are stored for tokens.
    const tokens = await db.select().from(t.loginTokens);
    assert.ok(tokens.every((token) => token.tokenHash !== links[1]));
  });

  test("log mode (no EMAIL_DELIVERY) records the message as suppressed, never as sent", async () => {
    process.env.EMAIL_DELIVERY = "";
    assert.equal(await sendNotification(db, support("s8")), "suppressed");
    assert.equal(providerCalls.length, 0);
    assert.equal((await row("s8")).status, "suppressed");
  });
});

/* ---------------- Uploads ---------------- */

describe("upload quota", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 1, 2, 3]);

  test("concurrent uploads can't exceed the per-project limit", async () => {
    const { user, project } = await clientProject("onboarding");
    await db.update(t.projects).set({ uploadCount: MAX_UPLOADS_PER_PROJECT - 3 }).where(eq(t.projects.id, project.id));
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => storeUpload(db, user, project.id, `logo-${i}.png`, png)));
    assert.equal(results.filter((result) => result.ok).length, 3);
    assert.equal((await db.select().from(t.uploads)).length, 3);
    assert.equal((await db.select().from(t.projects))[0].uploadCount, MAX_UPLOADS_PER_PROJECT);
  });

  test("deleting frees a slot; other users can neither upload to nor delete from the project", async () => {
    const owner = await clientProject("onboarding");
    const stranger = await clientProject("onboarding", "stranger@example.com");
    const stored = await storeUpload(db, owner.user, owner.project.id, "a.png", png);
    assert.equal(stored.ok, true);
    assert.equal((await storeUpload(db, stranger.user, owner.project.id, "x.png", png)).ok, false);
    assert.equal(await deleteUpload(db, stranger.user, stored.ok ? stored.id : ""), false);
    assert.equal((await db.select().from(t.uploads)).length, 1);
    assert.equal(await deleteUpload(db, owner.user, stored.ok ? stored.id : ""), true);
    const [project] = await db.select().from(t.projects).where(eq(t.projects.id, owner.project.id));
    assert.equal(project.uploadCount, 0);
  });
});

/* ---------------- Step-up ---------------- */

describe("step-up verification for financial admin actions", () => {
  test("a correct code elevates only that session, once, for a limited time", async () => {
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    const { token } = await createSession(db, admin);
    const { token: otherToken } = await createSession(db, admin);
    const sessionId = sha256(token);
    assert.equal(await sessionElevatedUntil(db, sessionId), null);

    const code = await createStepUpCode(db, admin.id);
    const stored = await db.select().from(t.stepUpCodes);
    assert.ok(stored.every((row) => row.codeHash !== code));
    const result = await verifyStepUpCode(db, admin.id, sessionId, code);
    assert.equal(result.ok, true);
    const until = await sessionElevatedUntil(db, sessionId);
    assert.ok(until && until.getTime() - Date.now() <= 15 * 60_000 + 1000);
    assert.equal(await sessionElevatedUntil(db, sha256(otherToken)), null);
    // Single use.
    assert.equal((await verifyStepUpCode(db, admin.id, sha256(otherToken), code)).ok, false);
  });

  test("wrong guesses are limited, even in parallel", async () => {
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    const { token } = await createSession(db, admin);
    const code = await createStepUpCode(db, admin.id);
    const wrong = code === "000000" ? "111111" : "000000";
    await Promise.all(Array.from({ length: 8 }, () => verifyStepUpCode(db, admin.id, sha256(token), wrong)));
    // The right code no longer works once the guesses are used up.
    assert.equal((await verifyStepUpCode(db, admin.id, sha256(token), code)).ok, false);
    assert.equal(await sessionElevatedUntil(db, sha256(token)), null);
  });

  test("an expired code is refused", async () => {
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    const { token } = await createSession(db, admin);
    const code = await createStepUpCode(db, admin.id);
    await db.update(t.stepUpCodes).set({ expiresAt: new Date(Date.now() - 1000) });
    assert.equal((await verifyStepUpCode(db, admin.id, sha256(token), code)).ok, false);
  });
});

/* ---------------- CSP ---------------- */

describe("content security policy", () => {
  test("scripts need this request's nonce; no unsafe-inline or unsafe-eval for scripts in production", () => {
    const policy = buildCsp("abc123", { NODE_ENV: "production", VERCEL_ENV: "production" });
    const script = policy.split("; ").find((directive) => directive.startsWith("script-src "))!;
    assert.ok(script.includes("'nonce-abc123'"));
    assert.ok(script.includes("'strict-dynamic'"));
    assert.ok(!script.includes("unsafe-inline"));
    assert.ok(!script.includes("unsafe-eval"));
    assert.ok(policy.includes("frame-ancestors 'none'"));
    assert.ok(policy.includes("object-src 'none'"));
    assert.ok(policy.includes("form-action 'self' https://checkout.stripe.com https://billing.stripe.com"));
    assert.ok(!policy.includes("vercel.live"));
  });

  test("report-only outside production unless CSP_MODE says otherwise", () => {
    assert.equal(cspMode({ VERCEL_ENV: "production" }), "enforce");
    assert.equal(cspMode({ VERCEL_ENV: "preview" }), "report-only");
    assert.equal(cspMode({ VERCEL_ENV: "production", CSP_MODE: "report-only" }), "report-only");
    assert.equal(cspHeaderName("report-only"), "Content-Security-Policy-Report-Only");
  });
});

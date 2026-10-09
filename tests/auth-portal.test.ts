import assert from "node:assert/strict";
import { after, beforeEach, describe, test } from "node:test";
import { eq } from "drizzle-orm";
import {
  canAccessProject,
  consumeLoginToken,
  createLoginToken,
  createSession,
  findUserForLogin,
  peekLoginToken,
  userForSessionToken,
  type SessionUser,
} from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { sendNotification } from "@/lib/notify/send";
import { templates } from "@/lib/notify/templates";
import { saveOnboarding } from "@/lib/portal/onboarding";
import { getUploadForUser, storeUpload, validateUpload } from "@/lib/portal/uploads";
import { safeNextPath } from "@/lib/security";
import { makeDb, closeDbs } from "./helpers";

let db: Db;
after(closeDbs);
beforeEach(async () => {
  db = await makeDb();
  process.env.ADMIN_EMAILS = "owner@fluxline.test";
});

/** A paid client with one project, created directly (the webhook path is covered in billing.test.ts). */
async function client(email: string, business = "Client Co") {
  const [user] = await db.insert(t.users).values({ email, role: "client" }).returning();
  const [customer] = await db.insert(t.customers).values({ userId: user.id, contactName: "Pat Lee", businessName: business }).returning();
  const [project] = await db.insert(t.projects).values({ customerId: customer.id, plan: "business", devPriceCents: 130_000, depositCents: 65_000, monthlyCents: 9_900 }).returning();
  return { user: user as SessionUser, customer, project };
}

describe("sign-in links", () => {
  test("only existing clients and allowlisted admins can get a link", async () => {
    assert.equal(await findUserForLogin(db, "stranger@example.com"), null);
    const admin = await findUserForLogin(db, " Owner@Fluxline.test ");
    assert.equal(admin?.role, "admin");
    const { user } = await client("pat@example.com");
    assert.equal((await findUserForLogin(db, "PAT@example.com"))?.id, user.id);
  });

  test("links are single-use, hashed at rest, and expire", async () => {
    const token = await createLoginToken(db, "pat@example.com", { next: "/client/onboarding" });
    const [row] = await db.select().from(t.loginTokens);
    assert.notEqual(row.tokenHash, token);
    assert.ok(await peekLoginToken(db, token));
    const used = await consumeLoginToken(db, token);
    assert.equal(used?.next, "/client/onboarding");
    assert.equal(await consumeLoginToken(db, token), null, "second use is refused");

    const expired = await createLoginToken(db, "pat@example.com", { ttlMinutes: -1 });
    assert.equal(await consumeLoginToken(db, expired), null);
    assert.equal(await consumeLoginToken(db, "made-up-token"), null);
  });

  test("concurrent use of one link signs in only once", async () => {
    const token = await createLoginToken(db, "pat@example.com");
    const results = await Promise.all([consumeLoginToken(db, token), consumeLoginToken(db, token), consumeLoginToken(db, token)]);
    assert.equal(results.filter(Boolean).length, 1);
  });

  test("redirect targets must be local paths", () => {
    assert.equal(safeNextPath("/client/care?project=1"), "/client/care?project=1");
    assert.equal(safeNextPath("https://evil.example"), "/client/dashboard");
    assert.equal(safeNextPath("//evil.example"), "/client/dashboard");
    assert.equal(safeNextPath("/\\evil.example"), "/client/dashboard");
  });
});

describe("sessions and roles", () => {
  test("session tokens are stored hashed and resolve to the user", async () => {
    const { user } = await client("pat@example.com");
    const { token } = await createSession(db, user);
    const [row] = await db.select().from(t.sessions);
    assert.notEqual(row.id, token);
    assert.equal((await userForSessionToken(db, token))?.id, user.id);
    assert.equal(await userForSessionToken(db, "forged"), null);
    assert.equal(await userForSessionToken(db, undefined), null);
  });

  test("removing an admin from ADMIN_EMAILS revokes access immediately", async () => {
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    const { token } = await createSession(db, admin);
    assert.equal((await userForSessionToken(db, token))?.role, "admin");
    process.env.ADMIN_EMAILS = "someone-else@fluxline.test";
    assert.equal(await userForSessionToken(db, token), null);
  });

  test("clients can access only their own projects; admins can access all", async () => {
    const a = await client("a@example.com", "A Co");
    const b = await client("b@example.com", "B Co");
    assert.equal(await canAccessProject(db, a.user, a.project.id), true);
    assert.equal(await canAccessProject(db, a.user, b.project.id), false);
    assert.equal(await canAccessProject(db, a.user, "not-a-uuid"), false);
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    assert.equal(await canAccessProject(db, admin, b.project.id), true);
  });
});

describe("onboarding", () => {
  test("drafts persist across saves and the first save moves the project to Onboarding", async () => {
    const { user, project } = await client("pat@example.com");
    const first = await saveOnboarding(db, user, project.id, { businessName: "Client Co", industry: "Roofing", junk: "ignored" }, { submit: false });
    assert.equal(first.ok, true);
    let [row] = await db.select().from(t.onboarding);
    assert.deepEqual(row.data, { businessName: "Client Co", industry: "Roofing" });
    assert.equal(row.submittedAt, null);
    assert.equal((await db.select().from(t.projects))[0].status, "onboarding");

    await saveOnboarding(db, user, project.id, { businessName: "Client Co", industry: "Roofing", services: "Repairs" }, { submit: false });
    [row] = await db.select().from(t.onboarding);
    assert.equal(row.data.services, "Repairs");
  });

  test("submitting requires the required answers", async () => {
    const { user, project } = await client("pat@example.com");
    const result = await saveOnboarding(db, user, project.id, { businessName: "Client Co" }, { submit: true });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.fieldErrors?.services);

    const complete = {
      businessName: "Client Co",
      industry: "Roofing",
      contactName: "Pat Lee",
      contactEmail: "pat@example.com",
      contactPhone: "516-555-0100",
      desiredPages: "Home, Services, Contact",
      services: "Roof repair",
      targetAudience: "Homeowners on Long Island",
    };
    const submitted = await saveOnboarding(db, user, project.id, complete, { submit: true });
    assert.equal(submitted.ok && submitted.submitted, true);
    const [row] = await db.select().from(t.onboarding);
    assert.ok(row.submittedAt);
  });

  test("a client can't write to another customer's project", async () => {
    const a = await client("a@example.com");
    const b = await client("b@example.com");
    const result = await saveOnboarding(db, a.user, b.project.id, { businessName: "Hijack" }, { submit: false });
    assert.equal(result.ok, false);
    assert.equal((await db.select().from(t.onboarding)).length, 0);
  });
});

describe("uploads", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 1, 2, 3]);
  const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0, 0, 0, 0]);

  test("type comes from the file's bytes, not its name", () => {
    assert.deepEqual(validateUpload("logo.png", png), { ok: true, mime: "image/png", filename: "logo.png" });
    assert.equal(validateUpload("brief.pdf", pdf).ok, true);
    // A script renamed to .png is refused.
    assert.equal(validateUpload("evil.png", new TextEncoder().encode("<script>alert(1)</script>")).ok, false);
    // SVG is refused (it can carry scripts).
    assert.equal(validateUpload("logo.svg", new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).ok, false);
    assert.equal(validateUpload("empty.png", new Uint8Array()).ok, false);
  });

  test("oversized files are refused and names are sanitized", () => {
    const big = new Uint8Array(4 * 1024 * 1024 + 1);
    big.set(png);
    assert.equal(validateUpload("huge.png", big).ok, false);
    const result = validateUpload('../../etc/"passwd".pdf', pdf);
    assert.equal(result.ok && result.filename, "passwd.pdf");
    const misnamed = validateUpload("photo.exe", png);
    assert.equal(misnamed.ok && misnamed.filename, "photo.png");
  });

  test("files are visible only to the owner and admins", async () => {
    const a = await client("a@example.com");
    const b = await client("b@example.com");
    const stored = await storeUpload(db, a.user, a.project.id, "logo.png", png);
    assert.equal(stored.ok, true);
    const id = stored.ok ? stored.id : "";
    assert.ok(await getUploadForUser(db, a.user, id));
    assert.equal(await getUploadForUser(db, b.user, id), null);
    const refused = await storeUpload(db, b.user, a.project.id, "x.png", png);
    assert.equal(refused.ok, false);
    const admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
    assert.ok(await getUploadForUser(db, admin, id));
  });
});

describe("notifications", () => {
  test("a dedupe key sends at most once, and a failed send can be retried", async () => {
    const message = { template: "supportConfirmation" as const, to: "pat@example.com", dedupeKey: "support:1", rendered: templates.supportConfirmation({ name: "Pat", subject: "Hi" }) };
    assert.equal(await sendNotification(db, message), "sent");
    assert.equal(await sendNotification(db, message), "duplicate");

    process.env.EMAIL_DELIVERY = "sandbox";
    delete process.env.EMAIL_SANDBOX_TO;
    const failing = { ...message, dedupeKey: "support:2" };
    assert.equal(await sendNotification(db, failing), "failed");
    const [row] = await db.select().from(t.emailLog).where(eq(t.emailLog.dedupeKey, "support:2"));
    assert.equal(row.status, "failed");
    process.env.EMAIL_DELIVERY = "log";
    assert.equal(await sendNotification(db, failing), "sent");
  });

  test("templates escape customer-supplied text", () => {
    const rendered = templates.supportConfirmation({ name: "<b>Pat</b>", subject: '<img src=x onerror="alert(1)">' });
    assert.ok(!rendered.html.includes("<img"));
    assert.ok(rendered.html.includes("&lt;img"));
  });
});

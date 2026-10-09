import assert from "node:assert/strict";
import { after, beforeEach, describe, test } from "node:test";
import { eq } from "drizzle-orm";
import { WEBSITE_CARE_TERMS } from "@/content/agreements";
import { findUserForLogin, type SessionUser } from "@/lib/auth/core";
import { cancelCare, careCancellationDate, createFinalInvoice, createQuote, inviteCare, setProjectStatus, startCareCheckout } from "@/lib/billing/service";
import { findValidQuote } from "@/lib/billing/checkout";
import type { Db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { makeDb, makeStripe, closeDbs } from "./helpers";

let db: Db;
let admin: SessionUser;
after(closeDbs);
beforeEach(async () => {
  db = await makeDb();
  process.env.ADMIN_EMAILS = "owner@fluxline.test";
  admin = (await findUserForLogin(db, "owner@fluxline.test"))!;
});

async function project(status: t.ProjectStatus = "in_development") {
  const [user] = await db.insert(t.users).values({ email: "pat@example.com", role: "client" }).returning();
  const [customer] = await db
    .insert(t.customers)
    .values({ userId: user.id, contactName: "Pat Lee", businessName: "Client Co", stripeCustomerId: "cus_test_1" })
    .returning();
  const [row] = await db
    .insert(t.projects)
    .values({ customerId: customer.id, plan: "business", status, devPriceCents: 130_000, depositCents: 65_000, monthlyCents: 9_900 })
    .returning();
  return { user: user as SessionUser, project: row };
}

const careArgs = (projectId: string) => ({ projectId, termsVersion: WEBSITE_CARE_TERMS.version, ip: "198.51.100.1", userAgent: "test" });

describe("final invoice", () => {
  test("invoices the balance once, moves to Final Payment Pending, and emails the customer", async () => {
    const stub = makeStripe();
    const { project: p } = await project();
    stub.setProject(p.id);
    const result = await createFinalInvoice(db, stub.stripe, admin, p.id);
    assert.equal(result.ok, true);
    const item = stub.calls.find((call) => call.method === "invoiceItems.create")!.args[0] as { amount: number };
    assert.equal(item.amount, 65_000);
    const [invoice] = await db.select().from(t.invoices);
    assert.equal(invoice.status, "open");
    assert.equal((await db.select().from(t.projects))[0].status, "final_payment_pending");
    assert.equal((await db.select().from(t.emailLog)).filter((row) => row.template === "finalInvoice").length, 1);
    // Not marked paid: that only happens when Stripe reports invoice.paid.
    assert.equal((await db.select().from(t.payments)).length, 0);

    const again = await createFinalInvoice(db, stub.stripe, admin, p.id);
    assert.equal(again.ok, false);
    assert.equal(stub.count("invoices.create"), 1);
  });

  test("is refused before the project is in development", async () => {
    const stub = makeStripe();
    const { project: p } = await project("onboarding");
    assert.equal((await createFinalInvoice(db, stub.stripe, admin, p.id)).ok, false);
    assert.equal(stub.count("invoices.create"), 0);
  });
});

describe("project status", () => {
  test("payment-dependent stages need Stripe confirmation", async () => {
    const { project: p } = await project("client_review");
    assert.equal((await setProjectStatus(db, admin, p.id, "ready_for_launch")).ok, false);
    assert.equal((await setProjectStatus(db, admin, p.id, "live")).ok, false);
    assert.equal((await setProjectStatus(db, admin, p.id, "maintenance_active")).ok, false);
    await db.insert(t.payments).values({ projectId: p.id, kind: "final", amountCents: 65_000, stripeInvoiceId: "in_1" });
    assert.equal((await setProjectStatus(db, admin, p.id, "ready_for_launch")).ok, true);
    const events = await db.select().from(t.projectEvents).where(eq(t.projectEvents.projectId, p.id));
    assert.ok(events.some((row) => row.kind === "status" && row.actorUserId === admin.id));
  });
});

describe("Website Care", () => {
  test("can't be started by the customer until an admin offers it", async () => {
    const stub = makeStripe();
    const { user, project: p } = await project("ready_for_launch");
    assert.equal((await startCareCheckout(db, stub.stripe, user, careArgs(p.id))).ok, false);
    assert.equal(stub.count("checkout.sessions.create"), 0);
  });

  test("can't be offered before the site is ready for launch", async () => {
    const { project: p } = await project("client_review");
    assert.equal((await inviteCare(db, admin, p.id)).ok, false);
  });

  test("offer → consent → Stripe subscription checkout, with the terms recorded", async () => {
    const stub = makeStripe();
    const { user, project: p } = await project("ready_for_launch");
    assert.equal((await inviteCare(db, admin, p.id)).ok, true);
    const result = await startCareCheckout(db, stub.stripe, user, careArgs(p.id));
    assert.equal(result.ok, true);
    const params = stub.calls.find((call) => call.method === "checkout.sessions.create")!.args[0] as {
      mode: string;
      subscription_data: { metadata: Record<string, string> };
      line_items: { price_data: { unit_amount: number; recurring: { interval: string } } }[];
    };
    assert.equal(params.mode, "subscription");
    assert.equal(params.subscription_data.metadata.kind, "care");
    assert.equal(params.line_items[0].price_data.unit_amount, 9_900);
    assert.equal(params.line_items[0].price_data.recurring.interval, "month");
    const [acceptance] = await db.select().from(t.agreementAcceptances);
    assert.equal(acceptance.kind, "website_care");
    assert.equal(acceptance.version, WEBSITE_CARE_TERMS.version);
    assert.equal((await db.select().from(t.careActivations))[0].status, "consented");
    // No subscription exists until Stripe's webhook confirms it.
    assert.equal((await db.select().from(t.subscriptions)).length, 0);
  });

  test("another customer can't start Care on someone else's project", async () => {
    const stub = makeStripe();
    const { project: p } = await project("ready_for_launch");
    await inviteCare(db, admin, p.id);
    const [other] = await db.insert(t.users).values({ email: "other@example.com", role: "client" }).returning();
    assert.equal((await startCareCheckout(db, stub.stripe, other as SessionUser, careArgs(p.id))).ok, false);
  });

  test("cancellation takes effect at the later of period end and the three-month minimum", async () => {
    const day = 86_400_000;
    const periodEnd = new Date(Date.now() + 20 * day);
    const minimum = new Date(Date.now() + 80 * day);
    assert.equal(careCancellationDate({ currentPeriodEnd: periodEnd, minimumTermEnd: minimum }).getTime(), minimum.getTime());
    assert.equal(careCancellationDate({ currentPeriodEnd: minimum, minimumTermEnd: periodEnd }).getTime(), minimum.getTime());

    const stub = makeStripe();
    const { user, project: p } = await project("maintenance_active");
    await db.insert(t.subscriptions).values({ projectId: p.id, stripeSubscriptionId: "sub_test_1", status: "active", monthlyCents: 9_900, currentPeriodEnd: periodEnd, minimumTermEnd: minimum });
    const result = await cancelCare(db, stub.stripe, user, p.id);
    assert.equal(result.ok, true);
    const params = stub.calls.find((call) => call.method === "subscriptions.update")!.args[1] as { cancel_at: number; proration_behavior: string };
    assert.equal(params.cancel_at, Math.floor(minimum.getTime() / 1000));
    assert.equal(params.proration_behavior, "none");
    assert.equal((await db.select().from(t.emailLog)).filter((row) => row.template === "careCancellation").length, 1);
    assert.equal((await db.select().from(t.supportRequests))[0].kind, "cancellation");
  });
});

describe("Premium quotes", () => {
  test("must be at least the starting price and produce a working single-quote link", async () => {
    assert.equal((await createQuote(db, admin, { email: "x@example.com", contactName: "X Y", businessName: "X", scope: "s".repeat(30), devPriceCents: 100_000, monthlyCents: 14_900 })).ok, false);
    const result = await createQuote(db, admin, { email: "X@Example.com", contactName: "X Y", businessName: "X", scope: "s".repeat(30), devPriceCents: 300_000, monthlyCents: 14_900 });
    assert.equal(result.ok, true);
    const token = result.ok ? result.value!.split("/").pop()! : "";
    const quote = await findValidQuote(db, token);
    assert.equal(quote?.depositCents, 150_000);
    assert.equal(quote?.email, "x@example.com");
    assert.equal(await findValidQuote(db, "guess"), null);
  });
});

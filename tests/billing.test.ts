import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, beforeEach, describe, test } from "node:test";
import { eq } from "drizzle-orm";
import { SERVICE_AGREEMENT } from "@/content/agreements";
import { billingStatus, stripeMode } from "@/lib/billing/config";
import { checkoutStatus, startDepositCheckout, type CheckoutInput } from "@/lib/billing/checkout";
import { PLANS, priceSummary } from "@/lib/billing/plans";
import { processStripeEvent } from "@/lib/billing/webhook";
import type { Db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { depositSession, event, makeDb, makeStripe, subscriptionFixture, closeDbs } from "./helpers";

const input = (over: Partial<CheckoutInput> = {}): CheckoutInput => ({
  intentId: randomUUID(),
  plan: "business",
  contactName: "Dana Rivera",
  businessName: "Rivera Roofing",
  email: "Dana@Example.com",
  phone: "(516) 555-0100",
  acceptAgreement: true,
  acknowledgeCare: true,
  agreementVersion: SERVICE_AGREEMENT.version,
  ...over,
});
const req = { ip: "203.0.113.5", userAgent: "test" };

let db: Db;
after(closeDbs);
beforeEach(async () => {
  db = await makeDb();
});

describe("package pricing", () => {
  test("matches the published prices", () => {
    assert.deepEqual(
      [PLANS.essential, PLANS.business, PLANS.premium].map((plan) => [plan.devPriceCents, plan.depositCents, plan.monthlyCents]),
      [
        [70_000, 35_000, 5_900],
        [130_000, 65_000, 9_900],
        [220_000, 110_000, 14_900],
      ],
    );
    assert.equal(PLANS.business.badge, "Most popular");
    assert.equal(PLANS.premium.quoteRequired, true);
    assert.equal(priceSummary(PLANS.business).balanceCents, 65_000);
    assert.equal(priceSummary(PLANS.essential).minimumCareCents, 17_700);
  });
});

describe("live-mode guard", () => {
  test("live keys stay disabled until explicitly approved", () => {
    const saved = { ...process.env };
    process.env.STRIPE_SECRET_KEY = "sk_live_example";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
    delete process.env.BILLING_LIVE_ENABLED;
    assert.equal(stripeMode(), "live");
    assert.equal(billingStatus().enabled, false);
    process.env.BILLING_LIVE_ENABLED = "true";
    // Live also needs the agreement marked approved.
    const status = SERVICE_AGREEMENT.status;
    SERVICE_AGREEMENT.status = "draft";
    assert.equal(billingStatus().enabled, false);
    SERVICE_AGREEMENT.status = "approved";
    assert.deepEqual(billingStatus(), { enabled: true, mode: "live" });
    SERVICE_AGREEMENT.status = status;
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    assert.deepEqual(billingStatus(), { enabled: true, mode: "test" });
    delete process.env.STRIPE_WEBHOOK_SECRET;
    assert.equal(billingStatus().enabled, false);
    process.env = saved;
  });
});

describe("deposit checkout", () => {
  test("creates one Stripe session with server-side amounts and records the agreement", async () => {
    const { stripe, calls } = makeStripe();
    const data = input();
    const result = await startDepositCheckout(db, stripe, data, req);
    assert.equal(result.ok, true);
    const params = calls[0].args[0] as { mode: string; line_items: { price_data: { unit_amount: number } }[]; metadata: Record<string, string> };
    assert.equal(params.mode, "payment");
    assert.equal(params.line_items[0].price_data.unit_amount, 65_000);
    assert.equal(params.metadata.kind, "deposit");
    assert.deepEqual(calls[0].args[1], { idempotencyKey: `deposit-checkout:${data.intentId}` });

    const [intent] = await db.select().from(t.checkoutIntents);
    assert.equal(intent.email, "dana@example.com");
    const agreements = await db.select().from(t.agreementAcceptances);
    assert.equal(agreements.length, 1);
    assert.equal(agreements[0].version, SERVICE_AGREEMENT.version);
    assert.notEqual(agreements[0].ipHash, req.ip);
  });

  test("a repeated submission reuses the same session (no second Stripe call)", async () => {
    const { stripe, count } = makeStripe();
    const data = input();
    const first = await startDepositCheckout(db, stripe, data, req);
    const second = await startDepositCheckout(db, stripe, data, req);
    assert.deepEqual(first, second);
    assert.equal(count("checkout.sessions.create"), 1);
    assert.equal((await db.select().from(t.checkoutIntents)).length, 1);
    assert.equal((await db.select().from(t.agreementAcceptances)).length, 1);
  });

  test("Premium needs a valid quote", async () => {
    const { stripe, count } = makeStripe();
    const result = await startDepositCheckout(db, stripe, input({ plan: "premium" }), req);
    assert.equal(result.ok, false);
    assert.equal(count("checkout.sessions.create"), 0);
  });

  test("an outdated agreement version is rejected", async () => {
    const { stripe } = makeStripe();
    const result = await startDepositCheckout(db, stripe, input({ agreementVersion: "old" }), req);
    assert.equal(result.ok, false);
  });
});

async function paidProject(stripe = makeStripe().stripe) {
  const data = input();
  await startDepositCheckout(db, stripe, data, req);
  const [intent] = await db.select().from(t.checkoutIntents).where(eq(t.checkoutIntents.id, data.intentId));
  await processStripeEvent(db, stripe, event("checkout.session.completed", depositSession(data.intentId, { id: intent.stripeSessionId })));
  const [project] = await db.select().from(t.projects).where(eq(t.projects.checkoutIntentId, data.intentId));
  return { data, intent, project };
}

describe("webhook: deposit confirmation", () => {
  test("a success redirect alone confirms nothing", async () => {
    const { stripe } = makeStripe();
    const data = input();
    await startDepositCheckout(db, stripe, data, req);
    const [intent] = await db.select().from(t.checkoutIntents);
    assert.equal(await checkoutStatus(db, intent.stripeSessionId!), "pending");
    assert.equal((await db.select().from(t.projects)).length, 0);
  });

  test("creates the user, customer, project, and payment, and emails once", async () => {
    const { stripe } = makeStripe();
    const { intent, project } = await paidProject(stripe);
    assert.equal(project.status, "deposit_paid");
    assert.equal(project.depositCents, 65_000);
    assert.equal(await checkoutStatus(db, intent.stripeSessionId!), "confirmed");
    const [customer] = await db.select().from(t.customers);
    assert.equal(customer.stripeCustomerId, "cus_test_1");
    const payments = await db.select().from(t.payments);
    assert.equal(payments.length, 1);
    assert.equal(payments[0].amountCents, 65_000);
    const [agreement] = await db.select().from(t.agreementAcceptances);
    assert.equal(agreement.projectId, project.id);
    const emails = (await db.select().from(t.emailLog)).map((row) => row.template).sort();
    assert.deepEqual(emails, ["adminAlert", "depositConfirmation", "onboardingInvitation"]);
    // The onboarding link is a single-use token, not the email address.
    assert.equal((await db.select().from(t.loginTokens)).length, 1);
  });

  test("duplicate deliveries of the same event are ignored", async () => {
    const { stripe } = makeStripe();
    const data = input();
    await startDepositCheckout(db, stripe, data, req);
    const completed = event("checkout.session.completed", depositSession(data.intentId));
    assert.equal(await processStripeEvent(db, stripe, completed), "processed");
    assert.equal(await processStripeEvent(db, stripe, completed), "duplicate");
    assert.equal(await processStripeEvent(db, stripe, completed), "duplicate");
    assert.equal((await db.select().from(t.projects)).length, 1);
    assert.equal((await db.select().from(t.payments)).length, 1);
    assert.equal((await db.select().from(t.emailLog)).length, 3);
  });

  test("different events about the same payment still create one project", async () => {
    const { stripe } = makeStripe();
    const data = input();
    await startDepositCheckout(db, stripe, data, req);
    await processStripeEvent(db, stripe, event("checkout.session.completed", depositSession(data.intentId)));
    await processStripeEvent(db, stripe, event("checkout.session.async_payment_succeeded", depositSession(data.intentId)));
    assert.equal((await db.select().from(t.projects)).length, 1);
    assert.equal((await db.select().from(t.customers)).length, 1);
    assert.equal((await db.select().from(t.emailLog)).length, 3);
  });

  test("an unpaid (delayed) session does not create a project", async () => {
    const { stripe } = makeStripe();
    const data = input();
    await startDepositCheckout(db, stripe, data, req);
    await processStripeEvent(db, stripe, event("checkout.session.completed", depositSession(data.intentId, { payment_status: "unpaid" })));
    assert.equal((await db.select().from(t.projects)).length, 0);
  });

  test("expired sessions mark the intent expired", async () => {
    const { stripe } = makeStripe();
    const data = input();
    await startDepositCheckout(db, stripe, data, req);
    await processStripeEvent(db, stripe, event("checkout.session.expired", depositSession(data.intentId, { status: "expired", payment_status: "unpaid" })));
    const [intent] = await db.select().from(t.checkoutIntents);
    assert.equal(intent.status, "expired");
  });

  test("ignores event types it doesn't handle", async () => {
    const { stripe } = makeStripe();
    assert.equal(await processStripeEvent(db, stripe, event("customer.created", {})), "ignored");
  });
});

describe("webhook: invoices, refunds, subscriptions", () => {
  const invoice = (projectId: string, over: Record<string, unknown> = {}) => ({
    id: "in_test_final",
    status: "paid",
    amount_due: 65_000,
    amount_paid: 65_000,
    attempt_count: 1,
    currency: "usd",
    hosted_invoice_url: "https://invoice.stripe.test/in_test_final",
    due_date: null,
    metadata: { kind: "final", projectId },
    parent: null,
    ...over,
  });

  test("a paid final invoice records the payment and moves the project to Ready for Launch", async () => {
    const { stripe } = makeStripe();
    const { project } = await paidProject(stripe);
    await db.update(t.projects).set({ status: "final_payment_pending" }).where(eq(t.projects.id, project.id));
    await processStripeEvent(db, stripe, event("invoice.paid", invoice(project.id)));
    await processStripeEvent(db, stripe, event("invoice.paid", invoice(project.id))); // a second, distinct event for the same invoice
    const finals = (await db.select().from(t.payments)).filter((payment) => payment.kind === "final");
    assert.equal(finals.length, 1);
    const [updated] = await db.select().from(t.projects);
    assert.equal(updated.status, "ready_for_launch");
    const confirmations = (await db.select().from(t.emailLog)).filter((row) => row.template === "finalPaymentConfirmation");
    assert.equal(confirmations.length, 1);
  });

  test("failed payments are tracked and emailed once per attempt", async () => {
    const { stripe } = makeStripe();
    const { project } = await paidProject(stripe);
    const failed = (attempt: number) => event("invoice.payment_failed", invoice(project.id, { status: "open", amount_paid: 0, attempt_count: attempt }));
    const first = failed(1);
    await processStripeEvent(db, stripe, first);
    await processStripeEvent(db, stripe, first);
    await processStripeEvent(db, stripe, failed(2));
    const [row] = await db.select().from(t.invoices);
    assert.ok(row.lastFailureAt);
    assert.equal(row.attemptCount, 2);
    const notices = (await db.select().from(t.emailLog)).filter((email) => email.template === "failedPayment");
    assert.equal(notices.length, 2);
  });

  test("refunds update the payment from Stripe's charge", async () => {
    const { stripe } = makeStripe();
    const { project } = await paidProject(stripe);
    await processStripeEvent(db, stripe, event("charge.refunded", { id: "ch_1", payment_intent: "pi_test_deposit", amount: 65_000, amount_refunded: 20_000 }));
    let [payment] = await db.select().from(t.payments);
    assert.equal(payment.refundedCents, 20_000);
    assert.equal(payment.status, "partially_refunded");
    await processStripeEvent(db, stripe, event("charge.refunded", { id: "ch_1", payment_intent: "pi_test_deposit", amount: 65_000, amount_refunded: 65_000 }));
    [payment] = await db.select().from(t.payments);
    assert.equal(payment.status, "refunded");
    const events = await db.select().from(t.projectEvents).where(eq(t.projectEvents.projectId, project.id));
    assert.ok(events.some((row) => row.kind === "refund"));
  });

  test("subscriptions are mirrored with a three-month minimum, and a live site moves to Maintenance Active", async () => {
    const { stripe } = makeStripe();
    const { project } = await paidProject(stripe);
    await db.update(t.projects).set({ status: "live" }).where(eq(t.projects.id, project.id));
    await processStripeEvent(db, stripe, event("customer.subscription.created", subscriptionFixture({ projectId: project.id })));
    const [subscription] = await db.select().from(t.subscriptions);
    assert.equal(subscription.status, "active");
    assert.equal(subscription.monthlyCents, 9_900);
    const months = (subscription.minimumTermEnd.getTime() - Date.now()) / (30 * 86_400_000);
    assert.ok(months > 2.9 && months < 3.1);
    assert.equal((await db.select().from(t.projects))[0].status, "maintenance_active");

    await processStripeEvent(db, stripe, event("customer.subscription.deleted", subscriptionFixture({ projectId: project.id, status: "canceled", canceled_at: Math.floor(Date.now() / 1000) })));
    assert.equal((await db.select().from(t.subscriptions))[0].status, "canceled");
    assert.equal((await db.select().from(t.projects))[0].status, "live");
  });

  test("subscriptions without care metadata are ignored", async () => {
    const { stripe } = makeStripe();
    await processStripeEvent(db, stripe, event("customer.subscription.created", { ...subscriptionFixture(), metadata: {} }));
    assert.equal((await db.select().from(t.subscriptions)).length, 0);
  });

  test("a deposit payment never starts a subscription", async () => {
    const { stripe, count } = makeStripe();
    await paidProject(stripe);
    assert.equal((await db.select().from(t.subscriptions)).length, 0);
    assert.equal(count("subscriptions.retrieve"), 0);
  });
});

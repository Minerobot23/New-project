import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { INVITE_LINK_HOURS, createLoginToken } from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import {
  agreementAcceptances,
  careActivations,
  checkoutIntents,
  customers,
  invoices,
  payments,
  projectEvents,
  projects,
  quotes,
  subscriptions,
  users,
  webhookEvents,
} from "@/lib/db/schema";
import { adminRecipient, sendAll, type Outgoing } from "@/lib/notify/send";
import { templates } from "@/lib/notify/templates";
import { appUrl } from "@/lib/security";
import { CARE_MINIMUM_MONTHS, PLANS, priceSummary } from "./plans";

/*
 * Stripe webhook processing: the only code that turns payments into records.
 *
 * Idempotency, in layers:
 * 1. The event id is inserted into webhook_events in the same transaction as the event's effects. A redelivered
 *    event finds its id and is skipped; a failed one rolls back entirely and Stripe retries it.
 * 2. Unique constraints on Stripe ids (payment intent, invoice, subscription, checkout intent per project) mean two
 *    different events about the same payment still produce one record.
 * 3. Notifications are sent after commit through email_log dedupe keys, so each email goes out once.
 */

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type Effects = { emails: Outgoing[] };

export const HANDLED_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "invoice.finalized",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.voided",
  "invoice.marked_uncollectible",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "charge.refunded",
] as const;

const idOf = (value: string | { id: string } | null | undefined) => (typeof value === "string" ? value : (value?.id ?? null));
const toDate = (unix: number | null | undefined) => (unix ? new Date(unix * 1000) : null);
const addMonths = (date: Date, months: number) => {
  const copy = new Date(date);
  copy.setUTCMonth(copy.getUTCMonth() + months);
  return copy;
};
const formatDate = (date: Date) => date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" });

export async function processStripeEvent(db: Db, stripe: Stripe, event: Stripe.Event): Promise<"processed" | "duplicate" | "ignored"> {
  if (!(HANDLED_EVENTS as readonly string[]).includes(event.type)) return "ignored";
  const effects: Effects = { emails: [] };

  const outcome = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({ id: event.id, type: event.type, livemode: event.livemode })
      .onConflictDoNothing()
      .returning({ id: webhookEvents.id });
    if (inserted.length === 0) return "duplicate" as const;
    await dispatch(tx, stripe, event, effects);
    return "processed" as const;
  });

  if (outcome === "processed") await sendAll(db, effects.emails);
  return outcome;
}

async function dispatch(tx: Tx, stripe: Stripe, event: Stripe.Event, effects: Effects) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.metadata?.kind === "deposit" && session.payment_status === "paid") await fulfillDeposit(tx, session, effects);
      if (session.metadata?.kind === "care" && session.status === "complete") await recordCareCheckout(tx, stripe, session, effects);
      return;
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      if (session.metadata?.kind === "deposit" && session.metadata.intentId) {
        await tx
          .update(checkoutIntents)
          .set({ status: "expired" })
          .where(and(eq(checkoutIntents.id, session.metadata.intentId), eq(checkoutIntents.status, "open")));
      }
      return;
    }
    case "invoice.finalized":
    case "invoice.voided":
    case "invoice.marked_uncollectible":
      await upsertInvoice(tx, event.data.object);
      return;
    case "invoice.paid":
      await recordInvoicePaid(tx, stripe, event.data.object, effects);
      return;
    case "invoice.payment_failed":
      await recordInvoiceFailed(tx, event.data.object, effects);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscription(tx, event.data.object);
      return;
    case "charge.refunded":
      await recordRefund(tx, event.data.object);
      return;
  }
}

/* ---------------- Deposits ---------------- */

async function fulfillDeposit(tx: Tx, session: Stripe.Checkout.Session, effects: Effects) {
  const intentId = session.metadata?.intentId;
  if (!intentId) return;
  const [intent] = await tx.select().from(checkoutIntents).where(eq(checkoutIntents.id, intentId)).limit(1);
  if (!intent) {
    console.error(`[webhook] deposit for unknown intent ${intentId} (session ${session.id})`);
    return;
  }

  // User and customer: one per email; reused if this person buys again.
  const [user] = await tx
    .insert(users)
    .values({ email: intent.email, name: intent.contactName, role: "client" })
    .onConflictDoUpdate({ target: users.email, set: { name: sql`coalesce(${users.name}, excluded.name)` } })
    .returning();
  const stripeCustomerId = idOf(session.customer);
  const [customer] = await tx
    .insert(customers)
    .values({ userId: user.id, contactName: intent.contactName, businessName: intent.businessName, phone: intent.phone, stripeCustomerId })
    .onConflictDoUpdate({
      target: customers.userId,
      set: { stripeCustomerId: sql`coalesce(${customers.stripeCustomerId}, excluded.stripe_customer_id)` },
    })
    .returning();

  // The unique checkout_intent_id makes this a no-op if another event already created the project.
  const [project] = await tx
    .insert(projects)
    .values({
      customerId: customer.id,
      plan: intent.plan,
      status: "deposit_paid",
      devPriceCents: intent.devPriceCents,
      depositCents: intent.depositCents,
      monthlyCents: intent.monthlyCents,
      checkoutIntentId: intent.id,
      quoteId: intent.quoteId,
      livemode: session.livemode,
    })
    .onConflictDoNothing({ target: projects.checkoutIntentId })
    .returning();
  if (!project) return;

  const paid = session.amount_total ?? 0;
  await tx
    .insert(payments)
    .values({
      projectId: project.id,
      kind: "deposit",
      stripePaymentIntentId: idOf(session.payment_intent),
      amountCents: paid,
      currency: session.currency ?? "usd",
    })
    .onConflictDoNothing();
  await tx.update(checkoutIntents).set({ status: "completed" }).where(eq(checkoutIntents.id, intent.id));
  await tx
    .update(agreementAcceptances)
    .set({ projectId: project.id, userId: user.id })
    .where(eq(agreementAcceptances.checkoutIntentId, intent.id));
  if (intent.quoteId) await tx.update(quotes).set({ status: "paid" }).where(eq(quotes.id, intent.quoteId));
  await tx.insert(projectEvents).values({ projectId: project.id, kind: "deposit_paid", detail: `Deposit of ${paid / 100} ${session.currency ?? "usd"} confirmed by Stripe (${session.id}).` });
  if (paid !== intent.depositCents) {
    await tx.insert(projectEvents).values({ projectId: project.id, kind: "amount_mismatch", detail: `Expected ${intent.depositCents}, Stripe reported ${paid}.` });
  }

  const summary = priceSummary(intent);
  const token = await createLoginToken(tx as unknown as Db, intent.email, { next: `/client/onboarding?project=${project.id}`, ttlMinutes: INVITE_LINK_HOURS * 60 });
  const name = intent.contactName.split(" ")[0];
  effects.emails.push(
    {
      template: "depositConfirmation",
      to: intent.email,
      dedupeKey: `deposit-confirmation:${project.id}`,
      rendered: templates.depositConfirmation({ name, planName: PLANS[intent.plan].name, depositCents: paid, balanceCents: summary.balanceCents, monthlyCents: summary.monthlyCents }),
    },
    {
      template: "onboardingInvitation",
      to: intent.email,
      dedupeKey: `onboarding-invitation:${project.id}`,
      rendered: templates.onboardingInvitation({ name, link: `${appUrl()}/auth/verify?token=${token}`, hours: INVITE_LINK_HOURS }),
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-deposit:${project.id}`,
      rendered: templates.adminAlert({
        title: `New ${PLANS[intent.plan].name} deposit: ${intent.businessName}`,
        lines: [
          ["Customer", `${intent.contactName} <${intent.email}>`],
          ["Deposit", `$${(paid / 100).toFixed(2)}`],
          ["Mode", session.livemode ? "Live" : "Test"],
        ],
        link: `${appUrl()}/admin/projects/${project.id}`,
      }),
    },
  );
}

/* ---------------- Invoices ---------------- */

const invoiceKind = (invoice: Stripe.Invoice): "final" | "subscription" | null => {
  if (invoice.metadata?.kind === "final") return "final";
  if (invoice.parent?.subscription_details?.subscription) return "subscription";
  return null;
};

async function projectIdForInvoice(tx: Tx, invoice: Stripe.Invoice) {
  if (invoice.metadata?.projectId) return invoice.metadata.projectId;
  const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription);
  const fromMeta = invoice.parent?.subscription_details?.metadata?.projectId;
  if (fromMeta) return fromMeta;
  if (!subscriptionId) return null;
  const [row] = await tx.select({ projectId: subscriptions.projectId }).from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, subscriptionId)).limit(1);
  return row?.projectId ?? null;
}

async function upsertInvoice(tx: Tx, invoice: Stripe.Invoice) {
  const kind = invoiceKind(invoice);
  if (!kind || !invoice.id) return null;
  const projectId = await projectIdForInvoice(tx, invoice);
  if (!projectId) return null;
  const values = {
    projectId,
    stripeInvoiceId: invoice.id,
    kind,
    amountDueCents: invoice.amount_due,
    amountPaidCents: invoice.amount_paid,
    status: invoice.status ?? "draft",
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    attemptCount: invoice.attempt_count,
    dueAt: toDate(invoice.due_date),
  };
  await tx
    .insert(invoices)
    .values(values)
    .onConflictDoUpdate({ target: invoices.stripeInvoiceId, set: { ...values, updatedAt: new Date() } });
  return { kind, projectId };
}

async function paymentIntentForInvoice(stripe: Stripe, invoiceId: string) {
  try {
    const list = await stripe.invoicePayments.list({ invoice: invoiceId, limit: 1 });
    return idOf(list.data[0]?.payment?.payment_intent ?? null);
  } catch {
    return null;
  }
}

async function recordInvoicePaid(tx: Tx, stripe: Stripe, invoice: Stripe.Invoice, effects: Effects) {
  const result = await upsertInvoice(tx, invoice);
  if (!result || !invoice.id) return;
  const paymentIntentId = await paymentIntentForInvoice(stripe, invoice.id);
  const inserted = await tx
    .insert(payments)
    .values({
      projectId: result.projectId,
      kind: result.kind,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: paymentIntentId,
      amountCents: invoice.amount_paid,
      currency: invoice.currency,
    })
    .onConflictDoNothing()
    .returning({ id: payments.id });
  if (inserted.length === 0) return;

  const [row] = await tx
    .select({ project: projects, user: users, customer: customers })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(projects.id, result.projectId))
    .limit(1);
  if (!row) return;

  if (result.kind === "final") {
    // Paid in full: ready for launch (only moves forward from the payment-pending stages).
    await tx
      .update(projects)
      .set({ status: "ready_for_launch", updatedAt: new Date() })
      .where(and(eq(projects.id, result.projectId), inArray(projects.status, ["final_payment_pending", "client_review", "in_development"])));
    await tx.insert(projectEvents).values({ projectId: result.projectId, kind: "final_paid", detail: `Final balance paid (${invoice.id}).` });
    effects.emails.push({
      template: "finalPaymentConfirmation",
      to: row.user.email,
      dedupeKey: `final-paid:${invoice.id}`,
      rendered: templates.finalPaymentConfirmation({ name: row.customer.contactName.split(" ")[0], amountCents: invoice.amount_paid }),
    });
  }
}

async function recordInvoiceFailed(tx: Tx, invoice: Stripe.Invoice, effects: Effects) {
  const result = await upsertInvoice(tx, invoice);
  if (!result || !invoice.id) return;
  await tx.update(invoices).set({ lastFailureAt: new Date() }).where(eq(invoices.stripeInvoiceId, invoice.id));
  const [row] = await tx
    .select({ user: users, customer: customers })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(projects.id, result.projectId))
    .limit(1);
  await tx.insert(projectEvents).values({ projectId: result.projectId, kind: "payment_failed", detail: `Payment attempt ${invoice.attempt_count} failed (${invoice.id}).` });
  if (!row) return;
  effects.emails.push(
    {
      template: "failedPayment",
      to: row.user.email,
      // One email per attempt: retries of this same event don't resend, a new failed attempt does.
      dedupeKey: `payment-failed:${invoice.id}:${invoice.attempt_count}`,
      rendered: templates.failedPayment({
        name: row.customer.contactName.split(" ")[0],
        amountCents: invoice.amount_due,
        link: invoice.hosted_invoice_url ?? `${appUrl()}/client/dashboard`,
      }),
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-payment-failed:${invoice.id}:${invoice.attempt_count}`,
      rendered: templates.adminAlert({
        title: `Payment failed: ${row.customer.businessName}`,
        lines: [
          ["Invoice", invoice.id],
          ["Amount", `$${(invoice.amount_due / 100).toFixed(2)}`],
          ["Attempt", String(invoice.attempt_count)],
        ],
        link: `${appUrl()}/admin/projects/${result.projectId}`,
      }),
    },
  );
}

/* ---------------- Website Care subscriptions ---------------- */

const periodEnd = (subscription: Stripe.Subscription) => toDate(subscription.items.data[0]?.current_period_end ?? null);

async function upsertSubscription(tx: Tx, subscription: Stripe.Subscription) {
  const projectId = subscription.metadata?.projectId;
  if (!projectId || subscription.metadata?.kind !== "care") return;
  const start = toDate(subscription.start_date) ?? new Date();
  const values = {
    projectId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    monthlyCents: subscription.items.data[0]?.price?.unit_amount ?? 0,
    currentPeriodEnd: periodEnd(subscription),
    minimumTermEnd: subscription.metadata.minimumTermEnd ? new Date(subscription.metadata.minimumTermEnd) : addMonths(start, CARE_MINIMUM_MONTHS),
    cancelAt: toDate(subscription.cancel_at),
    canceledAt: toDate(subscription.canceled_at),
  };
  await tx
    .insert(subscriptions)
    .values(values)
    .onConflictDoUpdate({ target: subscriptions.stripeSubscriptionId, set: { ...values, updatedAt: new Date() } });
  if (subscription.status === "active") {
    await tx.update(careActivations).set({ status: "active", updatedAt: new Date() }).where(eq(careActivations.projectId, projectId));
    await tx
      .update(projects)
      .set({ status: "maintenance_active", updatedAt: new Date() })
      .where(and(eq(projects.id, projectId), eq(projects.status, "live")));
  }
  if (subscription.status === "canceled") {
    // Care has ended: the site stays live, but it's no longer on an active maintenance plan.
    await tx.update(projects).set({ status: "live", updatedAt: new Date() }).where(and(eq(projects.id, projectId), eq(projects.status, "maintenance_active")));
  }
}

async function recordCareCheckout(tx: Tx, stripe: Stripe, session: Stripe.Checkout.Session, effects: Effects) {
  const projectId = session.metadata?.projectId;
  const subscriptionId = idOf(session.subscription);
  if (!projectId || !subscriptionId) return;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await upsertSubscription(tx, subscription);
  await tx.insert(projectEvents).values({ projectId, kind: "care_activated", detail: `Website Care subscription ${subscriptionId} started by the customer.` });

  const [row] = await tx
    .select({ user: users, customer: customers, sub: subscriptions })
    .from(subscriptions)
    .innerJoin(projects, eq(projects.id, subscriptions.projectId))
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);
  if (!row) return;
  effects.emails.push({
    template: "subscriptionActivation",
    to: row.user.email,
    dedupeKey: `care-active:${projectId}`,
    rendered: templates.subscriptionActivation({
      name: row.customer.contactName.split(" ")[0],
      monthlyCents: row.sub.monthlyCents,
      minimumEnd: formatDate(row.sub.minimumTermEnd),
      link: `${appUrl()}/client/dashboard`,
    }),
  });
}

/* ---------------- Refunds ---------------- */

async function recordRefund(tx: Tx, charge: Stripe.Charge) {
  const paymentIntentId = idOf(charge.payment_intent);
  if (!paymentIntentId) return;
  const status = charge.amount_refunded >= charge.amount ? "refunded" : charge.amount_refunded > 0 ? "partially_refunded" : "succeeded";
  const updated = await tx
    .update(payments)
    .set({ refundedCents: charge.amount_refunded, status, stripeChargeId: charge.id })
    .where(eq(payments.stripePaymentIntentId, paymentIntentId))
    .returning({ projectId: payments.projectId });
  for (const row of updated) {
    await tx.insert(projectEvents).values({ projectId: row.projectId, kind: "refund", detail: `Stripe reports $${(charge.amount_refunded / 100).toFixed(2)} refunded on ${charge.id}.` });
  }
}

/* ---------------- Reconciliation ---------------- */

/*
 * The same handlers, applied to objects fetched from Stripe rather than delivered by a webhook.
 * Used by the admin "Sync with Stripe" action and the daily cron to recover from missed or delayed events.
 * Everything stays idempotent through the same unique constraints and email dedupe keys.
 */

async function applyWithEffects(db: Db, work: (tx: Tx, effects: Effects) => Promise<void>) {
  const effects: Effects = { emails: [] };
  await db.transaction((tx) => work(tx, effects));
  await sendAll(db, effects.emails);
}

export function reconcileCheckoutSession(db: Db, stripe: Stripe, session: Stripe.Checkout.Session) {
  return applyWithEffects(db, async (tx, effects) => {
    if (session.metadata?.kind === "deposit" && session.payment_status === "paid") await fulfillDeposit(tx, session, effects);
    if (session.metadata?.kind === "deposit" && session.status === "expired" && session.metadata.intentId) {
      await tx
        .update(checkoutIntents)
        .set({ status: "expired" })
        .where(and(eq(checkoutIntents.id, session.metadata.intentId), eq(checkoutIntents.status, "open")));
    }
    if (session.metadata?.kind === "care" && session.status === "complete") await recordCareCheckout(tx, stripe, session, effects);
  });
}

export function reconcileInvoice(db: Db, stripe: Stripe, invoice: Stripe.Invoice) {
  return applyWithEffects(db, async (tx, effects) => {
    if (invoice.status === "paid") await recordInvoicePaid(tx, stripe, invoice, effects);
    else await upsertInvoice(tx, invoice);
  });
}

export function reconcileSubscription(db: Db, subscription: Stripe.Subscription) {
  return applyWithEffects(db, (tx) => upsertSubscription(tx, subscription));
}

export function reconcileCharge(db: Db, charge: Stripe.Charge) {
  return applyWithEffects(db, (tx) => recordRefund(tx, charge));
}

import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { INVITE_LINK_HOURS } from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import {
  agreementAcceptances,
  billingQuarantine,
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
import { adminRecipient, deliverNotification, enqueueNotifications, type Outgoing } from "@/lib/notify/send";
import { appUrl } from "@/lib/security";
import { stripeMode } from "./config";
import { CARE_MINIMUM_MONTHS, CURRENCY, PLANS, priceSummary } from "./plans";

/*
 * Stripe webhook processing: the only code that turns payments into records.
 *
 * Idempotency, in layers:
 * 1. The event id is inserted into webhook_events in the same transaction as the event's effects. A redelivered
 *    event finds its id and is skipped; a failed one rolls back entirely and Stripe retries it.
 * 2. Unique constraints on Stripe ids (payment intent, invoice, subscription, checkout intent per project) mean two
 *    different events about the same payment still produce one record.
 * 3. Notifications are written to the email outbox inside the same transaction, then delivered after commit.
 *    A crash or a provider failure leaves them queued for retry; dedupe keys mean each goes out once.
 *
 * Authenticity is not the same as correctness: a signed event proves Stripe sent it, not that it matches the
 * order. Deposits are checked against the stored checkout (session, amount, currency, mode) before anything is
 * created, and events from the wrong environment (test vs live) are refused. Mismatches are quarantined for an
 * administrator, with nothing fulfilled.
 */

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type Effects = { emails: Outgoing[]; rejected?: boolean };

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

export type EventOutcome = "processed" | "duplicate" | "ignored" | "rejected";

/** The mode this deployment bills in: live only with a live key; everything else is test. */
const deploymentIsLive = () => stripeMode() === "live";

export async function processStripeEvent(db: Db, stripe: Stripe, event: Stripe.Event): Promise<EventOutcome> {
  if (!(HANDLED_EVENTS as readonly string[]).includes(event.type)) return "ignored";
  const effects: Effects = { emails: [] };

  const outcome = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({ id: event.id, type: event.type, livemode: event.livemode })
      .onConflictDoNothing()
      .returning({ id: webhookEvents.id });
    if (inserted.length === 0) return "duplicate" as const;

    // Environment isolation: a test event must never change live records, and vice versa.
    if (event.livemode !== deploymentIsLive()) {
      const object = event.data.object as { id?: string };
      await quarantine(tx, effects, event, {
        reason: "wrong_mode",
        objectId: object.id ?? null,
        detail: { eventLivemode: event.livemode, deploymentLivemode: deploymentIsLive() },
      });
      await enqueueNotifications(tx, effects.emails);
      return "rejected" as const;
    }

    await dispatch(tx, stripe, event, effects);
    await enqueueNotifications(tx, effects.emails);
    return effects.rejected ? ("rejected" as const) : ("processed" as const);
  });

  // Committed: now try to deliver. Anything that fails stays queued and is retried later.
  if (outcome !== "duplicate") for (const email of effects.emails) await deliverNotification(db, email.dedupeKey);
  return outcome;
}

/** Records an authentic event we won't act on, and alerts the administrator. */
async function quarantine(
  tx: Tx,
  effects: Effects,
  event: Stripe.Event,
  { reason, objectId, intentId = null, detail }: { reason: string; objectId: string | null; intentId?: string | null; detail: Record<string, unknown> },
) {
  effects.rejected = true;
  await tx.insert(billingQuarantine).values({
    eventId: event.id,
    eventType: event.type,
    stripeObjectId: objectId,
    checkoutIntentId: intentId,
    reason,
    detail,
    livemode: event.livemode,
  });
  console.error(`[webhook] quarantined ${event.type} ${event.id}: ${reason}`);
  effects.emails.push({
    template: "adminAlert",
    to: adminRecipient(),
    dedupeKey: `admin-quarantine:${event.id}`,
    data: {
      title: `Payment needs review: ${reason.replace(/_/g, " ")}`,
      lines: [
        ["Stripe event", `${event.type} (${event.id})`],
        ["Object", objectId ?? "unknown"],
        ["Mode", event.livemode ? "Live" : "Test"],
        ["Action", "Nothing was fulfilled. Review in Stripe and the admin dashboard."],
      ],
      link: `${appUrl()}/admin`,
    },
  });
}

async function dispatch(tx: Tx, stripe: Stripe, event: Stripe.Event, effects: Effects) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.metadata?.kind === "deposit" && session.payment_status === "paid") await fulfillDeposit(tx, event, session, effects);
      if (session.metadata?.kind === "care" && session.status === "complete") await recordCareCheckout(tx, stripe, event, session, effects);
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
      if (session.metadata?.kind === "care") await releaseCareAttempt(tx, session.id);
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
      await upsertSubscription(tx, stripe, event, event.data.object, effects);
      return;
    case "charge.refunded":
      await recordRefund(tx, event.data.object);
      return;
  }
}

/* ---------------- Deposits ---------------- */

/** Why a paid deposit session doesn't match its stored checkout, or null if it matches exactly. */
function depositMismatch(intent: typeof checkoutIntents.$inferSelect, session: Stripe.Checkout.Session) {
  if (session.client_reference_id && session.client_reference_id !== intent.id) return "intent_reference_mismatch";
  if (intent.stripeSessionId && intent.stripeSessionId !== session.id) return "session_mismatch";
  if (session.amount_total !== intent.depositCents) return "amount_mismatch";
  if ((session.currency ?? "").toLowerCase() !== CURRENCY) return "currency_mismatch";
  if (session.mode !== "payment") return "checkout_mode_mismatch";
  if (intent.stripeSessionId && intent.livemode !== session.livemode) return "mode_mismatch";
  return null;
}

async function fulfillDeposit(tx: Tx, event: Stripe.Event, session: Stripe.Checkout.Session, effects: Effects) {
  const intentId = session.metadata?.intentId;
  const intent = intentId && /^[0-9a-f-]{36}$/i.test(intentId) ? (await tx.select().from(checkoutIntents).where(eq(checkoutIntents.id, intentId)).limit(1))[0] : undefined;
  if (!intent) {
    await quarantine(tx, effects, event, { reason: "unknown_intent", objectId: session.id, detail: { intentId: intentId ?? null } });
    return;
  }

  // Already fulfilled by an earlier event for this same session (e.g. completed, then async_payment_succeeded).
  if (intent.status === "completed" && intent.stripeSessionId === session.id) return;
  if (intent.status !== "open") {
    await quarantine(tx, effects, event, { reason: `intent_${intent.status}`, objectId: session.id, intentId: intent.id, detail: { intentStatus: intent.status } });
    return;
  }

  const mismatch = depositMismatch(intent, session);
  if (mismatch) {
    await tx.update(checkoutIntents).set({ status: "quarantined" }).where(eq(checkoutIntents.id, intent.id));
    await quarantine(tx, effects, event, {
      reason: mismatch,
      objectId: session.id,
      intentId: intent.id,
      detail: {
        expected: { sessionId: intent.stripeSessionId, amount: intent.depositCents, currency: CURRENCY, livemode: intent.livemode },
        received: { sessionId: session.id, amount: session.amount_total, currency: session.currency, livemode: session.livemode },
      },
    });
    return;
  }

  // The event can arrive before the checkout request stored the session id. Claim it now, atomically:
  // if another session has been recorded in the meantime, this one doesn't match and is quarantined.
  if (!intent.stripeSessionId) {
    const claimed = await tx
      .update(checkoutIntents)
      .set({ stripeSessionId: session.id, livemode: session.livemode })
      .where(and(eq(checkoutIntents.id, intent.id), sql`${checkoutIntents.stripeSessionId} is null`))
      .returning({ id: checkoutIntents.id });
    if (claimed.length === 0) {
      await tx.update(checkoutIntents).set({ status: "quarantined" }).where(eq(checkoutIntents.id, intent.id));
      await quarantine(tx, effects, event, { reason: "session_mismatch", objectId: session.id, intentId: intent.id, detail: { note: "another session was recorded first" } });
      return;
    }
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

  const summary = priceSummary(intent);
  const name = intent.contactName.split(" ")[0];
  effects.emails.push(
    {
      template: "depositConfirmation",
      to: intent.email,
      dedupeKey: `deposit-confirmation:${project.id}`,
      data: { name, planName: PLANS[intent.plan].name, depositCents: paid, balanceCents: summary.balanceCents, monthlyCents: summary.monthlyCents },
    },
    {
      template: "onboardingInvitation",
      to: intent.email,
      dedupeKey: `onboarding-invitation:${project.id}`,
      data: { name, hours: INVITE_LINK_HOURS },
      // The sign-in link is minted when the email is sent, so a retried email carries a fresh, unexpired link.
      signIn: { next: `/client/onboarding?project=${project.id}`, ttlMinutes: INVITE_LINK_HOURS * 60 },
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-deposit:${project.id}`,
      data: {
        title: `New ${PLANS[intent.plan].name} deposit: ${intent.businessName}`,
        lines: [
          ["Customer", `${intent.contactName} <${intent.email}>`],
          ["Deposit", `$${(paid / 100).toFixed(2)}`],
          ["Mode", session.livemode ? "Live" : "Test"],
        ],
        link: `${appUrl()}/admin/projects/${project.id}`,
      },
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
      data: { name: row.customer.contactName.split(" ")[0], amountCents: invoice.amount_paid },
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
      data: {
        name: row.customer.contactName.split(" ")[0],
        amountCents: invoice.amount_due,
        link: invoice.hosted_invoice_url ?? `${appUrl()}/client/dashboard`,
      },
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-payment-failed:${invoice.id}:${invoice.attempt_count}`,
      data: {
        title: `Payment failed: ${row.customer.businessName}`,
        lines: [
          ["Invoice", invoice.id],
          ["Amount", `$${(invoice.amount_due / 100).toFixed(2)}`],
          ["Attempt", String(invoice.attempt_count)],
        ],
        link: `${appUrl()}/admin/projects/${result.projectId}`,
      },
    },
  );
}

/* ---------------- Website Care subscriptions ---------------- */

const periodEnd = (subscription: Stripe.Subscription) => toDate(subscription.items.data[0]?.current_period_end ?? null);

const LIVE_SUBSCRIPTION = ["active", "trialing", "past_due", "unpaid", "incomplete"];

/**
 * Mirrors a Website Care subscription. A project has at most one subscription row: a new subscription may replace
 * one that has ended (re-activation after cancellation), but a second live subscription for the same project is a
 * duplicate. It's cancelled immediately so it can't renew, and the administrator is alerted to refund any charge.
 */
async function upsertSubscription(tx: Tx, stripe: Stripe, event: Stripe.Event, subscription: Stripe.Subscription, effects: Effects) {
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
    updatedAt: new Date(),
  };

  const [existing] = await tx.select().from(subscriptions).where(eq(subscriptions.projectId, projectId)).limit(1);
  if (existing && existing.stripeSubscriptionId !== subscription.id) {
    const existingLive = LIVE_SUBSCRIPTION.includes(existing.status);
    if (existingLive) {
      // A different subscription for a project that already has a live one.
      if (LIVE_SUBSCRIPTION.includes(subscription.status)) {
        await stripe.subscriptions.cancel(subscription.id, {}, { idempotencyKey: `cancel-duplicate:${subscription.id}` });
        await tx.insert(projectEvents).values({ projectId, kind: "duplicate_subscription", detail: `Duplicate subscription ${subscription.id} cancelled; ${existing.stripeSubscriptionId} kept.` });
        await quarantine(tx, effects, event, {
          reason: "duplicate_subscription",
          objectId: subscription.id,
          detail: { projectId, kept: existing.stripeSubscriptionId, cancelled: subscription.id, note: "Refund any charge on the cancelled subscription in Stripe." },
        });
      }
      return;
    }
    // The previous subscription has ended: this one replaces it (re-activation).
    await tx.update(subscriptions).set(values).where(eq(subscriptions.projectId, projectId));
  } else {
    await tx
      .insert(subscriptions)
      .values(values)
      .onConflictDoUpdate({ target: subscriptions.stripeSubscriptionId, set: values });
  }

  if (subscription.status === "active") {
    await tx.update(careActivations).set({ status: "active", updatedAt: new Date() }).where(eq(careActivations.projectId, projectId));
    await tx.update(projects).set({ status: "maintenance_active", updatedAt: new Date() }).where(and(eq(projects.id, projectId), eq(projects.status, "live")));
  }
  if (subscription.status === "canceled") {
    // Care has ended: the site stays live, but it's no longer on an active maintenance plan.
    await tx.update(projects).set({ status: "live", updatedAt: new Date() }).where(and(eq(projects.id, projectId), eq(projects.status, "maintenance_active")));
  }
}

/** An unfinished Website Care checkout expired: clear the attempt so the customer can start a fresh one. */
async function releaseCareAttempt(tx: Tx, sessionId: string) {
  await tx
    .update(careActivations)
    .set({ status: "invited", attemptId: null, stripeSessionId: null, stripeSessionUrl: null, sessionExpiresAt: null, updatedAt: new Date() })
    .where(and(eq(careActivations.stripeSessionId, sessionId), eq(careActivations.status, "consented")));
}

async function recordCareCheckout(tx: Tx, stripe: Stripe, event: Stripe.Event, session: Stripe.Checkout.Session, effects: Effects) {
  const projectId = session.metadata?.projectId;
  const subscriptionId = idOf(session.subscription);
  if (!projectId || !subscriptionId) return;

  const [activation] = await tx.select().from(careActivations).where(eq(careActivations.projectId, projectId)).limit(1);
  const matchesAttempt = activation && (activation.stripeSessionId === session.id || (activation.attemptId && session.metadata?.attemptId === activation.attemptId));
  if (!matchesAttempt) {
    await tx.insert(projectEvents).values({ projectId, kind: "care_session_unexpected", detail: `Care checkout ${session.id} didn't match the current attempt.` });
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await upsertSubscription(tx, stripe, event, subscription, effects);
  if (effects.rejected) return;
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
    dedupeKey: `care-active:${subscriptionId}`,
    data: {
      name: row.customer.contactName.split(" ")[0],
      monthlyCents: row.sub.monthlyCents,
      minimumEnd: formatDate(row.sub.minimumTermEnd),
      link: `${appUrl()}/client/dashboard`,
    },
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

async function applyWithEffects(db: Db, livemode: boolean, work: (tx: Tx, effects: Effects) => Promise<void>) {
  const effects: Effects = { emails: [] };
  // Reconciliation follows the same environment rule as webhooks.
  if (livemode !== deploymentIsLive()) return "rejected" as const;
  await db.transaction(async (tx) => {
    await work(tx, effects);
    await enqueueNotifications(tx, effects.emails);
  });
  for (const email of effects.emails) await deliverNotification(db, email.dedupeKey);
  return effects.rejected ? ("rejected" as const) : ("processed" as const);
}

/** A stand-in event for objects fetched from Stripe (not delivered by webhook), used in quarantine records. */
const syntheticEvent = (type: string, object: { id: string; livemode: boolean }) =>
  ({ id: `reconcile:${object.id}:${Date.now()}`, type, livemode: object.livemode, data: { object } }) as unknown as Stripe.Event;

export function reconcileCheckoutSession(db: Db, stripe: Stripe, session: Stripe.Checkout.Session) {
  const event = syntheticEvent("reconcile.checkout_session", session);
  return applyWithEffects(db, session.livemode, async (tx, effects) => {
    if (session.metadata?.kind === "deposit" && session.payment_status === "paid") await fulfillDeposit(tx, event, session, effects);
    if (session.metadata?.kind === "deposit" && session.status === "expired" && session.metadata.intentId) {
      await tx
        .update(checkoutIntents)
        .set({ status: "expired" })
        .where(and(eq(checkoutIntents.id, session.metadata.intentId), eq(checkoutIntents.status, "open")));
    }
    if (session.metadata?.kind === "care" && session.status === "complete") await recordCareCheckout(tx, stripe, event, session, effects);
    if (session.metadata?.kind === "care" && session.status === "expired") await releaseCareAttempt(tx, session.id);
  });
}

export function reconcileInvoice(db: Db, stripe: Stripe, invoice: Stripe.Invoice) {
  return applyWithEffects(db, invoice.livemode, async (tx, effects) => {
    if (invoice.status === "paid") await recordInvoicePaid(tx, stripe, invoice, effects);
    else await upsertInvoice(tx, invoice);
  });
}

export function reconcileSubscription(db: Db, stripe: Stripe, subscription: Stripe.Subscription) {
  const event = syntheticEvent("reconcile.subscription", subscription);
  return applyWithEffects(db, subscription.livemode, (tx, effects) => upsertSubscription(tx, stripe, event, subscription, effects));
}

export function reconcileCharge(db: Db, charge: Stripe.Charge) {
  return applyWithEffects(db, charge.livemode, (tx) => recordRefund(tx, charge));
}

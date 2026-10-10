import "server-only";
import { randomUUID } from "node:crypto";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { WEBSITE_CARE_TERMS, agreementText } from "@/content/agreements";
import type { SessionUser } from "@/lib/auth/core";
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
  supportRequests,
  users,
  type ProjectStatus,
} from "@/lib/db/schema";
import { adminRecipient, sendAll, sendNotification, type Outgoing } from "@/lib/notify/send";
import { appUrl, hashIp, randomToken, sha256 } from "@/lib/security";
import { CURRENCY, PLANS, depositFor, formatCents } from "./plans";
import { reconcileCharge, reconcileCheckoutSession, reconcileInvoice, reconcileSubscription } from "./webhook";

/*
 * Admin and client billing actions. Each one asks Stripe to do something and records that it asked;
 * the resulting money movement (paid, refunded, subscribed) is recorded only when Stripe's webhook confirms it.
 * Every Stripe call that creates something carries an idempotency key, so a double click can't create two.
 */

export type ActionResult<T = undefined> = { ok: true; value?: T } | { ok: false; error: string };

const formatDate = (date: Date) => date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" });
const firstName = (name: string) => name.split(" ")[0] || name;

async function loadProject(db: Db, projectId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) return null;
  const [row] = await db
    .select({ project: projects, customer: customers, user: users })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(projects.id, projectId))
    .limit(1);
  return row ?? null;
}

async function logEvent(db: Db, projectId: string, actor: SessionUser | null, kind: string, detail: string) {
  await db.insert(projectEvents).values({ projectId, actorUserId: actor?.id ?? null, kind, detail });
}

/* ---------------- Project status ---------------- */

/** Statuses that depend on money can only be reached once Stripe has confirmed the payment. */
async function statusBlocker(db: Db, projectId: string, status: ProjectStatus, balanceCents: number): Promise<string | null> {
  const paidKinds = async (kind: "deposit" | "final") =>
    (await db.select({ id: payments.id }).from(payments).where(and(eq(payments.projectId, projectId), eq(payments.kind, kind))).limit(1)).length > 0;

  if (status === "deposit_pending") return "Projects are created when Stripe confirms the deposit; they can't go back to Deposit Pending.";
  if (["ready_for_launch", "live"].includes(status) && balanceCents > 0 && !(await paidKinds("final"))) {
    return "Stripe hasn't confirmed the final payment yet. Send the final invoice; the status updates when it's paid.";
  }
  if (status === "maintenance_active") {
    const [sub] = await db.select({ status: subscriptions.status }).from(subscriptions).where(eq(subscriptions.projectId, projectId)).limit(1);
    if (sub?.status !== "active") return "Website Care isn't active in Stripe for this project.";
  }
  if (status === "final_payment_pending") {
    const [open] = await db
      .select({ id: invoices.id })
      .from(invoices)
      .where(and(eq(invoices.projectId, projectId), eq(invoices.kind, "final"), eq(invoices.status, "open")))
      .limit(1);
    if (!open) return "Use “Create final invoice”: it sets this status once the invoice is sent.";
  }
  return null;
}

const CLIENT_FACING_UPDATES: ProjectStatus[] = ["onboarding", "in_development", "client_review", "ready_for_launch"];

export async function setProjectStatus(db: Db, actor: SessionUser, projectId: string, status: ProjectStatus): Promise<ActionResult> {
  const row = await loadProject(db, projectId);
  if (!row) return { ok: false, error: "Project not found." };
  if (row.project.status === status) return { ok: true };
  const blocker = await statusBlocker(db, projectId, status, row.project.devPriceCents - row.project.depositCents);
  if (blocker) return { ok: false, error: blocker };

  // Marking a site live that already has active Website Care puts it straight into maintenance.
  let next = status;
  if (status === "live") {
    const [sub] = await db.select({ status: subscriptions.status }).from(subscriptions).where(eq(subscriptions.projectId, projectId)).limit(1);
    if (sub?.status === "active") next = "maintenance_active";
  }

  await db.update(projects).set({ status: next, updatedAt: new Date() }).where(eq(projects.id, projectId));
  const [event] = await db
    .insert(projectEvents)
    .values({ projectId, actorUserId: actor.id, kind: "status", detail: `${row.project.status} → ${next}` })
    .returning({ id: projectEvents.id });

  const link = `${appUrl()}/client/dashboard`;
  if (status === "live") {
    await sendNotification(db, {
      template: "launchConfirmation",
      to: row.user.email,
      dedupeKey: `launch:${projectId}`,
      data: { name: firstName(row.customer.contactName), link },
    });
  } else if (CLIENT_FACING_UPDATES.includes(next)) {
    await sendNotification(db, {
      template: "statusUpdate",
      to: row.user.email,
      dedupeKey: `status:${event.id}`,
      data: { name: firstName(row.customer.contactName), status: next, link },
    });
  }
  return { ok: true };
}

/* ---------------- Final balance invoice ---------------- */

export async function createFinalInvoice(db: Db, stripe: Stripe, actor: SessionUser, projectId: string, { daysUntilDue = 7 } = {}): Promise<ActionResult> {
  const row = await loadProject(db, projectId);
  if (!row) return { ok: false, error: "Project not found." };
  const { project, customer, user } = row;
  if (!customer.stripeCustomerId) return { ok: false, error: "This customer has no Stripe customer record yet." };
  if (!["in_development", "client_review", "final_payment_pending"].includes(project.status)) {
    return { ok: false, error: "Final invoices are sent once the site is in development or client review." };
  }
  const balance = project.devPriceCents - project.depositCents;
  if (balance <= 0) return { ok: false, error: "There is no balance to invoice." };

  const existing = await db
    .select({ status: invoices.status })
    .from(invoices)
    .where(and(eq(invoices.projectId, projectId), eq(invoices.kind, "final"), ne(invoices.status, "void")));
  if (existing.some((invoice) => invoice.status === "paid")) return { ok: false, error: "The final balance is already paid." };
  if (existing.some((invoice) => ["open", "draft"].includes(invoice.status))) return { ok: false, error: "A final invoice is already open. Void it in Stripe first to send a new one." };

  // Each attempt after a voided invoice gets its own key; retries of the same attempt reuse it.
  const [{ voided }] = await db
    .select({ voided: sql<number>`count(*)::int` })
    .from(invoices)
    .where(and(eq(invoices.projectId, projectId), eq(invoices.kind, "final"), eq(invoices.status, "void")));
  const key = `final-invoice:${projectId}:${voided}`;
  const plan = PLANS[project.plan];

  const draft = await stripe.invoices.create(
    {
      customer: customer.stripeCustomerId,
      collection_method: "send_invoice",
      days_until_due: daysUntilDue,
      auto_advance: false,
      pending_invoice_items_behavior: "exclude",
      description: `Final balance for your ${plan.name} website by Fluxline Solutions.`,
      metadata: { kind: "final", projectId },
    },
    { idempotencyKey: key },
  );
  await stripe.invoiceItems.create(
    {
      customer: customer.stripeCustomerId,
      invoice: draft.id,
      amount: balance,
      currency: CURRENCY,
      description: `${plan.name} website: remaining 50% of development fee`,
      metadata: { kind: "final", projectId },
    },
    { idempotencyKey: `${key}:item` },
  );
  const invoice = draft.status === "draft" ? await stripe.invoices.finalizeInvoice(draft.id!, {}, { idempotencyKey: `${key}:finalize` }) : draft;

  await reconcileInvoice(db, stripe, invoice);
  await db.update(projects).set({ status: "final_payment_pending", updatedAt: new Date() }).where(eq(projects.id, projectId));
  await logEvent(db, projectId, actor, "final_invoice", `Final invoice ${invoice.id} for ${formatCents(balance)} sent.`);

  if (invoice.hosted_invoice_url) {
    await sendNotification(db, {
      template: "finalInvoice",
      to: user.email,
      dedupeKey: `final-invoice:${invoice.id}`,
      data: {
        name: firstName(customer.contactName),
        amountCents: invoice.amount_due,
        invoiceUrl: invoice.hosted_invoice_url,
        dueDate: invoice.due_date ? formatDate(new Date(invoice.due_date * 1000)) : `${daysUntilDue} days from today`,
      },
    });
  }
  return { ok: true };
}

/* ---------------- Refunds ---------------- */

export async function refundPayment(
  db: Db,
  stripe: Stripe,
  actor: SessionUser,
  { paymentId, amountCents, reason }: { paymentId: string; amountCents: number; reason: string },
): Promise<ActionResult> {
  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) return { ok: false, error: "Payment not found." };
  if (!payment.stripePaymentIntentId) return { ok: false, error: "This payment has no Stripe payment reference; refund it from the Stripe dashboard." };
  const refundable = payment.amountCents - payment.refundedCents;
  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > refundable) {
    return { ok: false, error: `Enter an amount between $0.01 and ${formatCents(refundable)}.` };
  }
  const refund = await stripe.refunds.create(
    {
      payment_intent: payment.stripePaymentIntentId,
      amount: amountCents,
      reason: "requested_by_customer",
      metadata: { projectId: payment.projectId, approvedBy: actor.email, note: reason.slice(0, 450) },
    },
    // Keyed on what's already refunded, so a double submit makes one refund and a later, separate refund still works.
    { idempotencyKey: `refund:${payment.id}:${payment.refundedCents}:${amountCents}` },
  );
  await logEvent(db, payment.projectId, actor, "refund_requested", `Refund ${refund.id} of ${formatCents(amountCents)} approved by ${actor.email}: ${reason.slice(0, 300)}. Status: ${refund.status}.`);
  return { ok: true };
}

/* ---------------- Website Care ---------------- */

export async function careState(db: Db, projectId: string) {
  const [activation] = await db.select().from(careActivations).where(eq(careActivations.projectId, projectId)).limit(1);
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.projectId, projectId)).limit(1);
  return { activation: activation ?? null, subscription: subscription ?? null };
}

const CARE_READY: ProjectStatus[] = ["ready_for_launch", "live"];

/** Admin step 1: offer Website Care. Nothing is charged; the customer must review the terms and authorize it. */
export async function inviteCare(db: Db, actor: SessionUser, projectId: string): Promise<ActionResult> {
  const row = await loadProject(db, projectId);
  if (!row) return { ok: false, error: "Project not found." };
  if (!CARE_READY.includes(row.project.status)) return { ok: false, error: "Website Care can be offered once the site is approved and Ready for Launch." };
  const { subscription } = await careState(db, projectId);
  if (subscription && subscription.status !== "canceled") return { ok: false, error: "This project already has a Website Care subscription." };

  await db
    .insert(careActivations)
    .values({ projectId, status: "invited", invitedBy: actor.id })
    .onConflictDoUpdate({
      target: careActivations.projectId,
      // A fresh offer (including re-activation after a cancellation) starts with no checkout attempt.
      set: { status: "invited", invitedBy: actor.id, attemptId: null, stripeSessionId: null, stripeSessionUrl: null, sessionExpiresAt: null, updatedAt: new Date() },
    });
  await logEvent(db, projectId, actor, "care_invited", `Website Care offered at ${formatCents(row.project.monthlyCents)}/month.`);
  await sendNotification(db, {
    template: "careInvitation",
    to: row.user.email,
    dedupeKey: `care-invite:${projectId}:${Date.now()}`,
    data: {
      name: firstName(row.customer.contactName),
      planName: PLANS[row.project.plan].name,
      monthlyCents: row.project.monthlyCents,
      link: `${appUrl()}/client/care?project=${projectId}`,
    },
  });
  return { ok: true };
}

async function carePrice(stripe: Stripe, lookupKey: string, monthlyCents: number) {
  try {
    const { data } = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
    const price = data[0];
    if (price && price.unit_amount === monthlyCents && price.recurring?.interval === "month") return price.id;
  } catch {
    // Fall through to an inline price.
  }
  return null;
}

/** How long a Website Care checkout link stays usable. Stripe requires at least 30 minutes. */
const CARE_CHECKOUT_MINUTES = 60;

type CareAttempt = { attemptId: string; agreementId: string; expiresAt: Date; reuseUrl: string | null };

/**
 * Claims (or reuses) the single checkout attempt for an activation, under a row lock so concurrent submissions
 * agree on one attempt. A new attempt (and a new recorded acceptance) is made only when there's none, or the
 * previous checkout link has expired.
 */
async function claimCareAttempt(
  db: Db,
  projectId: string,
  acceptance: { email: string; userId: string; ip: string; userAgent: string | null },
): Promise<CareAttempt | { error: string }> {
  return db.transaction(async (tx) => {
    const [activation] = await tx.select().from(careActivations).where(eq(careActivations.projectId, projectId)).for("update").limit(1);
    if (!activation || !["invited", "consented"].includes(activation.status)) return { error: "Website Care hasn't been offered for this project yet." };

    const now = Date.now();
    const usable = activation.attemptId && activation.agreementId && activation.sessionExpiresAt && activation.sessionExpiresAt.getTime() > now + 60_000;
    if (usable) {
      return { attemptId: activation.attemptId!, agreementId: activation.agreementId!, expiresAt: activation.sessionExpiresAt!, reuseUrl: activation.stripeSessionUrl };
    }

    const [recorded] = await tx
      .insert(agreementAcceptances)
      .values({
        kind: "website_care",
        version: WEBSITE_CARE_TERMS.version,
        textHash: sha256(agreementText(WEBSITE_CARE_TERMS)),
        email: acceptance.email,
        projectId,
        userId: acceptance.userId,
        ipHash: hashIp(acceptance.ip),
        userAgent: acceptance.userAgent?.slice(0, 300) ?? null,
      })
      .returning({ id: agreementAcceptances.id });
    const attemptId = randomUUID();
    const expiresAt = new Date(Math.ceil((now + CARE_CHECKOUT_MINUTES * 60_000) / 1000) * 1000);
    await tx
      .update(careActivations)
      .set({ status: "consented", attemptId, agreementId: recorded.id, stripeSessionId: null, stripeSessionUrl: null, sessionExpiresAt: expiresAt, updatedAt: new Date() })
      .where(eq(careActivations.projectId, projectId));
    return { attemptId, agreementId: recorded.id, expiresAt, reuseUrl: null };
  });
}

/**
 * Customer step 2: they accept the Website Care terms (recorded with version and text hash),
 * then authorize the subscription and payment method on Stripe's hosted page.
 *
 * Idempotent per activation: every retry, second tab, or concurrent submission resolves to the same attempt, and
 * the Stripe session is created with that attempt's id as the idempotency key, with identical parameters. So a
 * crash between Stripe creating the session and us saving it is recovered by the next call, which gets the same
 * session back. Only one usable checkout exists per activation at a time.
 */
export async function startCareCheckout(
  db: Db,
  stripe: Stripe,
  user: SessionUser,
  { projectId, termsVersion, ip, userAgent }: { projectId: string; termsVersion: string; ip: string; userAgent: string | null },
): Promise<ActionResult<string>> {
  if (termsVersion !== WEBSITE_CARE_TERMS.version) return { ok: false, error: "The Website Care terms were updated. Please reload and review them again." };
  const row = await loadProject(db, projectId);
  if (!row || row.user.id !== user.id) return { ok: false, error: "Project not found." };
  const { subscription } = await careState(db, projectId);
  if (!CARE_READY.includes(row.project.status)) return { ok: false, error: "Website Care starts once your site is ready for launch." };
  if (subscription && subscription.status !== "canceled" && subscription.status !== "incomplete_expired") return { ok: false, error: "Website Care is already set up for this project." };
  if (!row.customer.stripeCustomerId) return { ok: false, error: "Your billing profile isn't ready yet. Please contact us." };

  const attempt = await claimCareAttempt(db, projectId, { email: user.email, userId: user.id, ip, userAgent });
  if ("error" in attempt) return { ok: false, error: attempt.error };
  if (attempt.reuseUrl) return { ok: true, value: attempt.reuseUrl };

  const plan = PLANS[row.project.plan];
  const priceId = await carePrice(stripe, plan.careLookupKey, row.project.monthlyCents);
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: row.project.monthlyCents,
          recurring: { interval: "month" },
          product_data: { name: `Website Care: ${plan.name}` },
        },
      };
  const metadata = { kind: "care", projectId, agreementId: attempt.agreementId, attemptId: attempt.attemptId };
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    customer: row.customer.stripeCustomerId,
    line_items: [lineItem],
    metadata,
    subscription_data: {
      description: `Website Care for ${row.customer.businessName}. Monthly, three-month minimum, cancel any time from your dashboard.`,
      metadata,
    },
    custom_text: {
      submit: {
        message: `You authorize Fluxline Solutions to charge ${formatCents(row.project.monthlyCents)} every month until you cancel. Three-month minimum. Cancel any time from your client dashboard.`,
      },
    },
    success_url: `${appUrl()}/client/dashboard?care=started`,
    cancel_url: `${appUrl()}/client/care?project=${projectId}&cancelled=1`,
    expires_at: Math.floor(attempt.expiresAt.getTime() / 1000),
  };

  // Same attempt → same key and same parameters → Stripe returns the same session. A concurrent request that's
  // still in flight with this key gets a 409 from Stripe; wait briefly and ask again.
  let session: Stripe.Checkout.Session | null = null;
  for (let tries = 0; tries < 4 && !session; tries++) {
    try {
      session = await stripe.checkout.sessions.create(params, { idempotencyKey: `care-checkout:${attempt.attemptId}` });
    } catch (error) {
      const conflict = (error as { statusCode?: number; type?: string }).statusCode === 409;
      if (!conflict || tries === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (tries + 1)));
    }
  }
  if (!session?.url) return { ok: false, error: "Stripe did not return a checkout link. Please try again." };

  await db
    .update(careActivations)
    .set({ stripeSessionId: session.id, stripeSessionUrl: session.url, updatedAt: new Date() })
    .where(and(eq(careActivations.projectId, projectId), eq(careActivations.attemptId, attempt.attemptId)));
  await logEvent(db, projectId, user, "care_terms_accepted", `Website Care terms ${WEBSITE_CARE_TERMS.version} accepted; checkout attempt ${attempt.attemptId}.`);
  return { ok: true, value: session.url };
}

/** The date cancellation takes effect: the end of the current month, or the end of the minimum term if later. */
export function careCancellationDate(subscription: { currentPeriodEnd: Date | null; minimumTermEnd: Date }) {
  const periodEnd = subscription.currentPeriodEnd ?? new Date();
  return periodEnd > subscription.minimumTermEnd ? periodEnd : subscription.minimumTermEnd;
}

/** One-click cancellation, available to the customer online (automatic-renewal law) and to admins. */
export async function cancelCare(db: Db, stripe: Stripe, actor: SessionUser, projectId: string): Promise<ActionResult<Date>> {
  const row = await loadProject(db, projectId);
  if (!row) return { ok: false, error: "Project not found." };
  if (actor.role !== "admin" && row.user.id !== actor.id) return { ok: false, error: "Project not found." };
  const { subscription } = await careState(db, projectId);
  if (!subscription || ["canceled", "incomplete_expired"].includes(subscription.status)) return { ok: false, error: "There's no active Website Care plan to cancel." };
  if (subscription.cancelAt) return { ok: true, value: subscription.cancelAt };

  const effective = careCancellationDate(subscription);
  const atPeriodEnd = subscription.currentPeriodEnd && effective.getTime() === subscription.currentPeriodEnd.getTime();
  const updated = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    atPeriodEnd ? { cancel_at_period_end: true } : { cancel_at: Math.floor(effective.getTime() / 1000), proration_behavior: "none" },
    { idempotencyKey: `care-cancel:${subscription.stripeSubscriptionId}` },
  );
  await reconcileSubscription(db, stripe, updated);
  const effectiveDate = updated.cancel_at ? new Date(updated.cancel_at * 1000) : effective;

  await db.insert(supportRequests).values({
    customerId: row.customer.id,
    projectId,
    kind: "cancellation",
    subject: "Website Care cancellation",
    message: `Cancelled online by ${actor.email} (${actor.role}). Effective ${formatDate(effectiveDate)}.`,
    status: "closed",
  });
  await logEvent(db, projectId, actor, "care_cancelled", `Website Care set to end ${formatDate(effectiveDate)}.`);
  await sendAll(db, [
    {
      template: "careCancellation",
      to: row.user.email,
      dedupeKey: `care-cancel:${subscription.stripeSubscriptionId}`,
      data: { name: firstName(row.customer.contactName), effectiveDate: formatDate(effectiveDate) },
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-care-cancel:${subscription.stripeSubscriptionId}`,
      data: {
        title: `Website Care cancelled: ${row.customer.businessName}`,
        lines: [["Ends", formatDate(effectiveDate)], ["By", actor.email]],
        link: `${appUrl()}/admin/projects/${projectId}`,
      },
    },
  ]);
  return { ok: true, value: effectiveDate };
}

/* ---------------- Customer Portal ---------------- */

export async function createPortalSession(db: Db, stripe: Stripe, user: SessionUser): Promise<ActionResult<string>> {
  const [customer] = await db.select().from(customers).where(eq(customers.userId, user.id)).limit(1);
  if (!customer?.stripeCustomerId) return { ok: false, error: "Your billing profile isn't ready yet." };
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: `${appUrl()}/client/dashboard`,
    // The configuration from scripts/stripe-setup.mts (card updates and invoices; cancellation stays in our dashboard).
    ...(process.env.STRIPE_PORTAL_CONFIGURATION ? { configuration: process.env.STRIPE_PORTAL_CONFIGURATION } : {}),
  });
  return { ok: true, value: session.url };
}

/* ---------------- Premium quotes ---------------- */

export const QUOTE_VALID_DAYS = 30;

export async function createQuote(
  db: Db,
  actor: SessionUser,
  input: { email: string; contactName: string; businessName: string; scope: string; devPriceCents: number; monthlyCents: number },
): Promise<ActionResult<string>> {
  if (!Number.isInteger(input.devPriceCents) || input.devPriceCents < PLANS.premium.devPriceCents) {
    return { ok: false, error: `Premium development fees start at ${formatCents(PLANS.premium.devPriceCents)}.` };
  }
  if (!Number.isInteger(input.monthlyCents) || input.monthlyCents < PLANS.premium.monthlyCents) {
    return { ok: false, error: `Premium Website Care starts at ${formatCents(PLANS.premium.monthlyCents)}/month.` };
  }
  const token = randomToken();
  const expiresAt = new Date(Date.now() + QUOTE_VALID_DAYS * 86_400_000);
  const email = input.email.trim().toLowerCase();
  const [quote] = await db
    .insert(quotes)
    .values({
      tokenHash: sha256(token),
      email,
      contactName: input.contactName,
      businessName: input.businessName,
      scope: input.scope,
      devPriceCents: input.devPriceCents,
      depositCents: depositFor(input.devPriceCents),
      monthlyCents: input.monthlyCents,
      expiresAt,
      createdBy: actor.id,
    })
    .returning({ id: quotes.id });
  const link = `${appUrl()}/checkout/quote/${token}`;
  await sendNotification(db, {
    template: "quote",
    to: email,
    dedupeKey: `quote:${quote.id}`,
    data: {
      name: firstName(input.contactName),
      scope: input.scope,
      devPriceCents: input.devPriceCents,
      depositCents: depositFor(input.devPriceCents),
      monthlyCents: input.monthlyCents,
      link,
      expires: formatDate(expiresAt),
    },
  });
  return { ok: true, value: link };
}

export async function voidQuote(db: Db, quoteId: string): Promise<ActionResult> {
  await db.update(quotes).set({ status: "void" }).where(and(eq(quotes.id, quoteId), eq(quotes.status, "sent")));
  return { ok: true };
}

/* ---------------- Reconciliation ---------------- */

/** Re-reads a project's invoices, subscription, and refunds from Stripe and applies anything missed. */
export async function syncProjectFromStripe(db: Db, stripe: Stripe, actor: SessionUser | null, projectId: string): Promise<ActionResult<string>> {
  const row = await loadProject(db, projectId);
  if (!row) return { ok: false, error: "Project not found." };
  const customerId = row.customer.stripeCustomerId;
  if (!customerId) return { ok: false, error: "No Stripe customer on file." };
  let applied = 0;

  for await (const invoice of stripe.invoices.list({ customer: customerId, limit: 100 })) {
    const forProject = invoice.metadata?.projectId === projectId || invoice.parent?.subscription_details?.metadata?.projectId === projectId;
    if (!forProject) continue;
    await reconcileInvoice(db, stripe, invoice);
    applied++;
  }
  for await (const subscription of stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 })) {
    if (subscription.metadata?.projectId !== projectId) continue;
    await reconcileSubscription(db, stripe, subscription);
    applied++;
  }
  const projectPayments = await db.select().from(payments).where(eq(payments.projectId, projectId));
  for (const payment of projectPayments) {
    if (!payment.stripePaymentIntentId) continue;
    const charges = await stripe.charges.list({ payment_intent: payment.stripePaymentIntentId, limit: 10 });
    for (const charge of charges.data) {
      if (charge.amount_refunded > 0) {
        await reconcileCharge(db, charge);
        applied++;
      }
    }
  }
  await logEvent(db, projectId, actor, "stripe_sync", `Synced ${applied} Stripe record(s).`);
  return { ok: true, value: `Synced ${applied} record(s) from Stripe.` };
}

/** Checkouts still marked open after Stripe's session would have finished: ask Stripe what happened. */
export async function reconcileOpenCheckouts(db: Db, stripe: Stripe, { olderThanMinutes = 10 } = {}) {
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000);
  const open = await db
    .select({ id: checkoutIntents.id, sessionId: checkoutIntents.stripeSessionId })
    .from(checkoutIntents)
    .where(and(eq(checkoutIntents.status, "open"), sql`${checkoutIntents.createdAt} < ${cutoff}`, sql`${checkoutIntents.stripeSessionId} is not null`))
    .orderBy(desc(checkoutIntents.createdAt))
    .limit(50);
  let fixed = 0;
  for (const intent of open) {
    const session = await stripe.checkout.sessions.retrieve(intent.sessionId!);
    if (session.status === "complete" || session.status === "expired") {
      await reconcileCheckoutSession(db, stripe, session);
      fixed++;
    }
  }
  return fixed;
}

/* ---------------- Support requests ---------------- */

export async function createSupportRequest(
  db: Db,
  user: SessionUser,
  input: { projectId: string | null; kind: "support" | "additional_service"; subject: string; message: string },
): Promise<ActionResult> {
  const [customer] = await db.select().from(customers).where(eq(customers.userId, user.id)).limit(1);
  if (!customer) return { ok: false, error: "No customer account found." };
  let projectId: string | null = null;
  if (input.projectId) {
    const [owned] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, input.projectId), eq(projects.customerId, customer.id)))
      .limit(1);
    projectId = owned?.id ?? null;
  }
  const [request] = await db
    .insert(supportRequests)
    .values({ customerId: customer.id, projectId, kind: input.kind, subject: input.subject, message: input.message })
    .returning({ id: supportRequests.id });
  const messages: Outgoing[] = [
    {
      template: "supportConfirmation",
      to: user.email,
      dedupeKey: `support:${request.id}`,
      data: { name: firstName(customer.contactName), subject: input.subject },
    },
    {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-support:${request.id}`,
      data: {
        title: `${input.kind === "additional_service" ? "Service request" : "Support request"}: ${customer.businessName}`,
        lines: [
          ["From", `${customer.contactName} <${user.email}>`],
          ["Subject", input.subject],
          ["Message", input.message.slice(0, 500)],
        ],
        link: `${appUrl()}/admin${projectId ? `/projects/${projectId}` : ""}`,
      },
    },
  ];
  await sendAll(db, messages);
  return { ok: true };
}

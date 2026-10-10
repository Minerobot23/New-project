import "server-only";
import { and, desc, eq, inArray, isNotNull, isNull, ne, sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
  agreementAcceptances,
  billingQuarantine,
  emailLog,
  careActivations,
  checkoutIntents,
  customers,
  invoices,
  onboarding,
  payments,
  projectEvents,
  projects,
  quotes,
  subscriptions,
  supportRequests,
  users,
  type ProjectStatus,
} from "@/lib/db/schema";

/** Overview numbers. Money figures come from Stripe-confirmed records only. */
export async function adminOverview(db: Db, { livemode }: { livemode: boolean }) {
  const [customerCount] = await db
    .select({ n: sql<number>`count(distinct ${customers.id})::int` })
    .from(customers)
    .innerJoin(projects, eq(projects.customerId, customers.id))
    .where(eq(projects.livemode, livemode));
  const [activeProjects] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(projects)
    .where(and(eq(projects.livemode, livemode), inArray(projects.status, ["deposit_paid", "onboarding", "in_development", "client_review", "final_payment_pending", "ready_for_launch"])));
  const [deposits] = await db
    .select({ cents: sql<number>`coalesce(sum(${payments.amountCents} - ${payments.refundedCents}), 0)::int` })
    .from(payments)
    .innerJoin(projects, eq(projects.id, payments.projectId))
    .where(and(eq(payments.kind, "deposit"), eq(projects.livemode, livemode)));
  // Outstanding: development balances on projects whose final payment Stripe hasn't confirmed.
  const [outstanding] = await db
    .select({ cents: sql<number>`coalesce(sum(${projects.devPriceCents} - ${projects.depositCents}), 0)::int` })
    .from(projects)
    .where(
      and(
        eq(projects.livemode, livemode),
        sql`not exists (select 1 from ${payments} where ${payments.projectId} = ${projects.id} and ${payments.kind} = 'final')`,
      ),
    );
  const [subs] = await db
    .select({ n: sql<number>`count(*)::int`, mrr: sql<number>`coalesce(sum(${subscriptions.monthlyCents}), 0)::int` })
    .from(subscriptions)
    .innerJoin(projects, eq(projects.id, subscriptions.projectId))
    .where(and(eq(projects.livemode, livemode), inArray(subscriptions.status, ["active", "past_due"]), isNull(subscriptions.cancelAt)));
  const failed = await db
    .select({ invoice: invoices, businessName: customers.businessName })
    .from(invoices)
    .innerJoin(projects, eq(projects.id, invoices.projectId))
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .where(and(eq(projects.livemode, livemode), isNotNull(invoices.lastFailureAt), inArray(invoices.status, ["open", "uncollectible"])))
    .orderBy(desc(invoices.lastFailureAt));
  const [pastDue] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(subscriptions)
    .innerJoin(projects, eq(projects.id, subscriptions.projectId))
    .where(and(eq(projects.livemode, livemode), inArray(subscriptions.status, ["past_due", "unpaid"])));
  const [openCheckouts] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(checkoutIntents)
    .where(and(eq(checkoutIntents.status, "open"), eq(checkoutIntents.livemode, livemode), isNotNull(checkoutIntents.stripeSessionId)));
  return {
    customers: customerCount.n,
    activeProjects: activeProjects.n,
    depositsCents: deposits.cents,
    outstandingCents: outstanding.cents,
    activeSubscriptions: subs.n,
    mrrCents: subs.mrr,
    failedPayments: failed,
    pastDueSubscriptions: pastDue.n,
    openCheckouts: openCheckouts.n,
  };
}

export async function adminProjects(db: Db, { livemode, status, q }: { livemode: boolean; status?: ProjectStatus; q?: string }) {
  const conditions = [eq(projects.livemode, livemode)];
  if (status) conditions.push(eq(projects.status, status));
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, (char) => `\\${char}`)}%`;
    conditions.push(sql`(${customers.businessName} ilike ${like} or ${customers.contactName} ilike ${like} or ${users.email} ilike ${like})`);
  }
  return db
    .select({ project: projects, customer: customers, email: users.email, onboardingSubmitted: onboarding.submittedAt })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .leftJoin(onboarding, eq(onboarding.projectId, projects.id))
    .where(and(...conditions))
    .orderBy(desc(projects.updatedAt))
    .limit(200);
}

export async function adminProjectDetail(db: Db, projectId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) return null;
  const [row] = await db
    .select({ project: projects, customer: customers, user: users })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(projects.id, projectId))
    .limit(1);
  if (!row) return null;
  const [paymentRows, invoiceRows, [subscription], [care], [answers], agreements, events, requests, [quote]] = await Promise.all([
    db.select().from(payments).where(eq(payments.projectId, projectId)).orderBy(desc(payments.createdAt)),
    db.select().from(invoices).where(eq(invoices.projectId, projectId)).orderBy(desc(invoices.createdAt)),
    db.select().from(subscriptions).where(eq(subscriptions.projectId, projectId)).limit(1),
    db.select().from(careActivations).where(eq(careActivations.projectId, projectId)).limit(1),
    db.select().from(onboarding).where(eq(onboarding.projectId, projectId)).limit(1),
    db.select().from(agreementAcceptances).where(eq(agreementAcceptances.projectId, projectId)).orderBy(desc(agreementAcceptances.acceptedAt)),
    db
      .select({ event: projectEvents, actor: users.email })
      .from(projectEvents)
      .leftJoin(users, eq(users.id, projectEvents.actorUserId))
      .where(eq(projectEvents.projectId, projectId))
      .orderBy(desc(projectEvents.createdAt))
      .limit(100),
    db.select().from(supportRequests).where(eq(supportRequests.customerId, row.customer.id)).orderBy(desc(supportRequests.createdAt)).limit(20),
    row.project.quoteId ? db.select().from(quotes).where(eq(quotes.id, row.project.quoteId)).limit(1) : Promise.resolve([]),
  ]);
  return {
    ...row,
    payments: paymentRows,
    invoices: invoiceRows,
    subscription: subscription ?? null,
    care: care ?? null,
    onboarding: answers ?? null,
    agreements,
    events,
    requests,
    quote: quote ?? null,
  };
}

export function adminQuotes(db: Db) {
  return db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(100);
}

export function openSupportRequests(db: Db) {
  return db
    .select({ request: supportRequests, businessName: customers.businessName })
    .from(supportRequests)
    .innerJoin(customers, eq(customers.id, supportRequests.customerId))
    .where(and(eq(supportRequests.status, "open"), ne(supportRequests.kind, "cancellation")))
    .orderBy(desc(supportRequests.createdAt))
    .limit(20);
}

/** Outbox health for the overview: anything not delivered yet, and anything that gave up. */
export async function emailHealth(db: Db) {
  const counts = await db
    .select({ status: emailLog.status, n: sql<number>`count(*)::int` })
    .from(emailLog)
    .where(inArray(emailLog.status, ["queued", "sending", "failed", "dead"]))
    .groupBy(emailLog.status);
  const recentProblems = await db
    .select({ key: emailLog.dedupeKey, template: emailLog.template, status: emailLog.status, attempts: emailLog.attempts, error: emailLog.error, updatedAt: emailLog.updatedAt })
    .from(emailLog)
    .where(inArray(emailLog.status, ["failed", "dead"]))
    .orderBy(desc(emailLog.updatedAt))
    .limit(10);
  return { counts: Object.fromEntries(counts.map((row) => [row.status, row.n])) as Record<string, number>, recentProblems };
}

export function openQuarantine(db: Db) {
  return db.select().from(billingQuarantine).where(isNull(billingQuarantine.resolvedAt)).orderBy(desc(billingQuarantine.createdAt)).limit(20);
}

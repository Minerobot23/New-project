import { and, eq, inArray, isNull, lt, or } from "drizzle-orm";
import { INVITE_LINK_HOURS } from "@/lib/auth/core";
import { BillingDisabledError, billingStatus, getStripe } from "@/lib/billing/config";
import { reconcileOpenCheckouts } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { customers, onboarding, projects, users } from "@/lib/db/schema";
import { deliverDue, sendNotification } from "@/lib/notify/send";
import { safeEqual } from "@/lib/security";

/*
 * Daily job (vercel.json): onboarding reminders and reconciliation of checkouts Stripe never confirmed to us.
 * Vercel Cron sends "Authorization: Bearer $CRON_SECRET"; anything else is refused.
 */

const REMINDER_DAYS = [3, 7];

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(header, `Bearer ${secret}`)) return new Response("Unauthorized", { status: 401 });

  const db = await getDb();
  const now = Date.now();
  const due = await db
    .select({ projectId: projects.id, createdAt: projects.createdAt, email: users.email, name: customers.contactName })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .innerJoin(users, eq(users.id, customers.userId))
    .leftJoin(onboarding, eq(onboarding.projectId, projects.id))
    .where(
      and(
        inArray(projects.status, ["deposit_paid", "onboarding"]),
        or(isNull(onboarding.projectId), isNull(onboarding.submittedAt)),
        lt(projects.createdAt, new Date(now - REMINDER_DAYS[0] * 86_400_000)),
      ),
    );

  let reminders = 0;
  for (const row of due) {
    const ageDays = (now - row.createdAt.getTime()) / 86_400_000;
    const stage = REMINDER_DAYS.filter((day) => ageDays >= day).length;
    if (stage === 0) continue;
    // One reminder per stage, ever: the outbox dedupe key makes reruns harmless, and the sign-in link is
    // minted only when the email is actually sent.
    const outcome = await sendNotification(db, {
      template: "onboardingReminder",
      to: row.email,
      dedupeKey: `onboarding-reminder:${row.projectId}:${stage}`,
      data: { name: row.name.split(" ")[0] },
      signIn: { next: `/client/onboarding?project=${row.projectId}`, ttlMinutes: INVITE_LINK_HOURS * 60 },
    });
    if (outcome === "sent" || outcome === "suppressed") reminders++;
  }

  // Retry any notifications that are due (backstop for the after-webhook and admin-triggered drains).
  const retried = (await deliverDue(db, { limit: 100 })).length;

  let reconciled = 0;
  if (billingStatus().enabled) {
    try {
      reconciled = await reconcileOpenCheckouts(db, getStripe());
    } catch (error) {
      if (!(error instanceof BillingDisabledError)) console.error(`[cron] reconcile failed: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }
  return Response.json({ reminders, retried, reconciled });
}

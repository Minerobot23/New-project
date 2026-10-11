import "server-only";
import { and, eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { checkoutIntents, payments, projects } from "@/lib/db/schema";
import type { Purchase } from "@/lib/purchase";

/** Only the signed webhook can create this succeeded payment; a redirect is never evidence. */
export async function confirmedPurchase(db: Db, sessionId: string): Promise<Purchase | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  const [payment] = await db.select({ id: payments.id, amount: payments.amountCents, currency: payments.currency })
    .from(checkoutIntents)
    .innerJoin(projects, eq(projects.checkoutIntentId, checkoutIntents.id))
    .innerJoin(payments, eq(payments.projectId, projects.id))
    .where(and(eq(checkoutIntents.stripeSessionId, sessionId), eq(checkoutIntents.status, "completed"),
      eq(checkoutIntents.livemode, true), eq(projects.livemode, true), eq(payments.kind, "deposit"),
      eq(payments.status, "succeeded"), eq(payments.refundedCents, 0)))
    .limit(1);
  if (!payment || payment.amount <= 0) return null;
  return { transactionId: payment.id, value: payment.amount / 100, currency: payment.currency.toUpperCase() };
}

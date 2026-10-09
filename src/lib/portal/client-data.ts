import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { projectsForUser } from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import { careActivations, invoices, onboarding, payments, subscriptions, supportRequests } from "@/lib/db/schema";

/** Everything a client's dashboard shows, scoped to the signed-in user's own projects. */
export async function clientDashboardData(db: Db, userId: string) {
  const owned = await projectsForUser(db, userId);
  const ids = owned.map((row) => row.project.id);
  if (ids.length === 0) return { customer: null, projects: [] };
  const [paymentRows, invoiceRows, subscriptionRows, careRows, onboardingRows, requestRows] = await Promise.all([
    db.select().from(payments).where(inArray(payments.projectId, ids)).orderBy(desc(payments.createdAt)),
    db.select().from(invoices).where(inArray(invoices.projectId, ids)).orderBy(desc(invoices.createdAt)),
    db.select().from(subscriptions).where(inArray(subscriptions.projectId, ids)),
    db.select().from(careActivations).where(inArray(careActivations.projectId, ids)),
    db.select().from(onboarding).where(inArray(onboarding.projectId, ids)),
    db.select().from(supportRequests).where(eq(supportRequests.customerId, owned[0].customer.id)).orderBy(desc(supportRequests.createdAt)).limit(10),
  ]);
  return {
    customer: owned[0].customer,
    requests: requestRows,
    projects: owned
      .map(({ project }) => ({
        project,
        payments: paymentRows.filter((row) => row.projectId === project.id),
        invoices: invoiceRows.filter((row) => row.projectId === project.id),
        subscription: subscriptionRows.find((row) => row.projectId === project.id) ?? null,
        care: careRows.find((row) => row.projectId === project.id) ?? null,
        onboarding: onboardingRows.find((row) => row.projectId === project.id) ?? null,
      }))
      .reverse(),
  };
}

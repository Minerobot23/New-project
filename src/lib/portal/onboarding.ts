import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { cleanOnboarding, onboardingProgress, type OnboardingAnswers } from "@/content/onboarding";
import { canAccessProject, type SessionUser } from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import { customers, onboarding, projectEvents, projects } from "@/lib/db/schema";
import { adminRecipient, sendNotification } from "@/lib/notify/send";
import { templates } from "@/lib/notify/templates";
import { appUrl } from "@/lib/security";

export type SaveResult = { ok: true; savedAt: string; submitted: boolean } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function getOnboarding(db: Db, projectId: string) {
  const [row] = await db.select().from(onboarding).where(eq(onboarding.projectId, projectId)).limit(1);
  return row ?? null;
}

/**
 * Saves answers (every save persists to the database, so customers can leave and come back).
 * The first save moves a new project to Onboarding; submitting records the time and notifies Fluxline.
 */
export async function saveOnboarding(
  db: Db,
  user: SessionUser,
  projectId: string,
  input: Record<string, unknown>,
  { submit }: { submit: boolean },
): Promise<SaveResult> {
  if (user.role !== "client" || !(await canAccessProject(db, user, projectId))) return { ok: false, error: "Project not found." };
  const { data, errors } = cleanOnboarding(input, { submitting: submit });
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: submit ? "A few required answers are missing." : "Please fix the highlighted fields.", fieldErrors: errors };
  }

  const now = new Date();
  const [saved] = await db
    .insert(onboarding)
    .values({ projectId, data, submittedAt: submit ? now : null, updatedAt: now })
    .onConflictDoUpdate({
      target: onboarding.projectId,
      set: { data, updatedAt: now, ...(submit ? { submittedAt: now } : {}) },
    })
    .returning();

  await db
    .update(projects)
    .set({ status: "onboarding", updatedAt: now })
    .where(and(eq(projects.id, projectId), inArray(projects.status, ["deposit_paid"])));

  if (submit) {
    await db.insert(projectEvents).values({ projectId, actorUserId: user.id, kind: "onboarding_submitted", detail: "Onboarding questionnaire submitted." });
    const [customer] = await db
      .select({ businessName: customers.businessName })
      .from(customers)
      .innerJoin(projects, eq(projects.customerId, customers.id))
      .where(eq(projects.id, projectId))
      .limit(1);
    await sendNotification(db, {
      template: "adminAlert",
      to: adminRecipient(),
      dedupeKey: `admin-onboarding:${projectId}:${now.getTime()}`,
      rendered: templates.adminAlert({
        title: `Onboarding submitted: ${customer?.businessName ?? "client"}`,
        lines: [["Project", projectId]],
        link: `${appUrl()}/admin/projects/${projectId}`,
      }),
    });
  }
  return { ok: true, savedAt: saved.updatedAt.toISOString(), submitted: Boolean(saved.submittedAt) };
}

export function summarize(data: OnboardingAnswers | undefined) {
  return onboardingProgress(data ?? {});
}


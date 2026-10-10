"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { BillingDisabledError, getStripe } from "@/lib/billing/config";
import { cancelCare, createPortalSession, createSupportRequest, startCareCheckout } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { saveOnboarding, type SaveResult } from "@/lib/portal/onboarding";
import { deleteUpload } from "@/lib/portal/uploads";
import { RATE_LIMITS, checkRateLimits } from "@/lib/rate-limit";
import { clientIpFrom } from "@/lib/security";

/* Every action re-checks the session and project ownership itself; the UI is not a security boundary. */

async function clientUser() {
  const user = await getCurrentUser();
  if (!user || user.role !== "client") redirect("/login");
  return user;
}

const billingUnavailable = "Billing is temporarily unavailable. Please try again shortly or contact us.";

export async function saveOnboardingAction(_previous: SaveResult | null, formData: FormData): Promise<SaveResult> {
  const user = await clientUser();
  const projectId = String(formData.get("projectId") ?? "");
  const submit = formData.get("intent") === "submit";
  const input = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string"));
  return saveOnboarding(await getDb(), user, projectId, input, { submit });
}

export async function deleteUploadAction(formData: FormData) {
  const user = await clientUser();
  await deleteUpload(await getDb(), user, String(formData.get("uploadId") ?? ""));
  refresh();
}

export async function openBillingPortal() {
  const user = await clientUser();
  let url: string;
  try {
    const result = await createPortalSession(await getDb(), getStripe(), user);
    if (!result.ok || !result.value) redirect(`/client/dashboard?billing=unavailable`);
    url = result.value;
  } catch (error) {
    if (error instanceof BillingDisabledError) redirect(`/client/dashboard?billing=unavailable`);
    throw error;
  }
  redirect(url);
}

export type FormState = { ok?: boolean; error?: string; message?: string } | null;

const supportSchema = z.object({
  projectId: z.string().max(40).optional(),
  kind: z.enum(["support", "additional_service"]),
  subject: z.string().trim().min(3, "Add a short subject.").max(140),
  message: z.string().trim().min(10, "Tell us a little more.").max(4000),
});

export async function supportRequestAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await clientUser();
  const rate = await checkRateLimits(await getDb(), [["support:user", user.id, RATE_LIMITS.supportPerUser]]);
  if (!rate.allowed) return { error: "You've sent several requests recently. Please email us if it's urgent." };
  const parsed = supportSchema.safeParse({
    projectId: formData.get("projectId") || undefined,
    kind: formData.get("kind"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const result = await createSupportRequest(await getDb(), user, { ...parsed.data, projectId: parsed.data.projectId ?? null });
  if (!result.ok) return { error: result.error };
  return { ok: true, message: "Thanks. We've received your request and emailed you a confirmation." };
}

export async function startCareAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await clientUser();
  if (formData.get("authorize") !== "on") return { error: "Please confirm the authorization to continue." };
  const requestHeaders = await headers();
  let url: string;
  try {
    const result = await startCareCheckout(await getDb(), getStripe(), user, {
      projectId: String(formData.get("projectId") ?? ""),
      termsVersion: String(formData.get("termsVersion") ?? ""),
      ip: clientIpFrom(requestHeaders),
      userAgent: requestHeaders.get("user-agent"),
    });
    if (!result.ok || !result.value) return { error: result.ok ? billingUnavailable : result.error };
    url = result.value;
  } catch (error) {
    if (error instanceof BillingDisabledError) return { error: billingUnavailable };
    console.error(`[care] checkout failed: ${error instanceof Error ? error.message : "unknown error"}`);
    return { error: "We couldn't reach our payment provider. Nothing was charged; please try again." };
  }
  redirect(url);
}

export async function cancelCareAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await clientUser();
  try {
    const result = await cancelCare(await getDb(), getStripe(), user, String(formData.get("projectId") ?? ""));
    if (!result.ok) return { error: result.error };
    refresh();
    const date = result.value?.toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/New_York" });
    return { ok: true, message: `Cancelled. Website Care ends on ${date}, with no charges after that date. We've emailed you a confirmation.` };
  } catch (error) {
    if (error instanceof BillingDisabledError) return { error: billingUnavailable };
    console.error(`[care] cancel failed: ${error instanceof Error ? error.message : "unknown error"}`);
    return { error: "We couldn't reach our payment provider. Please try again, or email us to cancel." };
  }
}

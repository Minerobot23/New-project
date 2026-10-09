"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/auth/core";
import { BillingDisabledError, getStripe } from "@/lib/billing/config";
import {
  cancelCare,
  createFinalInvoice,
  createQuote,
  inviteCare,
  reconcileOpenCheckouts,
  refundPayment,
  setProjectStatus,
  syncProjectFromStripe,
  voidQuote,
  type ActionResult,
} from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { PROJECT_STATUSES, supportRequests } from "@/lib/db/schema";

/*
 * Admin mutations. Each one re-verifies that the caller is a signed-in admin on the allowlist
 * (getCurrentUser re-checks ADMIN_EMAILS on every request); nothing relies on the page having been gated.
 */

export type AdminFormState = { ok?: boolean; error?: string; message?: string } | null;

async function requireAdminAction(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized.");
  return user;
}

async function run(work: () => Promise<ActionResult<unknown>>, success: string): Promise<AdminFormState> {
  try {
    const result = await work();
    if (!result.ok) return { error: result.error };
    refresh();
    return { ok: true, message: typeof result.value === "string" ? result.value : success };
  } catch (error) {
    if (error instanceof BillingDisabledError) return { error: `Billing is disabled: ${error.message}` };
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`[admin] action failed: ${message}`);
    // Stripe errors are safe to show to admins and say what to fix.
    return { error: `Stripe or database error: ${message.slice(0, 300)}` };
  }
}

const projectId = (formData: FormData) => z.uuid().parse(formData.get("projectId"));

export async function setStatusAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  const status = z.enum(PROJECT_STATUSES).safeParse(formData.get("status"));
  if (!status.success) return { error: "Choose a status." };
  return run(async () => setProjectStatus(await getDb(), admin, projectId(formData), status.data), "Status updated.");
}

export async function finalInvoiceAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  const days = z.coerce.number().int().min(1).max(60).catch(7).parse(formData.get("days"));
  return run(async () => createFinalInvoice(await getDb(), getStripe(), admin, projectId(formData), { daysUntilDue: days }), "Final invoice created and sent.");
}

export async function refundAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  if (formData.get("approved") !== "on") return { error: "Confirm that this refund is approved." };
  const amount = Math.round(Number(formData.get("amount")) * 100);
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 3) return { error: "Add a short reason for the refund record." };
  return run(
    async () => refundPayment(await getDb(), getStripe(), admin, { paymentId: z.uuid().parse(formData.get("paymentId")), amountCents: amount, reason }),
    "Refund submitted to Stripe. The payment updates when Stripe confirms it.",
  );
}

export async function inviteCareAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  return run(async () => inviteCare(await getDb(), admin, projectId(formData)), "Website Care offered. The customer has been emailed.");
}

export async function cancelCareAdminAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  return run(async () => {
    const result = await cancelCare(await getDb(), getStripe(), admin, projectId(formData));
    return result.ok ? { ok: true, value: `Website Care set to end ${result.value?.toDateString()}.` } : result;
  }, "Cancelled.");
}

export async function syncAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  return run(async () => syncProjectFromStripe(await getDb(), getStripe(), admin, projectId(formData)), "Synced.");
}

export async function reconcileCheckoutsAction(): Promise<AdminFormState> {
  await requireAdminAction();
  return run(async () => {
    const fixed = await reconcileOpenCheckouts(await getDb(), getStripe(), { olderThanMinutes: 5 });
    return { ok: true, value: `Checked open checkouts with Stripe; ${fixed} updated.` };
  }, "Done.");
}

const quoteSchema = z.object({
  email: z.email().max(200),
  contactName: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(160),
  scope: z.string().trim().min(20, "Describe the scope (at least a sentence or two).").max(4000),
  devPrice: z.coerce.number().positive(),
  monthly: z.coerce.number().positive(),
});

export async function createQuoteAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdminAction();
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the quote details." };
  const { devPrice, monthly, ...rest } = parsed.data;
  return run(
    async () => createQuote(await getDb(), admin, { ...rest, devPriceCents: Math.round(devPrice * 100), monthlyCents: Math.round(monthly * 100) }),
    "Quote sent.",
  );
}

export async function voidQuoteAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdminAction();
  return run(async () => voidQuote(await getDb(), z.uuid().parse(formData.get("quoteId"))), "Quote voided.");
}

export async function closeRequestAction(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdminAction();
  return run(async () => {
    await (await getDb()).update(supportRequests).set({ status: "closed" }).where(eq(supportRequests.id, z.uuid().parse(formData.get("requestId"))));
    return { ok: true };
  }, "Closed.");
}

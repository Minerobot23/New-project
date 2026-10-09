"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingDisabledError, billingStatus, getStripe } from "@/lib/billing/config";
import { checkoutSchema, startDepositCheckout } from "@/lib/billing/checkout";
import { getDb } from "@/lib/db";
import { createRateLimiter } from "@/lib/rate-limit";
import { clientIpFrom } from "@/lib/security";

export type CheckoutFormState = { error?: string; fieldErrors?: Record<string, string> } | null;

const limiter = createRateLimiter({ limit: 8, windowMs: 10 * 60_000 });

export async function startCheckoutAction(_previous: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  const status = billingStatus();
  if (!status.enabled) return { error: "Online deposits aren't open yet. Please request a call and we'll get you started." };

  const requestHeaders = await headers();
  const ip = clientIpFrom(requestHeaders);
  if (!limiter(ip).allowed) return { error: "Too many attempts. Please wait a few minutes and try again." };

  const parsed = checkoutSchema.safeParse({
    intentId: formData.get("intentId"),
    plan: formData.get("plan"),
    quoteToken: formData.get("quoteToken") || undefined,
    contactName: formData.get("contactName"),
    businessName: formData.get("businessName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    acceptAgreement: formData.get("acceptAgreement") === "on",
    acknowledgeCare: formData.get("acknowledgeCare") === "on",
    agreementVersion: formData.get("agreementVersion"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Please check the highlighted fields.", fieldErrors };
  }

  let url: string;
  try {
    const result = await startDepositCheckout(await getDb(), getStripe(), parsed.data, { ip, userAgent: requestHeaders.get("user-agent") });
    if (!result.ok) return { error: result.error };
    url = result.url;
  } catch (error) {
    if (error instanceof BillingDisabledError) return { error: "Online deposits aren't open yet. Please request a call." };
    console.error(`[checkout] could not start: ${error instanceof Error ? error.message : "unknown error"}`);
    return { error: "We couldn't reach our payment provider. Nothing was charged; please try again in a moment." };
  }
  redirect(url);
}

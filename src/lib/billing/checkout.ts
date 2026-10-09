import "server-only";
import { and, eq, gt } from "drizzle-orm";
import type Stripe from "stripe";
import { z } from "zod";
import { SERVICE_AGREEMENT, agreementText } from "@/content/agreements";
import type { Db } from "@/lib/db";
import { agreementAcceptances, checkoutIntents, quotes } from "@/lib/db/schema";
import { appUrl, hashIp, sha256 } from "@/lib/security";
import { CURRENCY, PLANS, isPlanId, type PlanId } from "./plans";

/*
 * Deposit checkout. The customer's details and agreement acceptance are recorded first; then a Stripe Checkout
 * Session is created on the server and the customer is redirected to Stripe's hosted page.
 * Nothing here marks anything paid: only the verified webhook does that (see webhook.ts).
 */

export const checkoutSchema = z.object({
  intentId: z.uuid(),
  plan: z.string(),
  quoteToken: z.string().max(200).optional(),
  contactName: z.string().trim().min(2, "Enter your name.").max(120),
  businessName: z.string().trim().min(2, "Enter your business name.").max(160),
  email: z.email("Enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a phone number with area code."),
  acceptAgreement: z.literal(true, { error: "Please read and accept the service agreement." }),
  acknowledgeCare: z.literal(true, { error: "Please confirm you understand the Website Care plan." }),
  agreementVersion: z.string(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function findValidQuote(db: Db, token: string) {
  const [quote] = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.tokenHash, sha256(token)), eq(quotes.status, "sent"), gt(quotes.expiresAt, new Date())))
    .limit(1);
  return quote ?? null;
}

/** Amounts come from the server's plan catalog or an agreed quote, never from the browser. */
async function resolvePricing(db: Db, plan: PlanId, quoteToken?: string) {
  if (!PLANS[plan].quoteRequired) {
    const { devPriceCents, depositCents, monthlyCents } = PLANS[plan];
    return { ok: true as const, plan, devPriceCents, depositCents, monthlyCents, quote: null };
  }
  if (!quoteToken) return { ok: false as const, error: "Premium projects need an agreed quote before payment." };
  const quote = await findValidQuote(db, quoteToken);
  if (!quote) return { ok: false as const, error: "This quote has expired or is no longer valid. Please contact us for an updated quote." };
  return { ok: true as const, plan, devPriceCents: quote.devPriceCents, depositCents: quote.depositCents, monthlyCents: quote.monthlyCents, quote };
}

export async function startDepositCheckout(
  db: Db,
  stripe: Stripe,
  input: CheckoutInput,
  request: { ip: string; userAgent: string | null },
): Promise<CheckoutResult> {
  if (!isPlanId(input.plan)) return { ok: false, error: "Unknown package." };
  if (input.agreementVersion !== SERVICE_AGREEMENT.version) {
    return { ok: false, error: "The service agreement was updated. Please reload the page and review it again." };
  }
  const pricing = await resolvePricing(db, input.plan, input.quoteToken);
  if (!pricing.ok) return { ok: false, error: pricing.error };

  const email = pricing.quote ? pricing.quote.email : input.email.trim().toLowerCase();

  // A repeated submission (double click, back button) reuses the same intent and Stripe session.
  const [existing] = await db.select().from(checkoutIntents).where(eq(checkoutIntents.id, input.intentId)).limit(1);
  if (existing) {
    if (existing.status === "completed") return { ok: false, error: "This deposit has already been paid. Check your email for your onboarding link." };
    if (existing.stripeSessionUrl && existing.status === "open") return { ok: true, url: existing.stripeSessionUrl };
    if (existing.status === "expired") return { ok: false, error: "This checkout expired. Please reload the page to start again." };
  } else {
    await db.transaction(async (tx) => {
      await tx
        .insert(checkoutIntents)
        .values({
          id: input.intentId,
          plan: pricing.plan,
          quoteId: pricing.quote?.id ?? null,
          email,
          contactName: input.contactName,
          businessName: input.businessName,
          phone: input.phone,
          devPriceCents: pricing.devPriceCents,
          depositCents: pricing.depositCents,
          monthlyCents: pricing.monthlyCents,
        })
        .onConflictDoNothing();
      await tx.insert(agreementAcceptances).values({
        kind: "service",
        version: SERVICE_AGREEMENT.version,
        textHash: sha256(agreementText(SERVICE_AGREEMENT)),
        email,
        checkoutIntentId: input.intentId,
        ipHash: hashIp(request.ip),
        userAgent: request.userAgent?.slice(0, 300) ?? null,
      });
    });
  }

  const plan = PLANS[pricing.plan];
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer_email: email,
      customer_creation: "always",
      client_reference_id: input.intentId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: pricing.depositCents,
            product_data: {
              name: `${plan.name} website: 50% development deposit`,
              description: `Deposit toward a ${plan.name} website by Fluxline Solutions. The balance is invoiced before launch; Website Care is billed separately after launch.`,
            },
          },
        },
      ],
      metadata: { kind: "deposit", intentId: input.intentId, plan: pricing.plan, ...(pricing.quote ? { quoteId: pricing.quote.id } : {}) },
      payment_intent_data: {
        description: `${plan.name} website deposit · ${input.businessName}`,
        metadata: { kind: "deposit", intentId: input.intentId },
      },
      success_url: `${appUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: input.quoteToken ? `${appUrl()}/checkout/quote/${encodeURIComponent(input.quoteToken)}?cancelled=1` : `${appUrl()}/checkout/${pricing.plan}?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    { idempotencyKey: `deposit-checkout:${input.intentId}` },
  );

  if (!session.url) return { ok: false, error: "Stripe did not return a checkout link. Please try again." };
  await db
    .update(checkoutIntents)
    .set({ stripeSessionId: session.id, stripeSessionUrl: session.url, livemode: session.livemode })
    .where(eq(checkoutIntents.id, input.intentId));
  return { ok: true, url: session.url };
}

/** What the success page may show. It reports our database state, which only the webhook changes. */
export async function checkoutStatus(db: Db, sessionId: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return "unknown" as const;
  const [intent] = await db
    .select({ status: checkoutIntents.status })
    .from(checkoutIntents)
    .where(eq(checkoutIntents.stripeSessionId, sessionId))
    .limit(1);
  if (!intent) return "unknown" as const;
  return intent.status === "completed" ? ("confirmed" as const) : intent.status === "expired" ? ("expired" as const) : ("pending" as const);
}

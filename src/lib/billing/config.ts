import "server-only";
import Stripe from "stripe";
import { SERVICE_AGREEMENT } from "@/content/agreements";

/**
 * Stripe configuration. Secrets come only from server environment variables:
 *   STRIPE_SECRET_KEY       sk_test_... (or a restricted rk_test_...) while testing; sk_live_... after approval
 *   STRIPE_WEBHOOK_SECRET   whsec_... for the /api/stripe/webhook endpoint
 *   BILLING_LIVE_ENABLED    must be exactly "true" before a live key is allowed to create charges
 * Nothing here is imported by client components, and none of these values is ever sent to the browser.
 */

export type StripeMode = "none" | "test" | "live";

/** The configured secret key, ignoring stray whitespace or line breaks from copy and paste. */
const secretKey = () => process.env.STRIPE_SECRET_KEY?.trim() || undefined;

export function stripeMode(key = secretKey()): StripeMode {
  key = key?.trim();
  if (!key) return "none";
  if (/^(sk|rk)_live_/.test(key)) return "live";
  if (/^(sk|rk)_test_/.test(key)) return "test";
  return "none";
}

export type BillingStatus = { enabled: true; mode: "test" | "live" } | { enabled: false; mode: StripeMode; reason: string };

/** Whether this deployment may take payments right now, and why not if it can't. */
export function billingStatus(): BillingStatus {
  const mode = stripeMode();
  if (mode === "none") {
    const key = secretKey();
    if (!key) return { enabled: false, mode, reason: "Stripe is not connected yet (STRIPE_SECRET_KEY is not set)." };
    if (/^pk_/.test(key)) return { enabled: false, mode, reason: "STRIPE_SECRET_KEY holds a publishable key (pk_...). Use the secret key (sk_live_... or sk_test_...) from Stripe → Developers → API keys." };
    return { enabled: false, mode, reason: "STRIPE_SECRET_KEY doesn't look like a Stripe secret key. It should start with sk_live_ (or sk_test_ for testing)." };
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) return { enabled: false, mode, reason: "STRIPE_WEBHOOK_SECRET is not set, so payments could not be confirmed." };
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") return { enabled: false, mode, reason: "DATABASE_URL is not set." };
  if (mode === "live") {
    if (process.env.BILLING_LIVE_ENABLED?.trim() !== "true") return { enabled: false, mode, reason: "Live payments are switched off (BILLING_LIVE_ENABLED is not \"true\")." };
    if (SERVICE_AGREEMENT.status !== "approved") return { enabled: false, mode, reason: "The service agreement has not been marked approved after legal review." };
  }
  return { enabled: true, mode };
}

let client: Stripe | null = null;
let testClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (testClient) return testClient;
  const status = billingStatus();
  if (!status.enabled) throw new BillingDisabledError(status.reason);
  client ??= new Stripe(secretKey() as string, {
    appInfo: { name: "Fluxline Solutions", url: "https://fluxlinesolutions.com" },
    maxNetworkRetries: 2,
    timeout: 20_000,
  });
  return client;
}

/** Tests inject a stand-in Stripe client; production code never calls this. */
export function setStripeForTests(stub: Stripe | null) {
  testClient = stub;
}

export class BillingDisabledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BillingDisabledError";
  }
}

/** Link to a Stripe object in the right dashboard (test or live). */
export function stripeDashboardUrl(path: string, livemode: boolean) {
  return `https://dashboard.stripe.com/${livemode ? "" : "test/"}${path}`;
}

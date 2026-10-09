/**
 * One-time Stripe setup: Website Care products and monthly prices (with lookup keys the app uses),
 * and the Customer Portal configuration. Safe to re-run: existing prices are found by lookup key.
 *
 *   STRIPE_SECRET_KEY=sk_test_... npm run stripe:setup
 *
 * Refuses live keys unless you pass --live and BILLING_LIVE_ENABLED=true (after you've approved going live).
 * Development deposits and final invoices use inline amounts from src/lib/billing/plans.ts, so they need no setup.
 */
import Stripe from "stripe";
import { PLANS, PLAN_ORDER } from "../src/lib/billing/plans";

const key = process.env.STRIPE_SECRET_KEY ?? "";
const live = /^(sk|rk)_live_/.test(key);
if (!/^(sk|rk)_(test|live)_/.test(key)) {
  console.error("Set STRIPE_SECRET_KEY to a Stripe secret key (sk_test_... while testing).");
  process.exit(1);
}
if (live && !(process.argv.includes("--live") && process.env.BILLING_LIVE_ENABLED === "true")) {
  console.error("This is a LIVE key. Re-run with --live and BILLING_LIVE_ENABLED=true only after approving live payments.");
  process.exit(1);
}

const stripe = new Stripe(key);
console.log(`Stripe ${live ? "LIVE" : "test"} mode\n`);

for (const id of PLAN_ORDER) {
  const plan = PLANS[id];
  const existing = await stripe.prices.list({ lookup_keys: [plan.careLookupKey], active: true, limit: 1 });
  const current = existing.data[0];
  if (current && current.unit_amount === plan.monthlyCents && current.recurring?.interval === "month") {
    console.log(`✓ ${plan.careLookupKey}: ${current.id} (already set up)`);
    continue;
  }
  const product = await stripe.products.create({
    name: `Website Care: ${plan.name}`,
    description: `Monthly hosting, security, updates, and support for a ${plan.name} website. Three-month minimum, then month to month.`,
    metadata: { kind: "care", plan: id },
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: plan.monthlyCents,
    recurring: { interval: "month" },
    lookup_key: plan.careLookupKey,
    // Moves the lookup key from an older price if the amount changed.
    transfer_lookup_key: true,
    metadata: { kind: "care", plan: id },
  });
  console.log(`+ ${plan.careLookupKey}: ${price.id} ($${plan.monthlyCents / 100}/month)`);
}

// Customer Portal: update card and billing details, download invoices. Cancellation happens in the Fluxline
// dashboard (one click), which applies the three-month minimum and records the request.
const configuration = await stripe.billingPortal.configurations.create({
  business_profile: { headline: "Fluxline Solutions billing" },
  features: {
    customer_update: { enabled: true, allowed_updates: ["email", "address", "phone", "name"] },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: { enabled: false },
    subscription_update: { enabled: false },
  },
  default_return_url: `${(process.env.APP_URL ?? "https://fluxlinesolutions.com").replace(/\/$/, "")}/client/dashboard`,
});
console.log(`\n✓ Customer Portal configuration ${configuration.id} created.`);
console.log(`  Add STRIPE_PORTAL_CONFIGURATION=${configuration.id} to your Vercel environment variables so the dashboard uses it.`);
console.log("\nDone. Next: create the webhook endpoint (docs/BILLING-SETUP.md, step 8).");

/**
 * Website packages: the single source of truth for prices on the pricing page, at checkout,
 * on invoices, and in the admin dashboard. Amounts are integer cents (USD).
 *
 * Every package is a one-time development fee (50% deposit up front, the balance before launch)
 * plus a required monthly Website Care plan that starts only after launch, with a three-month minimum.
 * There is no annual option.
 */

export type PlanId = "essential" | "business" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** One-time development fee. For Premium this is the starting price; the real figure comes from a quote. */
  devPriceCents: number;
  depositCents: number;
  monthlyCents: number;
  /** Premium is quoted: its starting price is shown, but checkout needs an agreed quote. */
  quoteRequired: boolean;
  badge?: string;
  features: string[];
  /** Stripe lookup key for the monthly Website Care price (created by scripts/stripe-setup.ts). */
  careLookupKey: string;
};

export const CURRENCY = "usd";
export const DEPOSIT_RATE = 0.5;
export const CARE_MINIMUM_MONTHS = 3;

export const PLANS: Record<PlanId, Plan> = {
  essential: {
    id: "essential",
    name: "Essential",
    tagline: "For small businesses that need a professional website.",
    devPriceCents: 70_000,
    depositCents: 35_000,
    monthlyCents: 5_900,
    quoteRequired: false,
    features: [
      "Up to 3 pages",
      "Responsive mobile design",
      "Contact form and click-to-call",
      "Basic on-page SEO",
      "Hosting and SSL",
      "Basic maintenance",
    ],
    careLookupKey: "fluxline_care_essential_monthly",
  },
  business: {
    id: "business",
    name: "Business",
    tagline: "For established businesses looking to attract more customers.",
    devPriceCents: 130_000,
    depositCents: 65_000,
    monthlyCents: 9_900,
    quoteRequired: false,
    badge: "Most popular",
    features: [
      "Up to 7 custom pages",
      "Custom design and branding",
      "Service and location pages",
      "Local SEO foundations",
      "Lead-generation forms",
      "Analytics integration",
      "Hosting and uptime monitoring",
      "Minor content updates",
    ],
    careLookupKey: "fluxline_care_business_monthly",
  },
  premium: {
    id: "premium",
    name: "Premium",
    tagline: "For advanced, highly interactive websites.",
    devPriceCents: 220_000,
    depositCents: 110_000,
    monthlyCents: 14_900,
    quoteRequired: true,
    features: [
      "Custom design and development",
      "Advanced animations",
      "Cinematic visual experiences",
      "Custom integrations",
      "Advanced technical SEO foundations",
      "Priority support",
    ],
    careLookupKey: "fluxline_care_premium_monthly",
  },
};

export const PLAN_ORDER: PlanId[] = ["essential", "business", "premium"];

export const isPlanId = (value: string): value is PlanId => value in PLANS;

/** Plans a customer can pay for directly, without a quote. */
export const SELF_SERVE_PLANS: PlanId[] = PLAN_ORDER.filter((id) => !PLANS[id].quoteRequired);

/** Deposit for a development fee: half, rounded to the cent. */
export const depositFor = (devPriceCents: number) => Math.round(devPriceCents * DEPOSIT_RATE);

export function formatCents(cents: number, { whole = false }: { whole?: boolean } = {}) {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole && Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: whole && Number.isInteger(dollars) ? 0 : 2,
  }).format(dollars);
}

/** The amounts a customer sees before paying, derived in one place so pages and invoices agree. */
export function priceSummary({ devPriceCents, depositCents, monthlyCents }: { devPriceCents: number; depositCents: number; monthlyCents: number }) {
  return {
    devPriceCents,
    depositCents,
    balanceCents: devPriceCents - depositCents,
    monthlyCents,
    minimumCareCents: monthlyCents * CARE_MINIMUM_MONTHS,
  };
}

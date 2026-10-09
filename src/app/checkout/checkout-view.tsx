import { randomUUID } from "node:crypto";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AgreementView } from "@/components/billing/agreement";
import { DarkPage, Notice, Shell } from "@/components/billing/ui";
import { SERVICE_AGREEMENT } from "@/content/agreements";
import { billingStatus } from "@/lib/billing/config";
import { CARE_MINIMUM_MONTHS, PLANS, formatCents, priceSummary, type PlanId } from "@/lib/billing/plans";
import { CALL_PATH } from "@/lib/site";
import { CheckoutForm } from "./checkout-form";

type Props = {
  plan: PlanId;
  amounts: { devPriceCents: number; depositCents: number; monthlyCents: number };
  cancelled?: boolean;
  quote?: { token: string; email: string; contactName: string; businessName: string; scope: string; expiresAt: Date };
};

/** Shared by package checkout and Premium quote checkout: summary, agreement, and the details form. */
export function CheckoutView({ plan, amounts, cancelled, quote }: Props) {
  const summary = priceSummary(amounts);
  const status = billingStatus();
  const details = PLANS[plan];
  const rows: [string, string, string?][] = [
    ["Development fee (one time)", formatCents(summary.devPriceCents)],
    ["Deposit due today (50%)", formatCents(summary.depositCents), "strong"],
    ["Balance, invoiced before launch", formatCents(summary.balanceCents)],
    ["Website Care after launch", `${formatCents(summary.monthlyCents)}/month`],
  ];

  return (
    <DarkPage>
      <Shell className="py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/55">
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>{" "}
          / <span className="text-white/80">{quote ? "Premium quote" : `${details.name} checkout`}</span>
        </nav>
        <h1 className="display-tight mt-6 text-balance text-[2.25rem] sm:text-5xl">
          {quote ? `Your Premium website, ${quote.businessName}` : `Start your ${details.name} website`}
        </h1>

        <div className="mt-8 space-y-3">
          {cancelled && <Notice tone="info" title="Checkout cancelled">Nothing was charged. You can review the details and try again whenever you&apos;re ready.</Notice>}
          {status.enabled && status.mode === "test" && (
            <Notice tone="warning" title="Test mode">
              Stripe is in test mode. Use card 4242 4242 4242 4242 with any future date and CVC. No real money moves.
            </Notice>
          )}
          {!status.enabled && (
            <Notice tone="warning" title="Online deposits aren't open yet">
              We&apos;re finishing payment setup.{" "}
              <Link href={CALL_PATH} className="font-medium underline underline-offset-4">
                Request a call
              </Link>{" "}
              and we&apos;ll get your project started.
            </Notice>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <aside className="lg:order-2 lg:col-span-5">
            <div className="border border-night-line bg-night-soft p-6 lg:sticky lg:top-24">
              <p className="text-sm font-medium text-accent-on-night">{details.name} package</p>
              {quote ? (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-white/75">{quote.scope}</p>
              ) : (
                <ul className="mt-3 space-y-1.5 text-[15px] text-white/75">
                  {details.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <dl className="mt-6 border-t border-night-line">
                {rows.map(([label, value, strong]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-night-line py-3">
                    <dt className={strong ? "font-semibold text-white" : "text-white/65"}>{label}</dt>
                    <dd className={`tabular-nums ${strong ? "text-xl font-semibold text-white" : "text-white"}`}>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-white/55">
                Today you pay only the deposit. Website Care ({CARE_MINIMUM_MONTHS}-month minimum, then month to month, cancel online) starts after launch and
                only after you authorize it.
                {quote && ` Quote valid until ${quote.expiresAt.toLocaleDateString("en-US", { dateStyle: "long" })}.`}
              </p>
              <p className="mt-5 flex items-center gap-2 text-xs text-white/55">
                <ShieldCheck aria-hidden="true" className="size-4 text-accent-on-night" />
                Payments processed by Stripe
              </p>
            </div>
          </aside>

          <div className="space-y-8 lg:order-1 lg:col-span-7">
            <section aria-labelledby="agreement-heading">
              <h2 id="agreement-heading" className="text-lg font-semibold">
                1. Review the service agreement
              </h2>
              <p className="mt-2 text-sm text-white/60">Your acceptance is recorded with the agreement version and the date and time.</p>
              <div className="mt-4">
                <AgreementView doc={SERVICE_AGREEMENT} id="service-agreement" />
              </div>
            </section>
            <section aria-labelledby="details-heading">
              <h2 id="details-heading" className="text-lg font-semibold">
                2. Your details
              </h2>
              <div className="mt-4">
                <CheckoutForm
                  intentId={randomUUID()}
                  plan={plan}
                  agreementVersion={SERVICE_AGREEMENT.version}
                  agreementId="service-agreement"
                  depositLabel={formatCents(summary.depositCents)}
                  monthlyLabel={formatCents(summary.monthlyCents)}
                  quoteToken={quote?.token}
                  fixedEmail={quote?.email}
                  defaults={quote ? { contactName: quote.contactName, businessName: quote.businessName } : undefined}
                  disabledReason={status.enabled ? undefined : status.reason}
                />
              </div>
            </section>
          </div>
        </div>
      </Shell>
    </DarkPage>
  );
}

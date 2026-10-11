import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqList } from "@/components/ui/faq-list";
import { ButtonLink } from "@/components/ui/button-link";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { COMPARISON, PRICING_FAQS } from "@/content/pricing";
import { CARE_MINIMUM_MONTHS, PLANS, PLAN_ORDER, formatCents, priceSummary, type Plan } from "@/lib/billing/plans";
import { pageMetadata } from "@/lib/seo";
import { CALL_PATH } from "@/lib/site";
import { Process } from "@/components/shared/process";

const description =
  "Website packages from Fluxline Solutions: Essential $700, Business $1,300, and Premium from $2,200, each with a 50% deposit to start and a required monthly Website Care plan after launch.";

export const metadata = pageMetadata({ title: "Pricing", description, path: "/pricing" });

function PlanCard({ plan }: { plan: Plan }) {
  const summary = priceSummary(plan);
  const featured = Boolean(plan.badge);
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={`relative flex flex-col border p-6 sm:p-7 ${featured ? "border-bone/70 bg-stage-soft lg:-my-4 lg:py-10" : "border-night-line bg-stage"}`}
    >
      {plan.badge && (
        <p className="absolute -top-px left-6 -translate-y-1/2 bg-bone px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">{plan.badge}</p>
      )}
      <h3 id={`plan-${plan.id}`} className="display text-[1.9rem] uppercase text-bone">
        {plan.name}
      </h3>
      <p className="mt-2 min-h-[3em] text-[15px] leading-relaxed text-white/65">{plan.tagline}</p>

      <div className="mt-6 border-t border-night-line pt-6">
        <p className="text-sm text-white/55">{plan.quoteRequired ? "Starting at" : "Development fee"}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="display text-[2.75rem] tabular-nums text-white">{formatCents(plan.devPriceCents, { whole: true })}</span>
          <span className="text-sm text-white/55">one time</span>
        </p>
        <p className="mt-2 text-[15px] text-white">
          + <span className="font-semibold">{formatCents(plan.monthlyCents, { whole: true })}/month</span> <span className="text-white/60">Website Care</span>
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-px border border-night-line bg-night-line text-sm">
        <div className="bg-stage px-3 py-3">
          <dt className="text-white/55">{plan.quoteRequired ? "Deposit from" : "Deposit to start"}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-white">{formatCents(summary.depositCents, { whole: true })}</dd>
        </div>
        <div className="bg-stage px-3 py-3">
          <dt className="text-white/55">{plan.quoteRequired ? "Balance from" : "Before launch"}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-white">{formatCents(summary.balanceCents, { whole: true })}</dd>
        </div>
      </dl>

      <ul className="mt-6 flex-1 space-y-2.5 text-[15px] text-white/85">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-bone/70" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {plan.quoteRequired ? (
          <>
            <ButtonLink href={`${CALL_PATH}?plan=premium`} variant="inverse" className="w-full" withArrow>
              Request a Premium quote
            </ButtonLink>
            <p className="mt-3 text-center text-xs text-white/50">Quote required before payment.</p>
          </>
        ) : (
          <>
            <ButtonLink href={`/checkout/${plan.id}`} variant={featured ? "primary" : "inverse"} className="w-full" withArrow>
              Start with {plan.name}
            </ButtonLink>
            <p className="mt-3 text-center text-xs text-white/50">
              Pay the {formatCents(summary.depositCents, { whole: true })} deposit securely with Stripe.
            </p>
          </>
        )}
      </div>
    </article>
  );
}

function Cell({ value }: { value: string }) {
  if (value === "yes")
    return (
      <>
        <Check aria-hidden="true" className="mx-auto size-4 text-ink" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === "no")
    return (
      <>
        <Minus aria-hidden="true" className="mx-auto size-4 text-line-strong" />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span>{value}</span>;
}


export default function PricingPage() {
  return (
    <>
      <TrackPageView event="pricing_view" page="/pricing" />
      <section data-tone="dark" className="bg-stage text-bone">
        <Container className="pb-16 pt-14 sm:pb-24 sm:pt-20">
          <p className="label text-bone/60">Pricing</p>
          <h1 className="display mt-5 max-w-[16ch] text-balance text-[2.4rem] uppercase sm:text-[clamp(3rem,5.4vw,4.75rem)]">
            Clear prices. A website you own.
          </h1>
          <p className="mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/70">
            Every package is a one-time development fee, paid as a 50% deposit to start and the balance before launch, plus a required monthly
            Website Care plan that keeps your site hosted, secure, and up to date. Website Care is billed monthly (there is no annual option) and starts only after launch.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-5">
            {PLAN_ORDER.map((id) => (
              <PlanCard key={id} plan={PLANS[id]} />
            ))}
          </div>
          <p className="mt-8 max-w-[70ch] text-sm leading-relaxed text-white/55">
            Prices in US dollars. Website Care has a {CARE_MINIMUM_MONTHS}-month minimum, then continues month to month until you cancel online from your
            dashboard. Nothing recurring is charged when you pay your deposit.
          </p>
        </Container>
      </section>

      <section aria-labelledby="how-payment-works" className="border-b border-ink">
        <Container className="py-16 sm:py-24">
          <SectionHeading id="how-payment-works" eyebrow="How payment works" title="From deposit to launch, in five steps." />
          <div className="mt-12">
            <Process />
          </div>
        </Container>
      </section>

      <section aria-labelledby="compare" className="border-b border-ink">
        <Container className="py-16 sm:py-24">
          <SectionHeading id="compare" eyebrow="Compare packages" title="What each package includes." />
          <div className="relative mt-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[15px]">
              <caption className="sr-only">Comparison of Essential, Business, and Premium website packages</caption>
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="w-[34%] py-4 pr-4 text-sm font-medium text-muted">
                    Feature
                  </th>
                  {PLAN_ORDER.map((id) => (
                    <th key={id} scope="col" className="px-3 py-4 text-center text-base font-semibold text-ink">
                      {PLANS[id].name}
                      {PLANS[id].badge && <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{PLANS[id].badge}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARISON.map((group) => (
                <tbody key={group.group}>
                  <tr>
                    <th scope="colgroup" colSpan={4} className="pb-2 pt-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-b border-line">
                      <th scope="row" className="py-3.5 pr-4 font-normal text-ink-soft">
                        {row.label}
                      </th>
                      {PLAN_ORDER.map((id) => (
                        <td key={id} className={`px-3 py-3.5 text-center text-ink ${id === "business" ? "bg-sunken/60" : ""}`}>
                          <Cell value={row.values[id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/checkout/essential" variant="secondary">
              Start with Essential
            </ButtonLink>
            <ButtonLink href="/checkout/business" withArrow>
              Start with Business
            </ButtonLink>
            <ButtonLink href={`${CALL_PATH}?plan=premium`} variant="secondary">
              Request a Premium quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="pricing-faq">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="pricing-faq" eyebrow="Questions" title="Payment, ownership, and Website Care." />
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              Still deciding? Try the{" "}
              <Link href="/experiences" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
                interactive demos
              </Link>{" "}
              or email us with any question before you start.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={PRICING_FAQS} />
          </div>
        </Container>
      </section>
    </>
  );
}

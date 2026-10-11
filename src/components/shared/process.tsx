import { CARE_MINIMUM_MONTHS } from "@/lib/billing/plans";

/** The order flow, from deposit to launch. Shared by the pricing and services pages so they never disagree. */
export const ORDER_STEPS = [
  { title: "Deposit", body: "Choose a package, review the service agreement, and pay the 50% deposit on Stripe's secure checkout." },
  { title: "Onboarding", body: "Tell us about your business, services, and style, and upload your logo and photos in your client portal." },
  { title: "Design & build", body: "We design and build your site, with two rounds of revisions on each. Your dashboard shows progress at every stage." },
  { title: "Final balance", body: "When your site is approved and ready for launch, we send the remaining 50% as an invoice." },
  { title: "Launch", body: `You authorize the monthly Website Care plan and we launch. ${CARE_MINIMUM_MONTHS}-month minimum, then month to month.` },
];

/* Ruled rows with wide capitals, the same rhythm as the homepage's project list. */
export function Process() {
  return (
    <ol className="border-b border-ink">
      {ORDER_STEPS.map((step, index) => (
        <li key={step.title} className="read-in grid items-baseline gap-2 border-t border-ink py-5 sm:py-6 md:grid-cols-12 md:gap-8">
          <span className="display text-[2.1rem] uppercase sm:text-[clamp(2.6rem,5vw,4.6rem)] md:col-span-7">
            <span className="mr-4 align-top font-sans text-xs font-medium tracking-normal text-muted">{String(index + 1).padStart(2, "0")}</span>
            {step.title}
          </span>
          <span className="max-w-[40ch] text-[15px] leading-relaxed text-ink-soft md:col-span-5">{step.body}</span>
        </li>
      ))}
    </ol>
  );
}

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PLANS, CARE_MINIMUM_MONTHS, formatCents } from "@/lib/billing/plans";
import { TrackPageView } from "@/components/analytics/track-page-view";

const offers = {
  contractors: { title: "Make it easy to choose your business.", intro: "A clear contractor website shows your work, explains your services, and gives customers an obvious way to request an estimate.", features: ["Present services and project photos clearly", "Make phone calls and estimate requests easy on mobile", "Give local customers a clear next step"] },
  restaurants: { title: "Turn menu searches into a clear next step.", intro: "Give hungry visitors a fast, mobile-friendly way to find your menu, hours, location, and how to contact your restaurant.", features: ["Make your menu easy to read on a phone", "Put hours, directions, and contact details within reach", "Create a website that reflects your restaurant"] },
};

export default async function StartPage({ params }: PageProps<"/start/[industry]">) {
  const { industry } = await params;
  if (industry !== "contractors" && industry !== "restaurants") notFound();
  const offer = offers[industry];
  const plan = PLANS.essential;
  return <section data-tone="dark" className="bg-stage py-16 text-bone sm:py-24"><Container>
    <TrackPageView event="sales_page_view" page={`/start/${industry}`} />
    <p className="label text-bone/60">Fluxline websites for {industry}</p>
    <h1 className="display mt-6 max-w-[18ch] text-balance text-[2.4rem] uppercase sm:text-[clamp(3rem,5.4vw,4.8rem)]">{offer.title}</h1>
    <p className="mt-6 max-w-2xl text-lg text-bone/75">{offer.intro}</p>
    <ul className="mt-10 max-w-2xl border-b border-bone/25">{offer.features.map(feature => <li key={feature} className="flex gap-4 border-t border-bone/25 py-3"><span aria-hidden="true">→</span>{feature}</li>)}</ul>
    <div className="mt-12 max-w-2xl border border-bone/25 p-6 sm:p-8">
      <h2 className="display text-[1.7rem] uppercase sm:text-[2.1rem]">Start with an Essential website</h2>
      <p className="mt-4">{formatCents(plan.devPriceCents, { whole: true })} development fee: {formatCents(plan.depositCents, { whole: true })} deposit today, remaining balance before launch.</p>
      <p className="mt-3 text-bone/75">Required Website Care is {formatCents(plan.monthlyCents, { whole: true })}/month after launch, with a {CARE_MINIMUM_MONTHS}-month minimum. Up to 3 pages, responsive mobile design, contact form, and click-to-call. Online ordering and booking integrations require a separate scope.</p>
      <div className="mt-6 flex flex-wrap gap-4"><ButtonLink href="/checkout/essential" variant="inverse">{`Start my website: ${formatCents(plan.depositCents, { whole: true })} deposit`}</ButtonLink><ButtonLink href="/pricing" variant="ghost-inverse">Compare packages</ButtonLink></div>
      <p className="mt-4 text-sm text-bone/60">Review the full scope and service agreement before paying. No promised sales results.</p>
    </div>
  </Container></section>;
}

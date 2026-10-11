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
  return <section className="bg-night py-16 text-white sm:py-24"><Container>
    <TrackPageView event="sales_page_view" page={`/start/${industry}`} />
    <p className="text-sm uppercase tracking-widest text-white/65">Fluxline websites for {industry}</p>
    <h1 className="display-tight mt-6 max-w-3xl text-4xl sm:text-6xl">{offer.title}</h1>
    <p className="mt-6 max-w-2xl text-lg text-white/75">{offer.intro}</p>
    <ul className="mt-8 space-y-3">{offer.features.map(feature => <li key={feature}>✓ {feature}</li>)}</ul>
    <div className="mt-10 max-w-2xl border border-night-line p-6">
      <h2 className="display-tight text-2xl">Start with an Essential website</h2>
      <p className="mt-4">{formatCents(plan.devPriceCents, { whole: true })} development fee: {formatCents(plan.depositCents, { whole: true })} deposit today, remaining balance before launch.</p>
      <p className="mt-3 text-white/75">Required Website Care is {formatCents(plan.monthlyCents, { whole: true })}/month after launch, with a {CARE_MINIMUM_MONTHS}-month minimum. Up to 3 pages, responsive mobile design, contact form, and click-to-call. Online ordering and booking integrations require a separate scope.</p>
      <div className="mt-6 flex flex-wrap gap-4"><ButtonLink href="/checkout/essential" variant="inverse">Start my website — $350 deposit</ButtonLink><ButtonLink href="/pricing" variant="ghost-inverse">Compare packages</ButtonLink></div>
      <p className="mt-4 text-sm text-white/60">Review the full scope and service agreement before paying. No promised sales results.</p>
    </div>
  </Container></section>;
}

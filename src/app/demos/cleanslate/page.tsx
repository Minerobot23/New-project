import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Camera, Clock, FileCheck2, Hammer, MapPin, MessageSquareQuote, Microscope, Phone, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CsHero } from "@/demos/cleanslate/hero";
import { ServiceSelector } from "@/demos/cleanslate/service-selector";
import { RestorationProcess } from "@/demos/cleanslate/process";
import { ComparisonGallery } from "@/demos/cleanslate/comparison";
import { InquiryForm } from "@/demos/cleanslate/inquiry-form";
import { CsHeading } from "@/demos/cleanslate/parts";
import { Annotation } from "@/demos/cleanslate/presentation";
import { EmergencyCallButton } from "@/demos/cleanslate/chrome";
import { ProposedImprovements } from "@/demos/cleanslate/proposal";
import { business, publishedReview, serviceAreas } from "@/demos/cleanslate/content";

export const metadata = {
  title: { absolute: "Clean Slate Services | 24/7 Water, Fire & Mold Restoration, Long Island & NYC (Concept)" },
  description:
    "24/7 water, fire, and mold damage restoration across Long Island and the Tri-State Area. An independent website concept by Fluxline Solutions for Clean Slate Services, Oakdale, NY.",
};

/** Verified from cleanslateservicesny.com; each line paraphrases something the business says about itself there. */
const FACTS = [
  { icon: Clock, title: "24/7 emergency service", body: `Emergency line open around the clock. ${business.officeHours}.` },
  { icon: FileCheck2, title: "Works with your insurer", body: "Clean Slate works with your insurance company to make the process as smooth as possible." },
  { icon: Hammer, title: "Restore and rebuild", body: "Restoration plus construction and home remodeling, so one company can finish the job." },
  { icon: Microscope, title: "Mold work, verified", body: "Samples are taken before and after mold remediation to verify the work." },
  { icon: BadgeCheck, title: "Free consultation", body: "Consultations are free, so a homeowner can find out what they're dealing with first." },
  { icon: Building2, title: "Based in Oakdale, NY", body: "Serving Long Island, the five boroughs, and the Tri-State Area." },
];

/** Space reserved for proof that only Clean Slate can supply and verify. */
const CREDENTIAL_SLOTS = [
  { icon: ShieldCheck, title: "Certifications & licenses", body: "Industry certifications and any state licensing, shown with numbers that can be checked." },
  { icon: FileCheck2, title: "Insurance & coverage", body: "Liability insurance and bonding details, and the claims process explained plainly." },
  { icon: Star, title: "Customer reviews", body: "Reviews pulled from Clean Slate's Google Business Profile or shared with the customer's permission." },
  { icon: Camera, title: "Project photography", body: "Clean Slate's own before-and-after photos, crew, and equipment in place of illustrative stock." },
];

export default function CleanSlateHome() {
  return (
    <>
      <CsHero />

      {/* Emergency band: the number again, in the voice of someone standing in the damage. */}
      <section id="emergency" data-present="Emergency contact" aria-labelledby="cs-emergency-title" className="bg-cs-blue text-white">
        <div className="mx-auto max-w-[84rem] px-5 py-12 sm:px-8 sm:py-14">
          <Annotation n={2} title="Faster emergency contact" tone="dark">
            The number appears in the header, the hero, here, beside every service, and in a call bar that stays on screen on phones. Every
            instance is a working tap-to-call link.
          </Annotation>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="cs-emergency-title" className="font-display text-[1.9rem] font-extrabold leading-tight tracking-[-0.02em] sm:text-[2.4rem]" style={{ fontStretch: "104%" }}>
                Water coming in? Smoke in the house?
              </h2>
              <p className="mt-2 text-lg text-white/80">Don&apos;t wait for business hours. Emergency service is available 24/7.</p>
            </div>
            <a
              href={business.phoneHref}
              className="group flex items-center gap-4 self-start bg-white px-6 py-4 text-cs-ink transition-colors hover:bg-cs-night hover:text-white lg:self-auto"
            >
              <span className="flex size-12 items-center justify-center bg-cs-blue text-white">
                <Phone aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
              </span>
              <span>
                <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] opacity-70">Call 24/7</span>
                <span className="block text-2xl font-bold tracking-tight sm:text-3xl">{business.phoneDisplay}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="services" data-present="Service navigation" aria-labelledby="cs-services-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={3} title="Clearer service navigation">
            Visitors arrive with one problem. The selector lets them pick it and see what happens next, and each service leads to its own page
            for search and for sharing.
          </Annotation>
          <Reveal>
            <CsHeading
              id="cs-services-title"
              eyebrow="What happened?"
              title="Choose the damage. See exactly how we handle it."
              intro="Water, fire and smoke, and mold each need different equipment and a different order of work."
            />
          </Reveal>
          <Reveal className="mt-12" delay={1}>
            <ServiceSelector />
          </Reveal>
        </div>
      </section>

      <section id="process" data-present="Restoration process" aria-labelledby="cs-process-title" className="bg-cs-charcoal py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={4} title="Trust through a clear plan" tone="dark">
            People in a crisis want to know what happens next. Four stages, shown in order, answer that before they ask.
          </Annotation>
          <Reveal>
            <CsHeading
              id="cs-process-title"
              tone="dark"
              eyebrow="Our process"
              title="From the first call to the finished room."
              intro="One team from emergency response through rebuild, so there's no hand-off in the middle."
            />
          </Reveal>
          <Reveal className="mt-14" delay={1}>
            <RestorationProcess />
          </Reveal>
        </div>
      </section>

      <section id="results" data-present="Before & after" aria-labelledby="cs-results-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={5} title="Finished work, presented honestly">
            Before-and-after photos are the strongest proof a restoration company has. This slider is ready for Clean Slate&apos;s own job photos;
            the samples here are labeled as stock.
          </Annotation>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <CsHeading id="cs-results-title" eyebrow="Before & after" title="Drag to see the difference." />
            </Reveal>
            <Reveal className="lg:col-span-5" delay={1}>
              <p className="text-lg leading-relaxed text-cs-slate">
                A presentation format for completed jobs. The pairs shown are illustrative sample imagery, not Clean Slate projects.
              </p>
            </Reveal>
          </div>
          <Reveal className="mt-12" delay={1}>
            <ComparisonGallery />
          </Reveal>
        </div>
      </section>

      <section id="trust" data-present="Trust & credentials" aria-labelledby="cs-trust-title" className="bg-cs-cloud py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={6} title="Only claims that can be verified">
            Everything in this section comes from Clean Slate&apos;s current website. The credential spaces stay empty until Clean Slate supplies
            proof; nothing is invented to fill them.
          </Annotation>
          <Reveal>
            <CsHeading id="cs-trust-title" eyebrow="Why Clean Slate" title="Ready when it matters, and there through the rebuild." />
          </Reveal>

          <ul className="mt-14 grid gap-px bg-cs-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map((fact, index) => (
              <Reveal as="li" key={fact.title} delay={index % 3} className="bg-cs-cloud p-6 sm:p-8">
                <fact.icon aria-hidden="true" className="size-6 text-cs-blue" strokeWidth={1.75} />
                <h3 className="mt-5 text-lg font-semibold">{fact.title}</h3>
                <p className="mt-2 leading-relaxed text-cs-slate">{fact.body}</p>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <Reveal as="figure" className="bg-cs-night p-8 text-white sm:p-10 lg:col-span-5">
              <MessageSquareQuote aria-hidden="true" className="size-8 text-cs-sky" strokeWidth={1.5} />
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-cs-sky">{publishedReview.title}</p>
              <blockquote className="mt-3 text-lg leading-relaxed text-white/90">&ldquo;{publishedReview.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm text-white/60">
                {publishedReview.author} · {publishedReview.source}
              </figcaption>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={1}>
              <h3 className="text-xl font-semibold">Reserved for verified proof</h3>
              <p className="mt-2 max-w-[58ch] leading-relaxed text-cs-slate">
                Designed spaces for the credentials that make restoration customers choose one company over another. Each is filled only with
                material Clean Slate supplies and verifies before launch.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {CREDENTIAL_SLOTS.map((slot) => (
                  <li key={slot.title} className="border border-dashed border-cs-ink/25 p-5">
                    <slot.icon aria-hidden="true" className="size-5 text-cs-blue" strokeWidth={1.75} />
                    <p className="mt-3 font-semibold">{slot.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cs-slate">{slot.body}</p>
                    <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cs-blue">Supplied by Clean Slate</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="areas" data-present="Service areas" aria-labelledby="cs-areas-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={7} title="Local SEO foundations">
            The areas below match the location pages Clean Slate already has. In a launch, each keeps its current URL (for example,
            /locations/queens-ny) and gains real local content.
          </Annotation>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <CsHeading
                id="cs-areas-title"
                eyebrow="Service areas"
                title="Long Island, the five boroughs, and beyond."
                intro={
                  <>
                    Based at {business.street}, {business.city}, {business.region} {business.postalCode}.
                  </>
                }
              />
              <div className="mt-8">
                <EmergencyCallButton label={`Call ${business.phoneDisplay}`} />
              </div>
            </Reveal>
            <Reveal as="ul" className="grid grid-cols-2 gap-px self-start bg-cs-ink/10 sm:grid-cols-3 lg:col-span-7" delay={1}>
              {serviceAreas.map((area) => (
                <li key={area.name} className="bg-white p-5 last:col-span-2 sm:last:col-span-1">
                  <MapPin aria-hidden="true" className="size-4 text-cs-blue" />
                  <p className="mt-3 font-semibold">{area.name}</p>
                  <p className="text-sm text-cs-slate">{area.note}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section id="assessment" data-present="Lead capture" aria-labelledby="cs-assessment-title" className="bg-cs-mist py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={8} title="Lead capture built for phones">
            Six short fields, large touch targets, and the questions the office needs to triage: damage type, ZIP code, and urgency. Choosing
            &ldquo;Emergency&rdquo; points the customer to the phone instead of a callback.
          </Annotation>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <CsHeading
                id="cs-assessment-title"
                eyebrow="Request an assessment"
                title="Tell us what happened."
                intro="For anything happening right now, calling is faster. For everything else, send the details and the office will follow up."
              />
              <a href={business.phoneHref} className="mt-8 flex items-center gap-3 text-2xl font-bold hover:text-cs-blue">
                <Phone aria-hidden="true" className="size-6 text-cs-blue" />
                {business.phoneDisplay}
              </a>
              <p className="mt-1 text-sm text-cs-slate">
                <a href={`mailto:${business.email}`} className="hover:text-cs-ink">
                  {business.email}
                </a>
              </p>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={1}>
              <InquiryForm />
            </Reveal>
          </div>
        </div>
      </section>

      <ProposedImprovements />

      <nav aria-label="Service pages" className="border-t border-cs-ink/10 bg-white">
        <div className="mx-auto flex max-w-[84rem] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 text-sm sm:px-8">
          <span className="font-semibold text-cs-ink">Service pages in this concept:</span>
          <Link href="/demos/cleanslate/flood-and-water-damage" className="group inline-flex items-center gap-1.5 text-cs-slate hover:text-cs-blue">
            Water damage <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link href="/demos/cleanslate/fire-restoration" className="group inline-flex items-center gap-1.5 text-cs-slate hover:text-cs-blue">
            Fire &amp; smoke <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link href="/demos/cleanslate/mold-remediation" className="group inline-flex items-center gap-1.5 text-cs-slate hover:text-cs-blue">
            Mold remediation <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </nav>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Camera, Clock, ExternalLink, FileCheck2, Hammer, MapPin, MessageSquareQuote, Microscope, Phone, ShieldCheck, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
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
import { TriagePanel } from "@/demos/cleanslate/triage";
import { CLAIM_STEPS, HOME_FAQS, SOURCES } from "@/demos/cleanslate/guides";
import { LOCATION_GROUPS, locationBySlug } from "@/demos/cleanslate/locations";
import { BASE, business, publishedReview } from "@/demos/cleanslate/content";

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
            One number, (631) 977-9300, displayed and dialed everywhere: the header, the hero, here, beside every service, and in a call bar
            that stays on screen on phones. On the current site, the most visible phone links dial a different number than the one they show.
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

      <section id="right-now" data-present="What to do right now" aria-labelledby="cs-now-title" className="bg-cs-night py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={3} title="Helpful before it's persuasive" tone="dark">
            Someone standing in a flooded basement wants to know what to do this minute. Answering that first builds the trust that makes them
            call, and every answer ends in the same two actions: call, or send a request with the damage type already filled in.
          </Annotation>
          <Reveal>
            <CsHeading
              id="cs-now-title"
              tone="dark"
              eyebrow="Right now"
              title="What's happening? Here's what to do first."
              intro="General safety steps for the first few minutes, while help is on the way."
            />
          </Reveal>
          <Reveal className="mt-12" delay={1}>
            <TriagePanel />
          </Reveal>
        </div>
      </section>

      <section id="services" data-present="Service navigation" aria-labelledby="cs-services-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={4} title="Emergency restoration first">
            The current homepage headline is &ldquo;Home Remodeling Long Island NY.&rdquo; Here, water, fire, and mold lead. Each opens its own
            page; rebuilding appears as the last step of restoration, not as a separate pitch.
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
          <p className="mt-10 text-[15px] text-cs-slate">
            Storm damage or a break-in?{" "}
            <Link href={`${BASE}/emergency-board-up-service`} className="font-semibold text-cs-ink underline decoration-cs-blue/40 underline-offset-4 hover:text-cs-blue">
              Emergency board-up
            </Link>{" "}
            secures openings until repairs can start.
          </p>
        </div>
      </section>

      <section id="process" data-present="Restoration process" aria-labelledby="cs-process-title" className="bg-cs-charcoal py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={5} title="Trust through a clear plan" tone="dark">
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

      <section id="insurance" data-present="Insurance claims" aria-labelledby="cs-insurance-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={6} title="Answer the question behind the call">
            Almost every restoration customer is also starting an insurance claim. Explaining how that usually goes, with sources, earns trust
            and attracts better-qualified inquiries than another &ldquo;call now&rdquo; banner.
          </Annotation>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <CsHeading
                id="cs-insurance-title"
                eyebrow="Insurance claims"
                title="Filing a claim? Start here."
                intro="Clean Slate works with your insurance company to make the process as smooth as possible. These are the steps that usually matter most."
              />
              <div className="mt-8 border-l-2 border-cs-blue pl-5">
                <p className="font-semibold">Flood is usually a separate policy.</p>
                <p className="mt-1.5 leading-relaxed text-cs-slate">
                  Most homeowners insurance does not cover flood damage, which needs separate flood insurance. Water from a burst pipe is a
                  different kind of claim.
                </p>
                <a href={SOURCES.floodsmart.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-cs-blue underline underline-offset-2">
                  Source: {SOURCES.floodsmart.label}
                  <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              </div>
            </Reveal>
            <ol className="grid gap-px self-start bg-cs-ink/10 sm:grid-cols-2 lg:col-span-7">
              {CLAIM_STEPS.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index % 2} className="bg-white p-6 sm:p-8">
                  <span className="font-mono text-sm text-cs-blue">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-cs-slate">{step.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <p className="mt-8 text-[13px] text-cs-slate">General information, not insurance or legal advice. Coverage depends on your policy and your insurer.</p>
        </div>
      </section>

      <section id="results" data-present="Project gallery" aria-labelledby="cs-results-title" className="bg-cs-cloud py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={7} title="Finished work, presented honestly">
            Before-and-after photos are the strongest proof a restoration company has, and the current site has none. Each card is ready for a
            real Clean Slate job: photos, scope, location, timeline, and the customer&apos;s own review. The samples here are labeled as stock.
          </Annotation>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <CsHeading id="cs-results-title" eyebrow="Project gallery" title="Before and after. Drag to compare." />
            </Reveal>
            <Reveal className="lg:col-span-5" delay={1}>
              <p className="text-lg leading-relaxed text-cs-slate">
                Filter by damage type and pick a project. The pairs shown are illustrative sample imagery, not Clean Slate projects.
              </p>
            </Reveal>
          </div>
          <Reveal className="mt-12" delay={1}>
            <ComparisonGallery />
          </Reveal>
        </div>
      </section>

      <section id="trust" data-present="Trust & credentials" aria-labelledby="cs-trust-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={8} title="Only claims that can be verified">
            Everything in this section comes from Clean Slate&apos;s current website. The credential spaces stay empty until Clean Slate supplies
            proof; nothing is invented to fill them.
          </Annotation>
          <Reveal>
            <CsHeading id="cs-trust-title" eyebrow="Why Clean Slate" title="Ready when it matters, and there through the rebuild." />
          </Reveal>

          <ul className="mt-14 grid gap-px bg-cs-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map((fact, index) => (
              <Reveal as="li" key={fact.title} delay={index % 3} className="bg-white p-6 sm:p-8">
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
          <Annotation n={9} title="Local pages worth ranking">
            Each area links to its own page, written for that place instead of one template with the city swapped in. The current URLs are kept,
            the misspelled /locations/newton-ct redirects to newtown-ct, and Oakdale finally gets a page of its own.
          </Annotation>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
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
              <div className="mt-8 flex flex-col gap-4">
                <EmergencyCallButton label={`Call ${business.phoneDisplay}`} className="self-start" />
                <Link href={`${BASE}/locations`} className="inline-flex items-center gap-2 text-sm font-semibold text-cs-blue hover:underline">
                  All service areas <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            </Reveal>
            <Reveal className="space-y-8 lg:col-span-8" delay={1}>
              {LOCATION_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cs-slate">{group.title}</h3>
                  <ul className="mt-3 grid border-l border-t border-cs-ink/10 sm:grid-cols-2 lg:grid-cols-3">
                    {group.slugs.map((slug) => {
                      const location = locationBySlug(slug);
                      if (!location) return null;
                      return (
                        <li key={slug} className="border-b border-r border-cs-ink/10 bg-white">
                          <Link href={`${BASE}/locations/${slug}`} className="group flex h-full items-start gap-3 p-5 transition-colors hover:bg-cs-cloud">
                            <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-cs-blue" />
                            <span className="flex-1">
                              <span className="block font-semibold group-hover:text-cs-blue">{location.full}</span>
                              <span className="block text-sm text-cs-slate">{location.risks[0].title}</span>
                            </span>
                            <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-cs-slate transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cs-blue" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section id="assessment" data-present="Emergency request" aria-labelledby="cs-assessment-title" className="bg-cs-mist py-20 sm:py-28">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Annotation n={10} title="Qualified requests, built for phones">
            The current forms ask only for name, email, phone, and a message. This request starts with two taps (damage type and urgency),
            then asks for ZIP code and contact details, so the office can triage before calling back. &ldquo;Happening now&rdquo; points the
            customer straight to the phone.
          </Annotation>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <CsHeading
                id="cs-assessment-title"
                eyebrow="Emergency request"
                title="Tell us what happened."
                intro="Two quick steps. For anything happening right now, calling is faster; for everything else, the office follows up with the details in hand."
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

      <section id="faq" data-present="Common questions" aria-labelledby="cs-faq-title" className="py-20 sm:py-28">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }}
        />
        <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <CsHeading id="cs-faq-title" eyebrow="Questions" title="Before you call" />
            <a href={business.phoneHref} className="mt-8 flex items-center gap-3 text-xl font-bold hover:text-cs-blue">
              <Phone aria-hidden="true" className="size-5 text-cs-blue" />
              {business.phoneDisplay}
            </a>
          </Reveal>
          <Reveal className="border-b border-cs-ink/15 lg:col-span-8" delay={1}>
            {HOME_FAQS.map((faq) => (
              <details key={faq.q} className="group border-t border-cs-ink/15">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-semibold leading-snug transition-colors hover:text-cs-blue [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span aria-hidden="true" className="relative mt-1.5 size-4 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="-mt-2 max-w-[62ch] pb-6 pr-10 leading-relaxed text-cs-slate">{faq.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <ProposedImprovements />

      <nav aria-label="Pages in this concept" className="border-t border-cs-ink/10 bg-white">
        <div className="mx-auto flex max-w-[84rem] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 text-sm sm:px-8">
          <span className="font-semibold text-cs-ink">Pages in this concept:</span>
          {[
            { href: `${BASE}/flood-and-water-damage`, label: "Water damage" },
            { href: `${BASE}/fire-restoration`, label: "Fire & smoke" },
            { href: `${BASE}/mold-remediation`, label: "Mold remediation" },
            { href: `${BASE}/emergency-board-up-service`, label: "Board-up" },
            { href: `${BASE}/locations`, label: "8 service areas" },
            { href: `${BASE}/sitemap`, label: "Sitemap" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="group inline-flex items-center gap-1.5 text-cs-slate hover:text-cs-blue">
              {link.label} <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

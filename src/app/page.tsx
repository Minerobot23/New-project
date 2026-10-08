import type { Metadata } from "next";
import Link from "next/link";
import { FluxlineIntro } from "@/components/home/fluxline-intro";
import { EnvironmentChooser } from "@/components/home/environments";
import { ProcessStory } from "@/components/home/process-story";
import { ClosingCta } from "@/components/shared/closing-cta";
import { FaqList, type Faq } from "@/components/ui/faq-list";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { industryLinks, locationLinks } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** What Fluxline brings together, told as one sentence rather than six cards. */
const DISCIPLINES = [
  { word: "Strategy", line: "What the business needs the website to do, and for whom." },
  { word: "Design", line: "A visual world that belongs to this business and no other." },
  { word: "Photography", line: "Shot on location, planned scene by scene." },
  { word: "Development", line: "Fast, responsive, and built to be found." },
  { word: "Interaction", line: "Rooms to walk into, details to discover, choices to make." },
  { word: "Conversion", line: "The call, the table, the quote: built into the experience." },
];

const faqs: Faq[] = [
  {
    q: "Do you take the photographs?",
    a: "Yes. An immersive site is built on photography planned for it: we visit, walk the space the way a customer does, and shoot the exterior, the rooms, the details, and the moments that sell the business. Every frame is planned around a scene in the experience.",
  },
  {
    q: "Will it work on phones?",
    a: "It is designed for the phone first. Scenes are composed for portrait screens, controls sit within thumb reach, and calls, bookings, and quote requests are always one tap away. Visitors who prefer less motion get a calmer version automatically.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on the number of pages, the features you need (like booking, ordering, or quote forms), and how much content needs to be written. After a short call we give you a clear scope and price before any work begins.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most small-business websites take a few weeks, depending on size and how quickly content and feedback come together. We'll give you a realistic timeline up front.",
  },
  {
    q: "What is the free Website Check?",
    a: "You send us your current website and we personally review it for design, mobile experience, customer journey, and conversion opportunities, then tell you what we'd improve. It isn't an automated scan.",
  },
  {
    q: "Do you guarantee more customers or first-page rankings?",
    a: "No. Nobody can honestly guarantee rankings or sales. We build websites that make it easier for customers to understand you and take action, set up tracking so you can see what's working, and follow search best practices.",
  },
  {
    q: "Can you work with my existing domain and email?",
    a: "Usually, yes. We configure your domain carefully so your website moves without disrupting your existing email.",
  },
  {
    q: "Do you only work with businesses on Long Island?",
    a: "No. We serve businesses throughout Long Island and Queens, and work with businesses elsewhere too. Most of the process happens by phone, video, and email.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <FluxlineIntro />
      {/* Without JavaScript the opening can't play; go straight to the page. */}
      <noscript>
        <style>{"[data-intro]{display:none!important}html{overflow:auto!important}"}</style>
      </noscript>

      <EnvironmentChooser />

      <section id="after" aria-labelledby="after-title" className="scroll-mt-16">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-36">
          <h2 id="after-title" className="display max-w-[13ch] text-[2.75rem] uppercase sm:text-[clamp(3.5rem,7.4vw,7.2rem)]">
            You just experienced what we build.
          </h2>
          <div className="mt-14 grid gap-10 border-t border-ink pt-8 lg:grid-cols-12">
            <p className="font-serif text-[1.9rem] italic leading-[1.15] text-ink sm:text-[2.6rem] lg:col-span-7">
              Most websites tell customers about a business. We want them to experience it.
            </p>
            <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9">
              A restaurant is the room, the light, the plate, and the person who greets you. A contractor is the work you can
              stand in. We build websites that carry that across, then make the next step obvious.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[90rem] px-5 pb-24 sm:px-8 sm:pb-32">
          <p className="label text-muted">Fluxline combines</p>
          <ul className="mt-6 border-b border-ink">
            {DISCIPLINES.map(({ word, line }) => (
              <li key={word} className="read-in grid items-baseline gap-2 border-t border-ink py-5 sm:py-6 md:grid-cols-12 md:gap-8">
                <span className="display text-[2.4rem] uppercase sm:text-[clamp(3rem,6.4vw,6.2rem)] md:col-span-8">{word}</span>
                <span className="max-w-[34ch] text-[15px] leading-relaxed text-ink-soft md:col-span-4">{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[30ch] font-serif text-2xl italic text-ink sm:text-3xl">
            to turn real-world businesses into digital experiences.
          </p>
        </div>
      </section>

      <ProcessStory />

      <section aria-labelledby="where-title" className="border-b border-ink">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="where-title" className="display-tight text-[2.25rem] sm:text-[2.75rem]">
              Built for places people walk into.
            </h2>
            <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
              Restaurants, contractors, salons, auto shops, and the local businesses customers choose with their eyes first.
              Serving Long Island, Queens, and beyond.
            </p>
          </div>
          <nav aria-label="Industries and areas" className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <div>
              <p className="label text-muted">Industries</p>
              <ul className="mt-4 border-t border-ink">
                {industryLinks.map((link) => (
                  <li key={link.href} className="border-b border-line-strong">
                    <Link href={link.href} className="group flex items-center justify-between py-3 text-lg text-ink hover:text-accent">
                      {link.label}
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-muted">Areas</p>
              <ul className="mt-4 border-t border-ink">
                {locationLinks.map((link) => (
                  <li key={link.href} className="border-b border-line-strong">
                    <Link href={link.href} className="group flex items-center justify-between py-3 text-lg text-ink hover:text-accent">
                      Web design, {link.label}
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-8">
          <h2 id="faq-title" className="display-tight text-[2.25rem] sm:text-[2.75rem] lg:col-span-4">
            Questions owners ask.
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      <ClosingCta
        title="Your business is an experience. Let's build the website."
        body="Tell us about the place: what customers see when they walk in, and what you want them to do next. We'll tell you what we'd capture and how we'd build it."
      />
    </>
  );
}

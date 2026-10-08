import type { ReactNode } from "react";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Problems } from "@/components/home/problems";
import { PhoneFirst } from "@/components/home/phone-first";
import { ConceptCards } from "@/components/shared/concept-cards";
import { SimulatorSection } from "@/components/simulator/simulator-section";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { Process } from "@/components/shared/process";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { FaqList, type Faq } from "@/components/ui/faq-list";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_GROUPS } from "@/content/services";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const principles = [
  {
    title: "Designed around the next step",
    body: "Every page answers one question: what should a ready customer do now? Call, book, reserve, order, or request a quote.",
  },
  {
    title: "Mobile-first, not mobile-adjusted",
    body: "We design for the phone first, because that's where many of your customers will meet your business.",
  },
  {
    title: "Fast and technically sound",
    body: "Modern hosting, optimized images, clean code, and search-friendly structure from day one.",
  },
  {
    title: "Honest about what a website can do",
    body: "A better website can make it easier for customers to choose you. We don't promise rankings or guaranteed results.",
  },
];

const faqs: Faq[] = [
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

/** Shared section wrapper: a full-width ink rule and the wide page grid. */
function Section({ id, labelledBy, className = "", children }: { id?: string; labelledBy: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`border-t border-ink ${className}`}>
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">{children}</div>
    </section>
  );
}

function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 border-b border-ink pb-0.5 text-sm font-medium text-ink hover:border-accent hover:text-accent">
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <SimulatorSection />
      <Problems />
      <PhoneFirst />

      <Section labelledBy="build-title">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="build-title" className="display-tight max-w-[20ch] text-balance text-[2.25rem] sm:text-[3.25rem]">
            Everything a business website needs to do its job.
          </h2>
          <MoreLink href="/services">All services</MoreLink>
        </div>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft">
          Design, development, and the technical work around it, scoped to what your business actually needs.
        </p>

        {/* Service index: each row is a link; hovering fills it with ink. */}
        <ul className="mt-14 border-b border-ink">
          {SERVICE_GROUPS.map(({ id, title, summary, items }, index) => (
            <li key={id} className="border-t border-ink">
              <Link
                href={`/services#${id}`}
                className="group -mx-5 grid gap-3 px-5 py-7 transition-colors duration-300 hover:bg-ink hover:text-white sm:-mx-8 sm:px-8 lg:grid-cols-12 lg:items-baseline lg:gap-8"
              >
                <span className="text-sm text-muted transition-colors group-hover:text-white/50 lg:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="display-tight text-2xl sm:text-3xl lg:col-span-5">{title}</h3>
                <div className="lg:col-span-5">
                  <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-soft transition-colors group-hover:text-white/80">{summary}</p>
                  <p className="mt-2 text-sm text-muted transition-colors group-hover:text-white/55">
                    {items.map((item) => item.name).join(", ")}
                  </p>
                </div>
                <span aria-hidden="true" className="hidden text-right text-2xl transition-transform duration-300 group-hover:translate-x-1 lg:col-span-1 lg:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="concepts-title" className="bg-surface">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="concepts-title" className="display-tight max-w-[18ch] text-balance text-[2.25rem] sm:text-[3.25rem]">
            Four businesses, four different websites.
          </h2>
          <MoreLink href="/work">All work</MoreLink>
        </div>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          Interactive Concept Demos for fictional businesses, each designed around how its customers actually decide. Open one to
          compare the Before and After on desktop and mobile.
        </p>
        <div className="mt-14">
          <ConceptCards />
        </div>
      </Section>

      <Section labelledBy="industries-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="industries-title" className="display-tight text-balance text-[2.25rem] sm:text-[2.75rem] lg:text-[2.4rem]">
              Built for the businesses customers search for every day.
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-soft">
              Contractors, restaurants, salons, auto shops, and other local businesses each win customers differently. Their
              websites should too.
            </p>
          </div>
          <div className="lg:col-span-8">
            <IndustriesGrid />
          </div>
        </div>
      </Section>

      <Section labelledBy="process-title" className="bg-surface">
        <h2 id="process-title" className="display-tight max-w-[20ch] text-balance text-[2.25rem] sm:text-[3.25rem]">
          A clear process, from first call to launch.
        </h2>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft">
          You always know what&apos;s happening, what it costs, and what comes next.
        </p>
        <div className="mt-14">
          <Process />
        </div>
      </Section>

      <Section labelledBy="principles-title">
        <h2 id="principles-title" className="display-tight max-w-[20ch] text-balance text-[2.25rem] sm:text-[3.25rem]">
          How we think about business websites.
        </h2>
        <dl className="mt-14 grid gap-x-12 md:grid-cols-2">
          {principles.map(({ title, body }) => (
            <div key={title} className="border-t border-ink py-8">
              <dt className="display-tight text-2xl text-ink">{title}</dt>
              <dd className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-ink-soft">{body}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12">
          <CheckPromo />
        </div>
      </Section>

      <Section id="faq" labelledBy="faq-title" className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="display-tight text-[2.25rem] sm:text-[3.25rem]">
              Common questions.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">
              Something not covered here? Email{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}

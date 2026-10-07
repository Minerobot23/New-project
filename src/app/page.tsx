import Link from "next/link";
import { ArrowRight, Gauge, Handshake, MousePointerClick, Smartphone } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Problems } from "@/components/home/problems";
import { SimulatorSection } from "@/components/simulator/simulator-section";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { Process } from "@/components/shared/process";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqList, type Faq } from "@/components/ui/faq-list";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_GROUPS } from "@/content/services";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const principles = [
  {
    icon: MousePointerClick,
    title: "Designed around the next step",
    body: "Every page answers one question: what should a ready customer do now? Call, book, reserve, order, or request a quote.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first, not mobile-adjusted",
    body: "We design for the phone first, because that's where many of your customers will meet your business.",
  },
  {
    icon: Gauge,
    title: "Fast and technically sound",
    body: "Modern hosting, optimized images, clean code, and search-friendly structure from day one.",
  },
  {
    icon: Handshake,
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

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <SimulatorSection />
      <Problems />

      <section aria-labelledby="build-title" className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="build-title"
              eyebrow="What we build"
              title="Everything a business website needs to do its job."
              intro={<p>Design, development, and the technical work around it, scoped to what your business actually needs.</p>}
            />
            <Link href="/services" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong">
              All services <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_GROUPS.map(({ id, icon: Icon, title, summary }) => (
              <li key={id} className="rounded-xl border border-line bg-paper p-6">
                <Icon aria-hidden="true" className="size-5 text-accent" />
                <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{summary}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="industries-title" className="py-20 sm:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            id="industries-title"
            eyebrow="Who we work with"
            title="Built for the businesses customers search for every day."
            intro={
              <p>
                Contractors, restaurants, salons, auto shops, and other local businesses each win customers differently. Their
                websites should too.
              </p>
            }
          />
          <div className="mt-10">
            <IndustriesGrid />
          </div>
        </Container>
      </section>

      <section aria-labelledby="process-title" className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            id="process-title"
            eyebrow="How it works"
            title="A clear process, from first call to launch."
            intro={<p>You always know what&apos;s happening, what it costs, and what comes next.</p>}
          />
          <div className="mt-10">
            <Process />
          </div>
        </Container>
      </section>

      <section aria-labelledby="principles-title" className="py-20 sm:py-24">
        <Container className="max-w-7xl">
          <SectionHeading id="principles-title" eyebrow="Why Fluxline" title="How we think about business websites." />
          <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <CheckPromo />
          </div>
        </Container>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-surface py-20 sm:py-24">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions." />
            <div className="mt-8 hidden lg:block">
              <ButtonLink href={CALL_PATH} withArrow>
                {CALL_CTA_LABEL}
              </ButtonLink>
            </div>
          </div>
          <div>
            <FaqList faqs={faqs} />
            <ButtonLink href={CALL_PATH} size="lg" className="mt-8 w-full sm:w-auto lg:hidden" withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}

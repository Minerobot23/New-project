import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, Handshake, MousePointerClick, Smartphone } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Problems } from "@/components/home/problems";
import { PhoneFirst } from "@/components/home/phone-first";
import { ConceptCards } from "@/components/shared/concept-cards";
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
import { INDUSTRY_IMAGES, PHOTOS } from "@/lib/images";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { CALL_CTA_LABEL, CALL_PATH, industryLinks } from "@/lib/site";

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

/*
 * Asymmetric bento for the six service groups (exactly six cells). Each cell gets its own surface so the grid has rhythm:
 * a dark photo lead, a photo strip, a tinted cell, two quiet cells, and a solid accent cell.
 */
const bento: Record<string, { cell: string; tone: "night" | "surface" | "tint" | "accent" }> = {
  "design-build": { cell: "lg:col-span-7 lg:row-span-2", tone: "night" },
  industry: { cell: "lg:col-span-5", tone: "surface" },
  "lead-tools": { cell: "lg:col-span-5", tone: "tint" },
  search: { cell: "lg:col-span-5", tone: "surface" },
  measurement: { cell: "lg:col-span-4", tone: "surface" },
  "launch-care": { cell: "lg:col-span-3", tone: "accent" },
};

const toneClasses = {
  night: "bg-night text-white",
  surface: "bg-surface text-ink ring-1 ring-line",
  tint: "bg-accent-soft text-ink",
  accent: "bg-accent text-white",
} as const;

const stripImages = industryLinks.slice(0, 4).map((link) => INDUSTRY_IMAGES[link.href]);

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
      <PhoneFirst />

      <section aria-labelledby="build-title" className="border-t border-line bg-sunken/60 py-24 sm:py-32">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="build-title"
              title="Everything a business website needs to do its job."
              intro={<p>Design, development, and the technical work around it, scoped to what your business actually needs.</p>}
            />
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong"
            >
              All services
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(13rem,auto)] lg:grid-cols-12">
            {SERVICE_GROUPS.map(({ id, icon: Icon, title, summary }) => {
              const { cell, tone } = bento[id] ?? { cell: "lg:col-span-4", tone: "surface" as const };
              const onDark = tone === "night" || tone === "accent";
              return (
                <li
                  key={id}
                  className={`reveal relative flex flex-col overflow-hidden rounded-[1.5rem] p-7 sm:p-8 ${toneClasses[tone]} ${cell} ${
                    tone === "night" ? "grain min-h-[26rem] sm:col-span-2 lg:col-span-7" : ""
                  }`}
                >
                  {tone === "night" && (
                    <>
                      <Image
                        src={PHOTOS.deskNight.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        placeholder="blur"
                        className="object-cover opacity-80"
                      />
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-transparent" />
                    </>
                  )}
                  <span
                    className={`relative flex size-10 items-center justify-center rounded-full ${
                      onDark ? "bg-white/10 text-white" : "bg-surface text-accent ring-1 ring-line"
                    }`}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  </span>
                  <div className={`relative ${tone === "night" ? "mt-auto pt-24" : "mt-auto pt-8"}`}>
                    <h3
                      className={`font-semibold tracking-[-0.02em] ${tone === "night" ? "text-2xl sm:text-3xl" : "text-lg"} ${
                        onDark ? "text-white" : "text-ink"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-2 max-w-[46ch] leading-relaxed ${tone === "night" ? "text-base" : "text-[15px]"} ${
                        onDark ? "text-white/75" : "text-ink-soft"
                      }`}
                    >
                      {summary}
                    </p>
                  </div>
                  {id === "industry" && (
                    <div aria-hidden="true" className="relative mt-6 flex -space-x-3">
                      {stripImages.map(
                        (image, index) =>
                          image && (
                            <span key={index} className="relative size-12 overflow-hidden rounded-full ring-[3px] ring-surface">
                              <Image src={image.src} alt="" fill sizes="48px" className="object-cover" />
                            </span>
                          ),
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="concepts-title" className="py-24 sm:py-32">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="concepts-title"
              title="Four businesses, four different websites."
              intro={
                <p>
                  Interactive Concept Demos for fictional businesses, each designed around how its customers actually decide. Open
                  one to compare the Before and After on desktop and mobile.
                </p>
              }
            />
            <Link
              href="/work"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong"
            >
              All work
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-14">
            <ConceptCards />
          </div>
        </Container>
      </section>

      <section aria-labelledby="industries-title" className="pb-24 sm:pb-32">
        <Container className="max-w-7xl">
          <SectionHeading
            id="industries-title"
            title="Built for the businesses customers search for every day."
            intro={
              <p>
                Contractors, restaurants, salons, auto shops, and other local businesses each win customers differently. Their
                websites should too.
              </p>
            }
          />
          <div className="mt-12">
            <IndustriesGrid />
          </div>
        </Container>
      </section>

      <section aria-labelledby="process-title" className="border-y border-line bg-surface py-24 sm:py-32">
        <Container className="max-w-7xl">
          <SectionHeading
            id="process-title"
            title="A clear process, from first call to launch."
            intro={<p>You always know what&apos;s happening, what it costs, and what comes next.</p>}
          />
          <div className="mt-16">
            <Process />
          </div>
        </Container>
      </section>

      <section aria-labelledby="principles-title" className="py-24 sm:py-32">
        <Container className="max-w-7xl">
          <h2
            id="principles-title"
            className="max-w-3xl text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem]"
          >
            How we think about business websites.
          </h2>
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ icon: Icon, title, body }) => (
              <li key={title} className="reveal border-t-2 border-ink pt-6">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 text-accent" />
                <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-20">
            <CheckPromo />
          </div>
        </Container>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-surface py-24 sm:py-32">
        <Container className="max-w-3xl">
          <h2
            id="faq-title"
            className="text-center text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem]"
          >
            Common questions.
          </h2>
          <div className="mt-12">
            <FaqList faqs={faqs} />
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={CALL_PATH} size="lg" withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}

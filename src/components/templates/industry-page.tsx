import Link from "next/link";
import { ArrowRight, Check, Search, Smartphone, Target } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { PageHeader } from "@/components/shared/page-header";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { SimulatorSection } from "@/components/simulator/simulator-section";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import type { IndustryPage } from "@/content/industries";
import { getArticle } from "@/content/resources/registry";
import { INDUSTRY_IMAGES } from "@/lib/images";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

export const industryMetadata = (page: IndustryPage) =>
  pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path });

export function IndustryPageTemplate({ page }: { page: IndustryPage }) {
  const articles = page.articles.map(getArticle).filter((article) => article !== undefined);

  return (
    <>
      <TrackPageView event="service_page_view" page={page.path} />
      <JsonLd
        data={serviceSchema({
          name: `Website design for ${page.name.toLowerCase()}`,
          description: page.metaDescription,
          path: page.path,
          serviceType: "Web design",
          areaServed: ["Long Island, NY", "Queens, NY", "United States"],
        })}
      />
      <PageHeader
        crumbs={[{ name: `Websites for ${page.name}`, path: page.path }]}
        eyebrow={`Websites for ${page.name}`}
        title={page.h1}
        intro={<p>{page.intro}</p>}
        image={INDUSTRY_IMAGES[page.path]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALL_PATH} size="lg" withArrow>
            {CALL_CTA_LABEL}
          </ButtonLink>
          {page.simulator && (
            <ButtonLink href="#demo" size="lg" variant="secondary">
              See the Difference
            </ButtonLink>
          )}
        </div>
      </PageHeader>

      <section aria-labelledby="journey-title" className="py-16 sm:py-20">
        <Container className="max-w-[90rem]">
          <SectionHeading id="journey-title" title={page.journey.title} intro={<p>{page.journey.intro}</p>} />
          <ol
            className={`mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 ${
              page.journey.steps.length === 4 ? "lg:grid-cols-4" : page.journey.steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-5"
            }`}
          >
            {page.journey.steps.map((step, index) => (
              <li key={step.label} className="bg-surface p-5">
                <span className="font-mono text-xs font-medium text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-ink">{step.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="problems-title" className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="max-w-[90rem]">
          <SectionHeading id="problems-title" title="What usually gets in the way." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.problems.map((problem) => (
              <li key={problem.title} className="border border-line bg-paper p-5">
                <h3 className="text-[15px] font-semibold text-ink">{problem.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{problem.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {page.simulator && (
        <SimulatorSection
          id="demo"
          industries={page.simulator}
          title={page.simulator.length > 1 ? "See the difference across industries." : "See the difference for yourself."}
          intro="Switch between Before and After, and between desktop and mobile. Every example is a fictional business built to demonstrate the approach."
          note={page.simulatorNote}
        />
      )}

      <section aria-labelledby="build-title" className="py-16 sm:py-20">
        <Container className="grid max-w-[90rem] gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <SectionHeading id="build-title" title="Recommended website features." />
            <div className="mt-8 border border-line bg-surface p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Target aria-hidden="true" className="size-4 text-accent" /> {page.conversions.title}
              </p>
              <ul className="mt-3 space-y-2">
                {page.conversions.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink-soft">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {page.features.map((feature) => (
              <li key={feature.title} className="border border-line bg-surface p-5">
                <h3 className="text-[15px] font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{feature.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Mobile and search considerations" className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="grid max-w-[90rem] gap-6 md:grid-cols-2">
          {[
            { icon: Smartphone, block: page.mobile },
            { icon: Search, block: page.seo },
          ].map(({ icon: Icon, block }) => (
            <div key={block.title} className="border border-line bg-paper p-6 sm:p-7">
              <Icon aria-hidden="true" className="size-5 text-accent" />
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{block.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {block.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[15px] leading-snug text-ink-soft">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section aria-labelledby="approach-title" className="py-16 sm:py-20">
        <Container className="grid max-w-[90rem] gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading id="approach-title" title="How Fluxline approaches it." />
          <div className="space-y-4 text-[17px] leading-relaxed text-ink-soft">
            {page.approach.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {page.extra && (
              <div className="mt-8 border border-line bg-surface p-6">
                <h3 className="text-base font-semibold text-ink">{page.extra.title}</h3>
                {page.extra.body.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-[15px]">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            <div className="pt-4">
              <CheckPromo title={`Want a second opinion on your ${page.name.toLowerCase()} website?`} />
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="industry-faq-title" className="border-t border-line bg-surface py-16 sm:py-20">
        <Container className="grid max-w-[90rem] gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeading id="industry-faq-title" title="Questions we hear often." />
            {articles.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium text-muted">Related reading</p>
                <ul className="mt-3 space-y-2.5">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/resources/${article.slug}`} className="group inline-flex items-start gap-1.5 text-[15px] font-medium text-ink hover:text-accent">
                        {article.title}
                        <ArrowRight aria-hidden="true" className="mt-1 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <FaqList faqs={page.faqs} />
        </Container>
      </section>

      <section aria-labelledby="other-industries-title" className="py-16 sm:py-20">
        <Container className="max-w-[90rem]">
          <h2 id="other-industries-title" className="text-xl font-semibold tracking-tight text-ink">
            Other industries we work with
          </h2>
          <div className="mt-6">
            <IndustriesGrid exclude={page.path} />
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { PageHeader } from "@/components/shared/page-header";
import { OrderPromo } from "@/components/shared/order-promo";
import { DemoStrip } from "@/components/shared/demo-strip";
import { ClosingCta } from "@/components/shared/closing-cta";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import type { IndustryPage } from "@/content/industries";
import { getArticle } from "@/content/resources/registry";
import { INDUSTRY_IMAGES } from "@/lib/images";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { ORDER_CTA_LABEL, ORDER_PATH } from "@/lib/site";

export const industryMetadata = (page: IndustryPage) =>
  pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path });

const wrap = "mx-auto max-w-[90rem] px-5 sm:px-8";

/** A two-column editorial section: wide capitals on the left, the content on the right. */
function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink">
      <div className={`${wrap} grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <h2 id={id} className="display max-w-[14ch] text-balance text-[2rem] uppercase sm:text-[2.6rem]">
            {title}
          </h2>
          {intro && <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-soft">{intro}</p>}
        </div>
        <div className="lg:col-span-7 lg:col-start-6">{children}</div>
      </div>
    </section>
  );
}

/** Ruled rows: a short title and its explanation, the same rhythm as the homepage's project list. */
function RuledList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="border-b border-ink">
      {items.map((item) => (
        <li key={item.title} className="grid gap-2 border-t border-ink py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 sm:py-6">
          <h3 className="display-tight text-xl text-ink">{item.title}</h3>
          <p className="text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

function PointList({ points }: { points: string[] }) {
  return (
    <ul className="mt-5 border-b border-line-strong">
      {points.map((point) => (
        <li key={point} className="flex gap-4 border-t border-line-strong py-3 text-[15px] leading-snug text-ink">
          <span aria-hidden="true" className="text-muted">—</span>
          {point}
        </li>
      ))}
    </ul>
  );
}

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
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={ORDER_PATH} size="lg" variant="inverse" withArrow>
            {ORDER_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href="#demos" size="lg" variant="ghost-inverse">
            Explore the demos
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-labelledby="journey-title">
        <div className={`${wrap} pb-20 pt-20 sm:pb-28 sm:pt-28`}>
          <p className="label text-muted">How customers decide</p>
          <h2 id="journey-title" className="display mt-5 max-w-[18ch] text-balance text-[2.3rem] uppercase sm:text-[clamp(3rem,5.4vw,5rem)]">
            {page.journey.title}
          </h2>
          <p className="mt-8 max-w-[44ch] font-serif text-[1.6rem] italic leading-[1.2] text-ink sm:text-[2rem]">{page.journey.intro}</p>
          <ol className="mt-14 border-b border-ink">
            {page.journey.steps.map((step, index) => (
              <li key={step.label} className="read-in grid items-baseline gap-2 border-t border-ink py-5 sm:py-6 md:grid-cols-12 md:gap-8">
                <span className="display text-[2.1rem] uppercase sm:text-[clamp(2.6rem,5vw,4.6rem)] md:col-span-7">
                  <span className="mr-4 align-top font-sans text-xs font-medium tracking-normal text-muted">{String(index + 1).padStart(2, "0")}</span>
                  {step.label}
                </span>
                <span className="max-w-[38ch] text-[15px] leading-relaxed text-ink-soft md:col-span-5">{step.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section id="problems-title" title="What usually gets in the way.">
        <RuledList items={page.problems} />
      </Section>

      <div id="demos" className="scroll-mt-16">
        <DemoStrip />
      </div>

      <Section id="build-title" title="What the website should do." intro={page.conversions.title}>
        <ul className="mb-12 grid gap-x-8 sm:grid-cols-2">
          {page.conversions.items.map((item) => (
            <li key={item} className="flex gap-4 border-t border-ink py-3 text-[15px] leading-snug text-ink">
              <span aria-hidden="true">→</span>
              {item}
            </li>
          ))}
        </ul>
        <RuledList items={page.features} />
      </Section>

      <section aria-label="Mobile and search considerations" className="border-t border-ink">
        <div className={`${wrap} grid gap-14 py-20 sm:py-28 md:grid-cols-2 md:gap-8`}>
          {[page.mobile, page.seo].map((block) => (
            <div key={block.title}>
              <h2 className="display-tight text-2xl text-ink sm:text-3xl">{block.title}</h2>
              <PointList points={block.points} />
            </div>
          ))}
        </div>
      </section>

      <Section id="approach-title" title="How Fluxline approaches it.">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink-soft">
          {page.approach.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {page.extra && (
          <div className="mt-10 border-t border-ink pt-6">
            <h3 className="display-tight text-xl text-ink">{page.extra.title}</h3>
            {page.extra.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </Section>

      <OrderPromo title={`Start your ${page.name.toLowerCase()} website.`} />

      <section aria-labelledby="industry-faq-title">
        <div className={`${wrap} grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8`}>
          <div className="lg:col-span-4">
            <h2 id="industry-faq-title" className="display-tight text-[2.25rem] sm:text-[2.75rem]">
              Questions we hear often.
            </h2>
            {articles.length > 0 && (
              <div className="mt-10">
                <p className="label text-muted">Related reading</p>
                <ul className="mt-4 border-t border-ink">
                  {articles.map((article) => (
                    <li key={article.slug} className="border-b border-line-strong">
                      <Link href={`/resources/${article.slug}`} className="group flex items-start justify-between gap-4 py-3 text-[15px] font-medium text-ink hover:text-accent">
                        {article.title}
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList faqs={page.faqs} />
          </div>
        </div>
      </section>

      <section aria-labelledby="other-industries-title" className="border-t border-ink">
        <div className={`${wrap} py-20 sm:py-24`}>
          <p id="other-industries-title" className="label text-muted">
            Other industries we work with
          </p>
          <div className="mt-6">
            <IndustriesGrid exclude={page.path} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}

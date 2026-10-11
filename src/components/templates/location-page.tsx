import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { PageHeader } from "@/components/shared/page-header";
import { OrderPromo } from "@/components/shared/order-promo";
import { DemoStrip } from "@/components/shared/demo-strip";
import { ClosingCta } from "@/components/shared/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import type { LocationPage } from "@/content/locations";
import { LOCATION_IMAGES } from "@/lib/images";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { ORDER_CTA_LABEL, ORDER_PATH, industryLinks, locationLinks, site } from "@/lib/site";

export const locationMetadata = (page: LocationPage) =>
  pageMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path });

const listFormat = new Intl.ListFormat("en", { style: "long", type: "disjunction" });

export function LocationPageTemplate({ page }: { page: LocationPage }) {
  const industries = industryLinks.filter((link) => page.focusIndustries.includes(link.href));
  const otherLocations = locationLinks.filter((link) => link.href !== page.path);

  return (
    <>
      <TrackPageView event="service_page_view" page={page.path} />
      <JsonLd
        data={serviceSchema({
          name: `Web design for ${page.place} businesses`,
          description: page.metaDescription,
          path: page.path,
          serviceType: "Web design",
          areaServed: [`${page.place}, NY`],
        })}
      />
      <PageHeader crumbs={[{ name: `Web Design ${page.place}`, path: page.path }]} eyebrow={`Web design · ${page.place}`} title={page.h1} intro={<p>{page.intro}</p>} image={LOCATION_IMAGES[page.path]}>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-bone/55">
          Whether your business is in {listFormat.format(page.communities)}, we can help. {site.serviceArea}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={ORDER_PATH} size="lg" variant="inverse" withArrow>
            {ORDER_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href="/experiences" size="lg" variant="ghost-inverse">
            Explore the demos
          </ButtonLink>
        </div>
      </PageHeader>

      {page.sections.map((section, index) => (
        <section key={section.heading} aria-labelledby={`section-${index}`} className={index > 0 ? "border-t border-ink" : ""}>
          <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <h2 id={`section-${index}`} className="display max-w-[14ch] text-balance text-[2rem] uppercase sm:text-[2.6rem] lg:col-span-5">
              {section.heading}
            </h2>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-4 text-[17px] leading-relaxed text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-6 border-b border-ink">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-4 border-t border-ink py-3 text-[15px] leading-snug text-ink">
                      <span aria-hidden="true">→</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      <DemoStrip title={`What a ${page.place} business website could feel like.`} />

      <section aria-labelledby="location-industries-title">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24">
          <p className="label text-muted">Industries</p>
          <h2 id="location-industries-title" className="display mt-5 max-w-[20ch] text-balance text-[2rem] uppercase sm:text-[2.6rem]">
            Websites for {page.place} businesses like yours.
          </h2>
          <ul className="mt-10 grid gap-x-12 border-b border-ink md:grid-cols-2">
            {industries.map((link) => (
              <li key={link.href} className="border-t border-ink">
                <Link href={link.href} className="group flex items-center justify-between py-4 text-lg text-ink hover:text-accent">
                  Websites for {link.label}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OrderPromo title={`Start your ${page.place} website.`} />

      <section aria-labelledby="location-faq-title">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="location-faq-title" className="display-tight text-[2.25rem] sm:text-[2.75rem]">
              Questions from {page.place} business owners.
            </h2>
            <p className="label mt-10 text-muted">Other areas we serve</p>
            <ul className="mt-4 border-t border-ink">
              {otherLocations.map((link) => (
                <li key={link.href} className="border-b border-line-strong">
                  <Link href={link.href} className="group flex items-center justify-between py-3 text-[15px] font-medium text-ink hover:text-accent">
                    Web design in {link.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList faqs={page.faqs} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}

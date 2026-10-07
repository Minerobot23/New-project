import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { FaqList } from "@/components/ui/faq-list";
import { PageHeader } from "@/components/shared/page-header";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import type { LocationPage } from "@/content/locations";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { CALL_CTA_LABEL, CALL_PATH, industryLinks, locationLinks, site } from "@/lib/site";

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
      <PageHeader crumbs={[{ name: `Web Design ${page.place}`, path: page.path }]} eyebrow={`Web design · ${page.place}`} title={page.h1} intro={<p>{page.intro}</p>}>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          Whether your business is in {listFormat.format(page.communities)}, we can help. {site.serviceArea}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALL_PATH} size="lg" withArrow>
            {CALL_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href="/#simulator" size="lg" variant="secondary">
            Try the Website Simulator
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-label={`Web design in ${page.place}`} className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-14">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-5 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5 text-[15px] leading-snug text-ink">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <CheckPromo title={`Have a ${page.place} business website we should look at?`} />
        </Container>
      </section>

      <section aria-labelledby="location-industries-title" className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="max-w-7xl">
          <SectionHeading id="location-industries-title" eyebrow="Industries" title={`Websites for ${page.place} businesses like yours.`} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group flex items-center justify-between rounded-xl border border-line bg-paper p-5 text-[15px] font-medium text-ink hover:border-ink/30">
                  Websites for {link.label}
                  <ArrowUpRight aria-hidden="true" className="size-4 text-muted group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="location-faq-title" className="py-16 sm:py-20">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeading id="location-faq-title" eyebrow="FAQ" title={`Questions from ${page.place} business owners.`} />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Other areas we serve</p>
            <ul className="mt-3 space-y-2">
              {otherLocations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] font-medium text-ink hover:text-accent">
                    Web design in {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <FaqList faqs={page.faqs} />
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}

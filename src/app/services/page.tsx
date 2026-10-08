import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/shared/page-header";
import { Process } from "@/components/shared/process";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { FaqList, type Faq } from "@/components/ui/faq-list";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { SERVICE_GROUPS } from "@/content/services";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { PHOTOS } from "@/lib/images";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

const description =
  "Website design, redesign, and development for businesses: mobile-first design, quote and booking paths, menus, local SEO structure, analytics, and launch support.";

export const metadata = pageMetadata({ title: "Website Design & Development Services", description, path: "/services" });

const faqs: Faq[] = [
  {
    q: "Is every service included in every project?",
    a: "No. Each project is scoped to what your business needs. A restaurant might need menus, reservations, and ordering; a roofer might need service pages, a project gallery, and an estimate form. You'll see exactly what's included before work begins.",
  },
  {
    q: "Can you redesign my site without losing what's already working?",
    a: "Yes. A redesign starts by looking at what your current site does well, including pages that already bring in search traffic, so we can keep that value and redirect old URLs properly.",
  },
  {
    q: "Do you write the content?",
    a: "We can. Many owners prefer to share the facts in a conversation and have us turn them into clear, customer-focused pages. You review and approve everything.",
  },
  {
    q: "Will I be able to update the site myself?",
    a: "If regular updates matter to you, like menus, specials, or hours, we plan for that from the start. Otherwise we can handle updates for you.",
  },
  {
    q: "Do you work with the booking or ordering tools I already use?",
    a: "Usually, yes. We integrate or link the reservation, scheduling, or ordering platform you already use so it feels like part of your website.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <TrackPageView event="service_page_view" page="/services" />
      <JsonLd
        data={serviceSchema({
          name: "Business website design and development",
          description,
          path: "/services",
          serviceType: "Web design",
          areaServed: ["Long Island, NY", "Queens, NY", "United States"],
        })}
      />
      <PageHeader
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Everything your website needs to win customers, and nothing it doesn't."
        intro={
          <p>
            Fluxline designs and builds websites for businesses, plus the technical work around them. Every project is scoped to
            what your business actually needs.
          </p>
        }
        image={PHOTOS.deskNight}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALL_PATH} size="lg" withArrow>
            {CALL_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href="/#simulator" size="lg" variant="secondary">
            See What We Build
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-label="Capabilities" className="py-16 sm:py-20">
        <Container className="max-w-[90rem] space-y-6">
          {SERVICE_GROUPS.map(({ id, icon: Icon, title, summary, items }) => (
            <article key={id} id={id} className="grid gap-6 border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
              <div>
                <span className="flex size-10 items-center justify-center bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{summary}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item.name} className="border border-line bg-paper p-4">
                    <h3 className="text-[15px] font-semibold text-ink">{item.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <p className="text-sm text-muted">Not every project includes every capability. Scope is agreed before work begins.</p>
        </Container>
      </section>

      <section aria-labelledby="services-process-title" className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="max-w-[90rem]">
          <SectionHeading id="services-process-title" title="How a project works." />
          <div className="mt-10">
            <Process />
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-industries-title" className="py-16 sm:py-20">
        <Container className="max-w-[90rem]">
          <SectionHeading id="services-industries-title" title="Websites shaped around your industry." />
          <div className="mt-10">
            <IndustriesGrid />
          </div>
          <div className="mt-12">
            <CheckPromo />
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-faq-title" className="border-t border-line bg-surface py-16 sm:py-20">
        <Container className="grid max-w-[90rem] gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading id="services-faq-title" title="Questions about scope." />
          <FaqList faqs={faqs} />
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}

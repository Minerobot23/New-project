import { PageHeader } from "@/components/shared/page-header";
import { Process } from "@/components/shared/process";
import { OrderPromo } from "@/components/shared/order-promo";
import { DemoStrip } from "@/components/shared/demo-strip";
import { ClosingCta } from "@/components/shared/closing-cta";
import { IndustriesGrid } from "@/components/shared/industries-grid";
import { FaqList, type Faq } from "@/components/ui/faq-list";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { SERVICE_GROUPS } from "@/content/services";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { PHOTOS } from "@/lib/images";
import { ORDER_CTA_LABEL, ORDER_PATH } from "@/lib/site";

const description =
  "Website design, redesign, and development for businesses: mobile-first design, quote and booking paths, menus, local SEO structure, analytics, and launch support.";

export const metadata = pageMetadata({ title: "Website Design & Development Services", description, path: "/services" });

const faqs: Faq[] = [
  {
    q: "Is every service included in every project?",
    a: "No. Each project is scoped to what your business needs. A restaurant might need menus, reservations, and ordering; a roofer might need service pages, a project gallery, and an estimate form. Each package lists exactly what it includes, and you review the scope before paying.",
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
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={ORDER_PATH} size="lg" variant="inverse" withArrow>
            {ORDER_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href="/experiences" size="lg" variant="ghost-inverse">
            Explore the demos
          </ButtonLink>
        </div>
      </PageHeader>

      <section aria-label="Capabilities">
        <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
          <p className="label text-muted">What we do</p>
          {SERVICE_GROUPS.map(({ id, title, summary, items }, index) => (
            <article key={id} id={id} className="mt-6 grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-8 [&+&]:mt-16">
              <div className="lg:col-span-5">
                <p className="text-xs font-medium text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="display mt-3 max-w-[14ch] text-balance text-[2rem] uppercase sm:text-[2.6rem]">{title}</h2>
                <p className="mt-4 max-w-[42ch] text-[17px] leading-relaxed text-ink-soft">{summary}</p>
              </div>
              <ul className="border-b border-line-strong lg:col-span-6 lg:col-start-7">
                {items.map((item) => (
                  <li key={item.name} className="grid gap-1 border-t border-line-strong py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                    <h3 className="text-[15px] font-semibold text-ink">{item.name}</h3>
                    <p className="text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <p className="mt-12 text-sm text-muted">Each package lists what it includes. Anything beyond a package is scoped and priced before work begins.</p>
        </div>
      </section>

      <section aria-labelledby="services-process-title" className="border-t border-ink">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">
          <p className="label text-muted">How a project works</p>
          <h2 id="services-process-title" className="display mt-5 max-w-[18ch] text-balance text-[2.3rem] uppercase sm:text-[clamp(3rem,5.4vw,5rem)]">
            From deposit to launch.
          </h2>
          <div className="mt-12">
            <Process />
          </div>
        </div>
      </section>

      <OrderPromo />

      <section aria-labelledby="services-industries-title">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24">
          <p className="label text-muted">Industries</p>
          <h2 id="services-industries-title" className="display mt-5 max-w-[20ch] text-balance text-[2rem] uppercase sm:text-[2.6rem]">
            Websites shaped around your industry.
          </h2>
          <div className="mt-10">
            <IndustriesGrid />
          </div>
        </div>
      </section>

      <DemoStrip />

      <section aria-labelledby="services-faq-title">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8">
          <h2 id="services-faq-title" className="display-tight text-[2.25rem] sm:text-[2.75rem] lg:col-span-4">
            Questions about scope.
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, CircleAlert } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { EmergencyCallButton } from "@/demos/cleanslate/chrome";
import { CsHeading } from "@/demos/cleanslate/parts";
import { Annotation } from "@/demos/cleanslate/presentation";
import { RestorationProcess } from "@/demos/cleanslate/process";
import { BASE, business, serviceAreas, serviceBySlug, services } from "@/demos/cleanslate/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/demos/cleanslate/[service]">) {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: `${BASE}/${service.slug}` },
  };
}

export default async function CleanSlateServicePage({ params }: PageProps<"/demos/cleanslate/[service]">) {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const others = services.filter((item) => item.slug !== service.slug);

  // Structured data a launched page would carry, pointed at Clean Slate's real URL for this service.
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      serviceType: service.name,
      description: service.metaDescription,
      url: service.currentUrl,
      areaServed: serviceAreas.map((area) => area.name),
      provider: { "@type": "HomeAndConstructionBusiness", name: business.name, telephone: business.phoneE164, url: business.officialSite },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: business.officialSite },
        { "@type": "ListItem", position: 2, name: service.name, item: service.currentUrl },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />

      <section id="service-top" data-present={service.name} aria-labelledby="service-title" className="bg-cs-night text-white">
        <div className="mx-auto grid max-w-[84rem] gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:pb-24 lg:pt-14">
          <div className="lg:col-span-6 lg:py-6">
            <Annotation n={1} title="One service, one page" tone="dark">
              Each service gets a dedicated page at the URL Clean Slate already uses ({`/${service.slug}`}), with one H1, a focused title and
              description, FAQ and Service structured data, and a call button above the fold.
            </Annotation>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
                <li>
                  <Link href={BASE} className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="size-3.5" />
                </li>
                <li aria-current="page" className="text-white/85">
                  {service.name}
                </li>
              </ol>
            </nav>
            <p className="mt-8 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75">
              <span aria-hidden="true" className="cs-live size-2 rounded-full bg-cs-alert" />
              24/7 · Long Island, NYC &amp; Tri-State
            </p>
            <h1
              id="service-title"
              className="mt-5 text-balance font-display text-[2.5rem] font-extrabold leading-[1.0] tracking-[-0.03em] sm:text-[clamp(3rem,5vw,4.4rem)]"
              style={{ fontStretch: "106%" }}
            >
              {service.h1}
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/75">{service.lede}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <EmergencyCallButton size="lg" label={service.cta} className="w-full sm:w-auto" />
              <Link
                href={`${BASE}#assessment`}
                className="inline-flex h-14 w-full items-center justify-center px-7 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.5)] transition-colors hover:bg-white hover:text-cs-ink sm:w-auto"
              >
                Request an Assessment
              </Link>
            </div>
          </div>
          <div className="relative min-h-[18rem] overflow-hidden bg-cs-panel lg:col-span-6">
            <Image src={service.image.src} alt={service.image.alt} fill preload sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" className="cs-push object-cover" />
            <span className="absolute left-0 top-0 bg-cs-night/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
              Illustrative photo
            </span>
          </div>
        </div>
      </section>

      <section id="signs" data-present="Warning signs" aria-labelledby="signs-title" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <CsHeading id="signs-title" eyebrow="Know the signs" title={`When to call about ${service.tab.toLowerCase()}`} />
          </Reveal>
          <Reveal as="ul" className="grid gap-px self-start bg-cs-ink/10 sm:grid-cols-2 lg:col-span-7" delay={1}>
            {service.signs.map((sign) => (
              <li key={sign} className="flex gap-3 bg-white p-6">
                <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cs-blue" strokeWidth={1.75} />
                <span className="text-[16px] leading-relaxed">{sign}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="approach" data-present="How the work goes" aria-labelledby="approach-title" className="bg-cs-cloud py-20 sm:py-24">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <CsHeading id="approach-title" eyebrow={service.name} title="How the work goes" />
              <div className="relative mt-10 aspect-[4/3] overflow-hidden bg-cs-mist">
                <Image src={service.detail.src} alt={service.detail.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
                <span className="absolute left-0 top-0 bg-cs-night/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
                  Illustrative photo
                </span>
              </div>
            </Reveal>
            <ol className="self-center lg:col-span-7">
              {service.steps.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index} className="flex gap-6 border-t border-cs-ink/15 py-7 last:border-b">
                  <span className="font-display text-4xl font-extrabold text-cs-blue" style={{ fontStretch: "104%" }}>
                    0{index + 1}
                  </span>
                  <span>
                    <span className="block text-xl font-semibold">{step.title}</span>
                    <span className="mt-1.5 block leading-relaxed text-cs-slate">{step.body}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="service-process" aria-labelledby="service-process-title" className="bg-cs-charcoal py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Reveal>
            <CsHeading id="service-process-title" tone="dark" eyebrow="Every job" title="Four stages, one team." />
          </Reveal>
          <Reveal className="mt-12" delay={1}>
            <RestorationProcess />
          </Reveal>
        </div>
      </section>

      <section id="faq" data-present="Questions" aria-labelledby="faq-title" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <CsHeading id="faq-title" eyebrow="Questions" title="Good to know" />
          </Reveal>
          <Reveal className="border-b border-cs-ink/15 lg:col-span-8" delay={1}>
            {service.faqs.map((faq) => (
              <details key={faq.q} className="group border-t border-cs-ink/15">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-semibold leading-snug transition-colors hover:text-cs-blue [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span aria-hidden="true" className="relative mt-1.5 size-4 shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="-mt-2 max-w-[62ch] pb-6 pr-10 leading-relaxed text-cs-slate">{faq.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="related-title" className="bg-cs-blue text-white">
        <div className="mx-auto grid max-w-[84rem] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 id="related-title" className="font-display text-3xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "104%" }}>
              Need something else?
            </h2>
            <a href={business.phoneHref} className="mt-3 inline-block text-2xl font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
              Call {business.phoneDisplay}, 24/7
            </a>
          </div>
          <ul className="grid gap-px bg-white/20 sm:grid-cols-2 lg:col-span-7">
            {others.map((item) => (
              <li key={item.slug} className="bg-cs-blue">
                <Link href={`${BASE}/${item.slug}`} className="group flex items-center justify-between gap-4 p-6 text-lg font-semibold hover:bg-cs-blue-deep">
                  {item.name}
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

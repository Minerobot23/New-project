import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, ExternalLink, Lightbulb, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { EmergencyCallButton } from "@/demos/cleanslate/chrome";
import { CsHeading } from "@/demos/cleanslate/parts";
import { Annotation } from "@/demos/cleanslate/presentation";
import { InquiryForm } from "@/demos/cleanslate/inquiry-form";
import { BASE, business, services } from "@/demos/cleanslate/content";
import { locationBySlug, locations } from "@/demos/cleanslate/locations";
import { SOURCES } from "@/demos/cleanslate/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((location) => ({ location: location.slug }));
}

export async function generateMetadata({ params }: PageProps<"/demos/cleanslate/locations/[location]">) {
  const { location: slug } = await params;
  const location = locationBySlug(slug);
  if (!location) return {};
  return {
    title: `Water, Fire & Mold Restoration in ${location.full}`,
    description: location.metaDescription,
    alternates: { canonical: `${BASE}/locations/${location.slug}` },
  };
}

/** Anchor text that says what the link is, in the place it's for. */
const localAnchor: Record<string, (place: string) => string> = {
  water: (place) => `Water damage restoration in ${place}`,
  fire: (place) => `Fire & smoke restoration in ${place}`,
  mold: (place) => `Mold remediation in ${place}`,
  boardup: (place) => `Emergency board-up in ${place}`,
};

export default async function CleanSlateLocationPage({ params }: PageProps<"/demos/cleanslate/locations/[location]">) {
  const { location: slug } = await params;
  const location = locationBySlug(slug);
  if (!location) notFound();

  const ordered = [...services].sort((a, b) => Number(b.id === location.lead) - Number(a.id === location.lead));
  const nearby = location.nearby.map(locationBySlug).filter((item) => item !== undefined);
  const pageText = [location.tip.body, ...location.risks.map((risk) => risk.body)].join(" ");
  const sources = [
    ...(pageText.includes("EPA") ? [SOURCES.epa] : []),
    ...(/flood (damage|insurance)/i.test(pageText) ? [SOURCES.floodsmart] : []),
  ];
  const pageUrl = location.currentUrl ?? `${business.officialSite}/locations/${location.slug}`;

  // Structured data a launched page would carry, pointed at Clean Slate's own URL for this area.
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Water, fire, and mold damage restoration in ${location.full}`,
      serviceType: "Property damage restoration",
      url: pageUrl,
      areaServed: { "@type": "Place", name: location.full },
      provider: { "@type": "HomeAndConstructionBusiness", name: business.name, telephone: business.phoneE164, url: business.officialSite },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: location.faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: business.officialSite },
        { "@type": "ListItem", position: 2, name: "Service Areas", item: `${business.officialSite}/locations` },
        { "@type": "ListItem", position: 3, name: location.full, item: pageUrl },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />

      <section id="area-top" data-present={location.full} aria-labelledby="area-title" className="relative isolate overflow-hidden bg-cs-night text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src={location.image.src} alt="" fill preload sizes="100vw" placeholder="blur" className="cs-push object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cs-night via-cs-night/80 to-cs-night/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-cs-night/90 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-[84rem] px-5 pb-16 pt-10 sm:px-8 lg:pb-24 lg:pt-14">
          <Annotation n={1} title="Written for the place" tone="dark">
            Clean Slate&apos;s current location pages repeat one template with the city name swapped in. This page is about {location.name}: its
            housing, the damage that housing tends to have, and what to do differently here. Search engines and homeowners both reward that.
          </Annotation>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href={BASE} className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href={`${BASE}/locations`} className="hover:text-white">
                  Service Areas
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-white/90">
                {location.full}
              </li>
            </ol>
          </nav>
          <p className="mt-10 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75">
            <MapPin aria-hidden="true" className="size-4 text-cs-sky" />
            {location.region}
          </p>
          <h1
            id="area-title"
            className="mt-5 max-w-[17ch] text-balance font-display text-[2.4rem] font-extrabold leading-[1.0] tracking-[-0.03em] sm:text-[clamp(3rem,5.4vw,4.75rem)]"
            style={{ fontStretch: "106%" }}
          >
            Water, Fire &amp; Mold Restoration in {location.full}
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-white/80">{location.lede}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <EmergencyCallButton size="lg" label={`Call 24/7: ${business.phoneDisplay}`} className="w-full sm:w-auto" />
            <a
              href="#request"
              className="inline-flex h-14 w-full items-center justify-center px-7 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.5)] transition-colors hover:bg-white hover:text-cs-ink sm:w-auto"
            >
              Send an Emergency Request
            </a>
          </div>
          <p className="mt-10 text-[11px] uppercase tracking-[0.14em] text-white/40">{location.image.caption}</p>
        </div>
      </section>

      <section id="homes" data-present="Local housing & risks" aria-labelledby="homes-title" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <CsHeading id="homes-title" eyebrow={`Homes in ${location.name}`} title="What the housing here means for restoration" intro={location.housing} />
            </Reveal>
            <ol className="grid gap-px self-start bg-cs-ink/10 lg:col-span-7">
              {location.risks.map((risk, index) => (
                <Reveal as="li" key={risk.title} delay={index} className="flex gap-5 bg-white p-6 sm:p-7">
                  <span className="font-display text-3xl font-extrabold text-cs-blue" style={{ fontStretch: "104%" }}>
                    0{index + 1}
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">{risk.title}</span>
                    <span className="mt-1.5 block leading-relaxed text-cs-slate">{risk.body}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="mt-14 flex flex-col gap-5 bg-cs-mist p-6 sm:flex-row sm:p-8">
            <Lightbulb aria-hidden="true" className="size-7 shrink-0 text-cs-blue" strokeWidth={1.75} />
            <div>
              <h2 className="text-xl font-semibold">{location.tip.title}</h2>
              <p className="mt-2 max-w-[70ch] leading-relaxed text-cs-slate">{location.tip.body}</p>
              {sources.length > 0 && (
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  {sources.map((source) => (
                    <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cs-blue underline underline-offset-2">
                      Source: {source.label}
                      <ExternalLink aria-hidden="true" className="size-3" />
                    </a>
                  ))}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="area-services" data-present="Services in this area" aria-labelledby="area-services-title" className="bg-cs-charcoal py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Reveal>
            <CsHeading id="area-services-title" tone="dark" eyebrow="Services" title={`Restoration services in ${location.name}`} />
          </Reveal>
          <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {ordered.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index} className="bg-cs-charcoal">
                <Link href={`${BASE}/${service.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-cs-panel">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-cs-panel">
                    <Image src={service.image.src} alt="" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-cover opacity-85 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
                  </span>
                  <span className="mt-5 block text-lg font-semibold leading-snug">{localAnchor[service.id](location.name)}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">{service.signs[0]}, {service.signs[1].toLowerCase()}, and more.</span>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-cs-sky">
                    How it works <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="request" data-present="Emergency request" aria-labelledby="request-title" className="bg-cs-mist py-20 sm:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <CsHeading id="request-title" eyebrow={`Help in ${location.name}`} title="Call now, or send the details." />
            <ul className="mt-8 space-y-4 text-[15px]">
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cs-blue" />
                <span>
                  <a href={business.phoneHref} className="text-xl font-bold hover:text-cs-blue">
                    {business.phoneDisplay}
                  </a>
                  <span className="block text-cs-slate">24/7 emergency service</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cs-blue" />
                <span className="text-cs-slate">{business.officeHours}</span>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cs-blue" />
                <span className="text-cs-slate">
                  Based at {business.street}, {business.city}, {business.region} {business.postalCode}
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={1}>
            <InquiryForm compact />
          </Reveal>
        </div>
      </section>

      <section id="area-faq" data-present="Local questions" aria-labelledby="area-faq-title" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <CsHeading id="area-faq-title" eyebrow="Questions" title={`Restoration in ${location.name}`} />
          </Reveal>
          <Reveal className="border-b border-cs-ink/15 lg:col-span-8" delay={1}>
            {location.faqs.map((faq) => (
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

      <nav aria-labelledby="nearby-title" className="border-t border-cs-ink/10 bg-cs-cloud">
        <div className="mx-auto max-w-[84rem] px-5 py-12 sm:px-8">
          <h2 id="nearby-title" className="text-sm font-semibold uppercase tracking-[0.16em] text-cs-slate">
            Nearby service areas
          </h2>
          <ul className="mt-5 grid gap-px bg-cs-ink/10 sm:grid-cols-3">
            {nearby.map((item) => (
              <li key={item.slug} className="bg-cs-cloud">
                <Link href={`${BASE}/locations/${item.slug}`} className="group flex items-center justify-between gap-4 py-4 pr-4 text-lg font-semibold hover:text-cs-blue sm:px-5">
                  {item.full}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${BASE}/locations`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cs-blue hover:underline">
            All service areas <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </nav>
    </>
  );
}

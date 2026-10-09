import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ConceptBar, CsFooter, CsHeader, MobileCallBar } from "@/demos/cleanslate/chrome";
import { PresentationProvider } from "@/demos/cleanslate/presentation";
import { business, serviceAreas, services } from "@/demos/cleanslate/content";

/*
 * An unofficial concept for a real business: kept out of search engines (noindex, not in the sitemap)
 * so it can never compete with, or be mistaken for, Clean Slate's own site. Shared by direct link only.
 */
export const metadata: Metadata = {
  title: {
    default: "Clean Slate Services | 24/7 Water, Fire & Mold Restoration (Concept)",
    template: "%s | Clean Slate Services (Concept)",
  },
  description:
    "An independent website concept by Fluxline Solutions for Clean Slate Services: 24/7 water, fire, and mold damage restoration across Long Island and the Tri-State Area.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  // The root layout's canonical is "/"; each concept page states its own instead.
  alternates: { canonical: "/demos/cleanslate" },
  openGraph: {
    type: "website",
    siteName: "Fluxline Solutions",
    title: "Clean Slate Services: a website concept by Fluxline Solutions",
    description: "24/7 water, fire, and mold damage restoration across Long Island and the Tri-State Area. An independent redesign concept.",
    url: "/demos/cleanslate",
    images: [{ url: "/demos/cleanslate/hero-storm.webp", width: 2400, height: 1600, alt: "Lightning over a house at night" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0d0f12" };

/**
 * LocalBusiness data built only from details published on cleanslateservicesny.com.
 * It points at their real site; on this noindexed concept page it is a demonstration of what launch would ship.
 */
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: business.name,
  legalName: business.legalName,
  url: business.officialSite,
  telephone: business.phoneE164,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    addressRegion: business.region,
    postalCode: business.postalCode,
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  areaServed: serviceAreas.map((area) => area.name),
  sameAs: business.social.map((item) => item.href),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Restoration services",
    itemListElement: [
      ...services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.name } })),
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Board-Up" } },
    ],
  },
};

export default function CleanSlateLayout({ children }: LayoutProps<"/demos/cleanslate">) {
  return (
    <PresentationProvider>
      <JsonLd data={localBusiness} />
      <div className="bg-white text-cs-ink" data-track-location="cleanslate-demo">
        <ConceptBar />
        <CsHeader />
        {children}
        <CsFooter />
        <MobileCallBar />
      </div>
    </PresentationProvider>
  );
}

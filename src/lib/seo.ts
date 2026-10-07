import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Per-page metadata with a canonical URL and matching Open Graph / Twitter fields. */
/** Child metadata replaces (not merges) the parent's openGraph, so the shared image is set explicitly. */
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: site.title };

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, type: "website", locale: "en_US", images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
  };
}

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;

type JsonLdObject = Record<string, unknown>;

export const organizationSchema = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.contact.email,
  description: site.description,
  areaServed: ["Long Island, NY", "Nassau County, NY", "Suffolk County, NY", "Queens, NY"],
});

export const websiteSchema = (): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
});

export const serviceSchema = ({
  name,
  description,
  path,
  serviceType,
  areaServed,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  areaServed?: string[];
}): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  serviceType,
  url: absoluteUrl(path),
  provider: { "@id": `${site.url}/#organization` },
  ...(areaServed ? { areaServed } : {}),
});

export const articleSchema = ({
  title,
  description,
  path,
  published,
  updated,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
}): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: absoluteUrl(path),
  mainEntityOfPage: absoluteUrl(path),
  datePublished: published,
  dateModified: updated ?? published,
  author: { "@id": `${site.url}/#organization` },
  publisher: { "@id": `${site.url}/#organization` },
});

import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/resources/registry";
import { CASE_STUDIES } from "@/content/work";
import { industryLinks, locationLinks, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly", lastModified?: string) => ({
    url: `${site.url}${path}`,
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    entry("", 1, "weekly"),
    entry("/services", 0.9),
    entry("/request-a-call", 0.9),
    entry("/website-check", 0.9),
    entry("/experiences", 0.8),
    entry("/experiences/restaurant", 0.7),
    ...CASE_STUDIES.map((study) => entry(`/work/${study.slug}`, 0.6)),
    ...industryLinks.map((link) => entry(link.href, 0.8)),
    ...locationLinks.map((link) => entry(link.href, 0.7)),
    entry("/resources", 0.7, "weekly"),
    ...ARTICLES.map((article) => entry(`/resources/${article.slug}`, 0.6, "monthly", article.updated ?? article.published)),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}

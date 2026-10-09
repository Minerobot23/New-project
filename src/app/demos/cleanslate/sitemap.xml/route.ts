import { business, services } from "@/demos/cleanslate/content";
import { locations } from "@/demos/cleanslate/locations";

export const dynamic = "force-static";

/**
 * The XML sitemap a launch would publish at cleanslateservicesny.com/sitemap.xml, generated from the
 * same content as the pages. It lists Clean Slate's own URLs (the concept itself is noindexed and is
 * deliberately left out of Fluxline's sitemap and robots.txt).
 */
export function GET() {
  const paths = [
    "/",
    ...services.map((service) => `/${service.slug}`),
    "/locations",
    ...locations.map((location) => `/locations/${location.slug}`),
    "/contact-us",
    "/sitemap",
  ];
  const urls = paths
    .map((path) => `  <url>\n    <loc>${business.officialSite}${path === "/" ? "/" : path}</loc>\n  </url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

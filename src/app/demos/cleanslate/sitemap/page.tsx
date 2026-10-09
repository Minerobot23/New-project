import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CsHeading } from "@/demos/cleanslate/parts";
import { BASE, services } from "@/demos/cleanslate/content";
import { LOCATION_GROUPS, locationBySlug } from "@/demos/cleanslate/locations";

export const metadata = {
  title: "Sitemap",
  description: "Every page on the Clean Slate Services website concept: services, service areas, and contact.",
  alternates: { canonical: `${BASE}/sitemap` },
};

const linkClass = "text-[17px] text-cs-ink underline decoration-cs-ink/20 underline-offset-4 hover:text-cs-blue hover:decoration-cs-blue";

/** A plain, crawlable list of every page. Replaces the current footer link to another company's sitemap. */
export default function CleanSlateSitemap() {
  return (
    <div className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8 sm:py-24">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-cs-slate">
          <li>
            <Link href={BASE} className="hover:text-cs-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-cs-ink">
            Sitemap
          </li>
        </ol>
      </nav>
      <div className="mt-8">
        <CsHeading as="h1" eyebrow="Sitemap" title="Every page on this site." />
      </div>

      <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        <section aria-labelledby="sm-main">
          <h2 id="sm-main" className="text-sm font-semibold uppercase tracking-[0.16em] text-cs-blue">
            Main
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href={BASE} className={linkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link href={`${BASE}#assessment`} className={linkClass}>
                Emergency request
              </Link>
            </li>
            <li>
              <Link href={`${BASE}#insurance`} className={linkClass}>
                Insurance claims
              </Link>
            </li>
            <li>
              <Link href={`${BASE}/locations`} className={linkClass}>
                Service areas
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="sm-services">
          <h2 id="sm-services" className="text-sm font-semibold uppercase tracking-[0.16em] text-cs-blue">
            Services
          </h2>
          <ul className="mt-4 space-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`${BASE}/${service.slug}`} className={linkClass}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sm-areas">
          <h2 id="sm-areas" className="text-sm font-semibold uppercase tracking-[0.16em] text-cs-blue">
            Service areas
          </h2>
          {LOCATION_GROUPS.map((group) => (
            <div key={group.title} className="mt-4">
              <p className="text-sm font-semibold text-cs-slate">{group.title}</p>
              <ul className="mt-2 space-y-3">
                {group.slugs.map((slug) => {
                  const location = locationBySlug(slug);
                  return location ? (
                    <li key={slug}>
                      <Link href={`${BASE}/locations/${slug}`} className={linkClass}>
                        {location.full}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ))}
        </section>
      </div>
      <p className="mt-16 text-sm text-cs-slate">
        For search engines:{" "}
        <a href={`${BASE}/sitemap.xml`} className="text-cs-blue underline underline-offset-2">
          XML sitemap
        </a>{" "}
        (lists the addresses this site would use on cleanslateservicesny.com).
      </p>
    </div>
  );
}

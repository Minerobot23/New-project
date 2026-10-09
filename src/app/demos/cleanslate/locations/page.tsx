import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { EmergencyCallButton } from "@/demos/cleanslate/chrome";
import { CsHeading } from "@/demos/cleanslate/parts";
import { Annotation } from "@/demos/cleanslate/presentation";
import { BASE, business } from "@/demos/cleanslate/content";
import { LOCATION_GROUPS, locationBySlug } from "@/demos/cleanslate/locations";

export const metadata = {
  title: "Service Areas: Long Island, NYC & Connecticut",
  description:
    "Clean Slate Services provides 24/7 water, fire, and mold damage restoration from Oakdale, NY across Long Island, the five boroughs of New York City, and Newtown, CT.",
  alternates: { canonical: `${BASE}/locations` },
};

export default function CleanSlateLocationsHub() {
  return (
    <>
      <section id="areas-top" data-present="Service areas" aria-labelledby="areas-title" className="bg-cs-night text-white">
        <div className="mx-auto max-w-[84rem] px-5 pb-16 pt-10 sm:px-8 lg:pb-20 lg:pt-14">
          <Annotation n={1} title="A hub for every area" tone="dark">
            The current site has location pages but no page that lists them. This hub links every area, so homeowners and search engines can
            find each one from a single place.
          </Annotation>
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href={BASE} className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-white/90">
                Service Areas
              </li>
            </ol>
          </nav>
          <div className="mt-10">
            <CsHeading
              as="h1"
              id="areas-title"
              tone="dark"
              eyebrow="Service areas"
              title="Long Island, the five boroughs, and Connecticut."
              intro={`24/7 water, fire, and mold damage restoration from a home base at ${business.street}, ${business.city}, ${business.region}.`}
            />
          </div>
          <div className="mt-9">
            <EmergencyCallButton size="lg" label={`Call 24/7: ${business.phoneDisplay}`} />
          </div>
        </div>
      </section>

      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-[84rem] space-y-20 px-5 sm:px-8">
          {LOCATION_GROUPS.map((group) => (
            <section key={group.title} aria-labelledby={`group-${group.title}`}>
              <h2 id={`group-${group.title}`} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-cs-blue">
                <MapPin aria-hidden="true" className="size-4" />
                {group.title}
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.slugs.map((slug, index) => {
                  const location = locationBySlug(slug);
                  if (!location) return null;
                  return (
                    <Reveal as="li" key={slug} delay={index % 3}>
                      <Link href={`${BASE}/locations/${slug}`} className="group block">
                        <span className="relative block aspect-[4/3] overflow-hidden bg-cs-mist">
                          <Image
                            src={location.image.src}
                            alt={location.image.alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                            placeholder="blur"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-cs-night/85 via-cs-night/10 to-transparent" />
                          <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{location.region}</span>
                            <span className="mt-1 block font-display text-2xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "104%" }}>
                              {location.full}
                            </span>
                          </span>
                        </span>
                        <span className="mt-4 block leading-relaxed text-cs-slate">{location.risks.map((risk) => risk.title).join(" · ")}</span>
                        <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-cs-blue">
                          Restoration in {location.name}
                          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </ul>
            </section>
          ))}
          <p className="text-xs uppercase tracking-[0.14em] text-cs-slate/70">Photos show local housing types and are illustrative, not Clean Slate projects.</p>
        </div>
      </div>
    </>
  );
}

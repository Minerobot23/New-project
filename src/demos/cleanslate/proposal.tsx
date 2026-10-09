import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CornerDownRight, MoveRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { LogoMark } from "@/components/brand/logo-mark";
import { site } from "@/lib/site";
import { BASE, improvements, services } from "./content";
import { AUDIT } from "./guides";
import currentSite from "../../../public/demos/cleanslate/current-site-mobile.webp";
import conceptSite from "../../../public/portfolio/cleanslate-mobile.webp";

/** Their current URLs, as found on cleanslateservicesny.com. A migration keeps every one of them. */
const ARCHITECTURE: { path: string; label: string; demo?: string; children?: string[] }[] = [
  { path: "/", label: "Home: emergency first, then services, process, proof, areas, assessment", demo: BASE },
  ...services.map((service) => ({ path: `/${service.slug}`, label: service.name, demo: `${BASE}/${service.slug}` })),
  {
    path: "/locations",
    label: "Service-area hub, then one page per area, written for that place",
    demo: `${BASE}/locations`,
    children: [
      "oakdale-ny (new: home base)",
      "brookhaven-ny (rewritten for Brookhaven)",
      "queens-ny",
      "brooklyn-ny",
      "manhattan-ny",
      "bronx-ny",
      "staten-island-ny",
      "newtown-ct (301 from newton-ct)",
    ],
  },
  { path: "/blog/…", label: "Existing articles, kept and linked to the service they support" },
  { path: "/contact-us", label: "Contact and emergency request" },
  { path: "/sitemap", label: "Human-readable sitemap, linked from every footer", demo: `${BASE}/sitemap` },
];

const MIGRATION = [
  "Keep every current URL. Where one must change, a permanent (301) redirect points to its replacement.",
  "Carry over existing articles and location pages, so links and search history built over time are preserved.",
  "Keep the business name, address, and phone identical to the Google Business Profile.",
  "Launch with an XML sitemap and confirm in Google Search Console that pages are indexed.",
];

/**
 * Fluxline's proposal, deliberately styled in Fluxline's own system (paper, ink, square rules)
 * so it reads as a separate document from Clean Slate's site above it.
 */
export function ProposedImprovements() {
  return (
    <section id="proposal" data-present="Proposed improvements" aria-labelledby="proposal-title" className="border-t-4 border-accent bg-paper text-ink">
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="flex items-center gap-3">
          <LogoMark className="size-7" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">Proposal by Fluxline Solutions · Not part of the Clean Slate site</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 id="proposal-title" className="display mt-8 max-w-[16ch] text-[1.95rem] [overflow-wrap:anywhere] min-[400px]:text-[2.4rem] sm:text-[clamp(3rem,5.4vw,4.8rem)]">
            Proposed improvements
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
            What this concept changes, and why each change matters to a business whose best customers find it on a phone, in a hurry, on the
            worst day of their year.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-x-10 border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {improvements.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index % 4} className="border-b border-ink py-8">
              <p className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="display-tight mt-4 text-2xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h3 className="display-tight text-3xl">The first screen on a phone</h3>
            <p className="mt-3 max-w-[48ch] leading-relaxed text-ink-soft">
              Where most emergency visitors land. Both captured on October 9, 2026, at the same phone size.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { src: currentSite, label: "Current site", alt: "The current Clean Slate Services homepage on a phone, headed Home Remodeling Long Island NY" },
                { src: conceptSite, label: "This concept", alt: "This concept's homepage on a phone, headed When Disaster Strikes, We're Ready" },
              ].map((shot) => (
                <figure key={shot.label}>
                  <div className="rounded-[26px] bg-ink p-[6px] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
                    <div className="relative aspect-[390/844] overflow-hidden rounded-[20px] bg-white">
                      <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1024px) 18vw, 42vw" className="object-cover object-top" />
                    </div>
                  </div>
                  <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{shot.label}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={1}>
            <h3 className="display-tight text-3xl">What we found on the current site</h3>
            <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-soft">
              Checked on cleanslateservicesny.com on October 9, 2026, on desktop and phone. Each is fixable, and each is handled in this concept.
            </p>
            <ol className="mt-8 border-t border-ink">
              {AUDIT.map((item, index) => (
                <li key={item.found} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[2rem_1fr_1.25rem_1fr] sm:gap-4">
                  <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] leading-relaxed text-ink">{item.found}</p>
                  <MoveRight aria-hidden="true" className="hidden size-4 translate-y-1 text-line-strong sm:block" />
                  <p className="text-[15px] leading-relaxed text-ink-soft">
                    <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent sm:sr-only">In this concept:</span>
                    {item.fix}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h3 className="display-tight text-3xl">Search-friendly page structure</h3>
            <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-soft">
              One topic per page, one H1 per page, and the URLs Clean Slate already uses. The service pages in this concept are built at those
              same paths.
            </p>
            <ul className="mt-8 border border-ink bg-surface font-mono text-[13px]">
              <li className="border-b border-line px-4 py-3 text-muted">cleanslateservicesny.com</li>
              {ARCHITECTURE.map((node) => (
                <li key={node.path} className="border-b border-line px-4 py-3 last:border-b-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <CornerDownRight aria-hidden="true" className="size-3.5 shrink-0 translate-y-0.5 text-line-strong" />
                    <span className="font-semibold text-ink">{node.path}</span>
                    <span className="font-sans text-[13px] text-ink-soft">{node.label}</span>
                    {node.demo && (
                      <Link href={node.demo} className="ml-auto font-sans text-[12px] font-medium text-accent hover:underline">
                        View in concept
                      </Link>
                    )}
                  </div>
                  {node.children && <p className="mt-2 pl-6 text-[12px] leading-relaxed text-muted">{node.children.join(" · ")}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={1}>
            <h3 className="display-tight text-3xl">If Clean Slate approves a migration</h3>
            <ul className="mt-6 space-y-4">
              {MIGRATION.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-accent" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-soft">
              These are foundations, not promises. Search rankings depend on many factors outside any website, and no ranking or traffic
              outcome is guaranteed.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-20 flex flex-col gap-6 border-t border-ink pt-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="display-tight text-3xl">Next step: a short walkthrough.</p>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-soft">
              An independent concept, prepared without a commission, to show what Clean Slate&apos;s site could be. Questions and feedback go to{" "}
              {site.contact.name} at{" "}
              <a href={`mailto:${site.contact.email}`} className="font-medium text-ink underline decoration-accent/50 underline-offset-4 hover:text-accent">
                {site.contact.email}
              </a>
              .
            </p>
          </div>
          <Link href="/portfolio" className="group inline-flex h-14 items-center gap-3 bg-ink px-7 text-[15px] font-medium text-white hover:bg-accent">
            See more Fluxline work
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

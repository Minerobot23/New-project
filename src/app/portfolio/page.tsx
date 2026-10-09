import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Presentation } from "lucide-react";
import { ClosingCta } from "@/components/shared/closing-cta";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { Reveal } from "@/components/motion/reveal";
import { BrowserFrame, PhoneFrame, TabletFrame } from "@/components/portfolio/devices";
import { ShareLink } from "@/components/portfolio/share-link";
import { CONCEPT, PROJECTS, type PortfolioProject } from "@/content/portfolio";
import { pageMetadata } from "@/lib/seo";

/*
 * Shared by direct link with prospective clients. Kept out of search results (and the nav and sitemap)
 * because it features real businesses' names in unsolicited concepts; /experiences remains the public showcase.
 */
export const metadata = {
  ...pageMetadata({
    title: "Portfolio",
    description:
      "Selected work by Fluxline Solutions: Miami Restaurant & Bar and Casa Catracha redesign concepts, the live Pro Cam Solutions LI site, and a custom concept for Clean Slate Services.",
    path: "/portfolio",
  }),
  robots: { index: false, follow: true },
};

const ALL = [...PROJECTS, CONCEPT];

function Devices({ project, first }: { project: PortfolioProject; first: boolean }) {
  const label = project.name;
  return (
    <div>
      <div className="relative lg:px-[7%] lg:pb-[10%]">
        <Reveal>
          <BrowserFrame src={project.shots.desktop} alt={`${label} homepage on a desktop browser`} url={project.displayUrl} preload={first} />
        </Reveal>
        <div className="scroll-float absolute bottom-0 left-0 hidden w-[19%] lg:block">
          <TabletFrame src={project.shots.tablet} alt={`${label} on a tablet`} />
        </div>
        <div className="scroll-float absolute -bottom-[3%] right-0 hidden w-[13.5%] lg:block">
          <PhoneFrame src={project.shots.mobile} alt={`${label} on a phone`} />
        </div>
      </div>
      {/* Below the large breakpoint the tablet and phone sit side by side under the browser. */}
      <Reveal className="mt-5 grid grid-cols-[1.32fr_1fr] items-end gap-4 sm:mx-auto sm:max-w-xl lg:hidden" delay={1}>
        <TabletFrame src={project.shots.tablet} alt={`${label} on a tablet`} />
        <PhoneFrame src={project.shots.mobile} alt={`${label} on a phone`} />
      </Reveal>
      <p aria-hidden="true" className="label mt-6 text-center text-bone/40 lg:mt-10">
        Desktop · Tablet · Mobile
      </p>
    </div>
  );
}

function Chapter({ project, index }: { project: PortfolioProject; index: number }) {
  const concept = project === CONCEPT;
  const external = project.href.startsWith("http");
  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className={`border-t border-bone/12 py-24 sm:py-32 ${concept ? "bg-[#0d1014]" : ""}`}
      style={{ "--chapter": project.accent } as CSSProperties}
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        {concept && (
          <Reveal className="mb-14 border border-dashed border-[var(--chapter)]/60 p-5 sm:p-6">
            <p className="label text-[var(--chapter)]">Custom Business Concept · Not a client project</p>
            <p className="mt-3 max-w-[70ch] leading-relaxed text-bone/75">{project.statusNote}</p>
          </Reveal>
        )}

        <header className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end [&>*]:min-w-0">
          <Reveal className="lg:col-span-8">
            <p className="font-mono text-sm" style={{ color: project.accent }}>
              {concept ? "Concept" : project.number}
            </p>
            <h2 id={`${project.slug}-title`} className="display mt-4 text-[1.9rem] uppercase [overflow-wrap:anywhere] min-[400px]:text-[2.3rem] sm:text-[clamp(3rem,6.2vw,6rem)]">
              {project.name}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:text-right" delay={1}>
            <p className="text-bone/70">{project.kind}</p>
            <p className="mt-3 inline-flex items-center gap-2 border px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.14em]" style={{ borderColor: project.accent, color: project.accent }}>
              <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: project.accent }} />
              {project.status}
            </p>
            {!concept && <p className="mt-3 text-sm text-bone/50">{project.statusNote}</p>}
          </Reveal>
        </header>

        <div className="mt-14 sm:mt-20">
          <Devices project={project} first={index === 0} />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-12 [&>*]:min-w-0">
          <Reveal className="lg:col-span-5">
            <p className="label text-bone/50">The objective</p>
            <p className="mt-5 font-serif text-[1.65rem] italic leading-snug text-bone sm:text-[2rem]">{project.objective}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.focus.map((item) => (
                <li key={item} className="border border-bone/20 px-3 py-1.5 text-[13px] text-bone/75">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {external ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-14 items-center justify-center gap-3 bg-bone px-7 text-[15px] font-medium text-stage transition-colors hover:bg-[var(--chapter)]"
                >
                  Explore Project
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only">(opens {project.displayUrl} in a new tab)</span>
                </a>
              ) : (
                <>
                  <Link
                    href={project.href}
                    className="group inline-flex h-14 items-center justify-center gap-3 bg-bone px-7 text-[15px] font-medium text-stage transition-colors hover:bg-[var(--chapter)]"
                  >
                    Explore Project
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href={`${project.href}?present=1`}
                    className="inline-flex h-14 items-center justify-center gap-3 px-7 text-[15px] font-medium text-bone shadow-[inset_0_0_0_1.5px_rgba(239,234,226,0.45)] transition-colors hover:bg-bone hover:text-stage"
                  >
                    <Presentation aria-hidden="true" className="size-4" />
                    Presentation mode
                  </Link>
                </>
              )}
            </div>
            <p className="mt-4 break-all font-mono text-[12px] text-bone/40">{project.displayUrl}</p>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="label text-bone/50">What we built</p>
              <ol className="mt-5 border-t border-bone/12">
                {project.built.map((item, itemIndex) => (
                  <li key={item} className="flex gap-5 border-b border-bone/12 py-4 leading-relaxed text-bone/80">
                    <span className="font-mono text-[12px] leading-7" style={{ color: project.accent }}>
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="mt-12" delay={1}>
              <BrowserFrame src={project.shots.detail} alt={`${project.name}: ${project.detailCaption}`} url={project.displayUrl} sizes="(min-width: 1024px) 45vw, 92vw" />
              <p className="mt-4 text-sm text-bone/50">{project.detailCaption}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <TrackPageView event="portfolio_view" page="/portfolio" />
      <div data-tone="dark" className="bg-stage text-bone">
        <header className="mx-auto grid max-w-[90rem] gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-12 lg:pb-28">
          <div className="lg:col-span-7">
            <p className="label intro-rise text-bone/55">Portfolio · Fluxline Solutions</p>
            <h1 className="display mt-7 text-[2.75rem] uppercase min-[400px]:text-[3.1rem] sm:text-[clamp(4rem,7.2vw,7rem)]">
              <span className="line-mask keep-lines">
                <span style={{ "--i": 0 } as CSSProperties}>Selected</span>
              </span>
              <span className="line-mask keep-lines">
                <span style={{ "--i": 1 } as CSSProperties}>work.</span>
              </span>
            </h1>
            <p className="intro-rise mt-9 max-w-[50ch] text-lg leading-relaxed text-bone/70" style={{ "--i": 3 } as CSSProperties}>
              Websites designed around one question: what should a customer feel, and do, in their first ten seconds? Two restaurant redesign
              concepts, a live security-technology site, and a custom concept for a restoration company. Each is labeled for exactly what it is.
            </p>
            <div className="intro-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ "--i": 4 } as CSSProperties}>
              <a href={`#${PROJECTS[0].slug}`} className="group inline-flex items-center gap-2 text-[15px] font-medium text-bone">
                View the work
                <ArrowDown aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <ShareLink path="/portfolio" title="Fluxline Solutions: Selected work" className="text-[15px] text-bone/60 hover:text-bone" />
            </div>
          </div>

          <nav aria-label="Projects" className="intro-rise self-end lg:col-span-5" style={{ "--i": 5 } as CSSProperties}>
            <ol className="border-t border-bone/15">
              {ALL.map((project) => (
                <li key={project.slug} className="border-b border-bone/15">
                  <a href={`#${project.slug}`} className="group flex items-baseline gap-5 py-4 transition-colors hover:text-white">
                    <span className="w-7 font-mono text-[12px]" style={{ color: project.accent }}>
                      {project === CONCEPT ? "CS" : project.number}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-medium text-bone group-hover:text-white">{project.name}</span>
                      <span className="block text-sm text-bone/50">{project.kind}</span>
                    </span>
                    <span className="hidden text-[11px] uppercase tracking-[0.14em] text-bone/45 sm:inline">{project.status}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {PROJECTS.map((project, index) => (
          <Chapter key={project.slug} project={project} index={index} />
        ))}
        <Chapter project={CONCEPT} index={PROJECTS.length} />
      </div>

      <ClosingCta
        title="Let's Build Something Better."
        body="Every project here started with a conversation about the business: who the customers are, what they need to see, and what they should do next. Tell us about yours."
      />
    </>
  );
}

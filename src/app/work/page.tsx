import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/shared/page-header";
import { ClosingCta } from "@/components/shared/closing-cta";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { ConceptCards } from "@/components/shared/concept-cards";
import { CASE_STUDIES } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work",
  description:
    "Website projects and interactive concept demos from Fluxline Solutions, showing how we approach design, mobile experience, and conversion for local businesses.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <TrackPageView event="portfolio_view" page="/work" />
      <PageHeader
        crumbs={[{ name: "Work", path: "/work" }]}
        eyebrow="Work"
        title="Work that shows the thinking, not just the visuals."
        intro={
          <p>
            Below are interactive concept projects for fictional businesses. They show how we approach structure, mobile
            experience, and the path to a call, booking, or order. Client case studies will appear here as projects launch, and
            only with each client&apos;s permission.
          </p>
        }
      />

      {CASE_STUDIES.length > 0 && (
        <section aria-labelledby="case-studies-title" className="py-16">
          <Container className="max-w-7xl">
            <h2 id="case-studies-title" className="text-2xl font-semibold tracking-tight text-ink">
              Client projects
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <Link href={`/work/${study.slug}`} className="block rounded-xl border border-line bg-surface p-6 hover:border-ink/30">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{study.industry}</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{study.client}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{study.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section aria-labelledby="concepts-title" className="py-16 sm:py-20">
        <Container className="max-w-7xl">
          <h2 id="concepts-title" className="text-2xl font-semibold tracking-tight text-ink">
            Interactive concept projects
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Each one is a fictional business with a realistic Before and a redesigned After that you can explore on desktop and
            mobile.
          </p>
          <div className="mt-8">
            <ConceptCards />
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16">
        <Container className="max-w-7xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">What every case study will include</h2>
          <ul className="mt-6 grid gap-3 text-[15px] text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
            {[
              "The business and the problem it was facing",
              "The original site, side by side with the new one",
              "The design approach and why decisions were made",
              "Features built: booking, quotes, menus, and more",
              "Measured results, only when they're real and measured",
              "The client's own words, only if they choose to share them",
            ].map((item) => (
              <li key={item} className="rounded-lg border border-line bg-paper px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingCta title="Want your business to be the first case study we publish?" body="Request a call and tell us about your current website. We'll walk you through how we'd approach it." />
    </>
  );
}

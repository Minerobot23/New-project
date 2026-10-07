import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/shared/page-header";
import { ClosingCta } from "@/components/shared/closing-cta";
import { CASE_STUDIES } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((item) => item.slug === slug);
  if (!study) return {};
  return pageMetadata({ title: `${study.client} Case Study`, description: study.summary, path: `/work/${study.slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((item) => item.slug === slug);
  if (!study) notFound();

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Work", path: "/work" },
          { name: study.client, path: `/work/${study.slug}` },
        ]}
        eyebrow={study.industry}
        title={study.client}
        intro={<p>{study.summary}</p>}
      />
      <Container className="max-w-3xl space-y-10 py-14 text-[16px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-xl font-semibold text-ink">The problem</h2>
          <p className="mt-3">{study.problem}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Our approach</h2>
          <p className="mt-3">{study.approach}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">What we built</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            {study.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
        {study.results && study.results.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-ink">Results</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {study.results.map((result) => (
                <li key={result.label} className="rounded-lg border border-line bg-surface p-4">
                  <p className="text-2xl font-semibold text-ink">{result.value}</p>
                  <p className="text-sm">{result.label}</p>
                  {result.note && <p className="mt-1 text-xs text-muted">{result.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
        {study.testimonial && (
          <figure className="rounded-xl border border-line bg-surface p-6">
            <blockquote className="text-lg text-ink">&ldquo;{study.testimonial.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-sm">
              {study.testimonial.name}
              {study.testimonial.role ? `, ${study.testimonial.role}` : ""}
            </figcaption>
          </figure>
        )}
      </Container>
      <ClosingCta />
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/shared/page-header";
import { CheckPromo } from "@/components/shared/check-promo";
import { ClosingCta } from "@/components/shared/closing-cta";
import { ARTICLES, type ArticleCategory } from "@/content/resources/registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resources: Business Website Guides",
  description:
    "Practical guides for business owners on website costs, redesigns, timelines, and turning more website visitors into calls, bookings, and customers.",
  path: "/resources",
});

const CATEGORIES: ArticleCategory[] = ["Planning", "Website Strategy", "Industry Guides"];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Resources", path: "/resources" }]}
        eyebrow="Resources"
        title="Straight answers about business websites."
        intro={<p>Practical guides for owners deciding what their website needs, what it should cost, and how to get more from it.</p>}
      />
      <div className="py-14 sm:py-16">
        <Container className="max-w-7xl space-y-14">
          {CATEGORIES.map((category) => (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h2 id={`cat-${category}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {category}
              </h2>
              <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ARTICLES.filter((article) => article.category === category).map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/resources/${article.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-ink/30"
                    >
                      <span className="text-lg font-semibold leading-snug text-ink">{article.title}</span>
                      <span className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{article.description}</span>
                      <span className="mt-5 flex items-center justify-between text-sm">
                        <span className="text-muted">{article.readingMinutes} min read</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-accent">
                          Read <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <CheckPromo />
        </Container>
      </div>
      <ClosingCta />
    </>
  );
}

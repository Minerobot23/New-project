import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { OrderPromo } from "@/components/shared/order-promo";
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
      {CATEGORIES.map((category, index) => (
        <section key={category} aria-labelledby={`cat-${index}`} className={index > 0 ? "border-t border-ink" : ""}>
          <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-8">
            <h2 id={`cat-${index}`} className="display max-w-[12ch] text-[2rem] uppercase sm:text-[2.6rem] lg:col-span-4">
              {category}
            </h2>
            <ul className="border-b border-ink lg:col-span-8">
              {ARTICLES.filter((article) => article.category === category).map((article) => (
                <li key={article.slug} className="border-t border-ink">
                  <Link href={`/resources/${article.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-10">
                    <span className="display-tight text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">{article.title}</span>
                    <span className="label self-center text-muted sm:row-span-2">
                      {article.readingMinutes} min read <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                    <span className="max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">{article.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <OrderPromo />
      <ClosingCta />
    </>
  );
}

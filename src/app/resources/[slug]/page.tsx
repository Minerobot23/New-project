import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ClosingCta } from "@/components/shared/closing-cta";
import { ARTICLES, getArticle } from "@/content/resources/registry";
import { ARTICLE_BODIES } from "@/content/resources/bodies";
import { articleSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const metadata = pageMetadata({ title: article.title, description: article.description, path: `/resources/${slug}` });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: article.published } };
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export default async function ArticlePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  const Body = ARTICLE_BODIES[slug];
  if (!article || !Body) notFound();

  const path = `/resources/${slug}`;
  const related = ARTICLES.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 3);
  const updated = article.updated ?? article.published;

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: article.title,
          description: article.description,
          path,
          published: article.published,
          updated: article.updated,
        })}
      />
      <article>
        <header data-tone="dark" className="bg-stage text-bone">
          <Container className="max-w-4xl pb-16 pt-8 sm:pb-20">
            <Breadcrumbs
              tone="dark"
              items={[
                { name: "Resources", path: "/resources" },
                { name: article.title, path },
              ]}
            />
            <p className="label mt-12 text-bone/60">{article.category}</p>
            <h1 className="display mt-5 text-balance text-[2.2rem] uppercase sm:text-[3.4rem]">{article.title}</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-bone/75">{article.description}</p>
            <p className="mt-8 text-sm text-bone/55">
              By {site.name} · <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time> · {article.readingMinutes} min read
            </p>
          </Container>
        </header>
        <Container className="max-w-3xl py-12 sm:py-14">
          <div className="prose-article">
            <Body />
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-ink py-16">
          <Container className="max-w-3xl">
            <h2 id="related-title" className="label text-muted">
              Keep reading
            </h2>
            <ul className="mt-5 divide-y divide-line-strong border-y border-ink">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/resources/${item.slug}`} className="display-tight block py-4 text-xl text-ink hover:text-accent">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <ClosingCta />
    </>
  );
}

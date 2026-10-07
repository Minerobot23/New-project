import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ClosingCta } from "@/components/shared/closing-cta";
import { ARTICLES, getArticle } from "@/content/resources/registry";
import { ARTICLE_BODIES } from "@/content/resources/bodies";
import { ARTICLE_IMAGES } from "@/lib/images";
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
  const cover = ARTICLE_IMAGES[slug];

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
        <header className="border-b border-line">
          <Container className="max-w-3xl py-10 sm:py-14">
            <Breadcrumbs
              items={[
                { name: "Resources", path: "/resources" },
                { name: article.title, path },
              ]}
            />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{article.category}</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">{article.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{article.description}</p>
            <p className="mt-6 text-sm text-muted">
              By {site.name} · <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time> · {article.readingMinutes} min read
            </p>
          </Container>
        </header>
        {cover && (
          <Container className="max-w-4xl pt-10 sm:pt-12">
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-sunken">
              <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 960px) 896px, 100vw" placeholder="blur" loading="eager" className="object-cover" />
            </div>
          </Container>
        )}
        <Container className="max-w-3xl py-12 sm:py-14">
          <div className="prose-article">
            <Body />
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-surface py-14">
          <Container className="max-w-3xl">
            <h2 id="related-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Keep reading
            </h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/resources/${item.slug}`} className="block py-4 text-[17px] font-medium text-ink hover:text-accent">
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

import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { SiteImage } from "@/lib/images";

type Props = {
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  /** Optional photo shown beside the copy on large screens and below it on small ones. */
  image?: SiteImage;
};

/** Standard inner-page header: breadcrumbs, eyebrow, H1, intro, optional actions and photo. */
export function PageHeader({ crumbs, eyebrow, title, intro, children, image }: Props) {
  return (
    <section className="border-b border-line">
      <Container
        className={`max-w-7xl py-10 sm:py-14 ${image ? "grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14" : ""}`}
      >
        <div>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>}
          <h1
            className={`${eyebrow ? "mt-3" : "mt-8"} max-w-4xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl`}
          >
            {title}
          </h1>
          {intro && <div className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">{intro}</div>}
          {children}
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sunken lg:aspect-[4/4.2]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              loading="eager"
              className="object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}

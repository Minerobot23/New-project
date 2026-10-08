import Image from "next/image";
import type { ReactNode } from "react";
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
    <section className="border-b border-ink">
      <div
        className={`mx-auto max-w-[90rem] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 ${image ? "grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8" : ""}`}
      >
        <div className={image ? "lg:col-span-7" : ""}>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="mt-10 text-sm font-medium text-accent">{eyebrow}</p>}
          <h1
            className={`display ${eyebrow ? "mt-4" : "mt-10"} max-w-[18ch] text-balance text-[2.5rem] text-ink sm:text-[clamp(3rem,5.4vw,5rem)]`}
          >
            {title}
          </h1>
          {intro && <div className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-ink-soft">{intro}</div>}
          {children}
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-sunken lg:col-span-5 lg:aspect-[4/4.4]">
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
      </div>
    </section>
  );
}

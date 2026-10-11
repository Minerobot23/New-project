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
  /** Optional photo, set full height beside the copy on large screens and below it on small ones. */
  image?: SiteImage;
};

/** Inner-page opening on the dark stage, matching the homepage: spaced label, wide capitals, then the actions. */
export function PageHeader({ crumbs, eyebrow, title, intro, children, image }: Props) {
  return (
    <section data-tone="dark" className="relative overflow-hidden bg-stage text-bone">
      <div className={`mx-auto max-w-[90rem] ${image ? "lg:grid lg:grid-cols-12" : ""}`}>
        <div className={`px-5 pb-14 pt-8 sm:px-8 sm:pb-20 ${image ? "lg:col-span-7 lg:pb-24" : ""}`}>
          <Breadcrumbs items={crumbs} tone="dark" />
          {eyebrow && <p className="label mt-12 text-bone/60">{eyebrow}</p>}
          <h1
            className={`display ${eyebrow ? "mt-5" : "mt-12"} max-w-[20ch] text-balance text-[2rem] uppercase sm:text-[clamp(2.8rem,4.6vw,4.4rem)]`}
          >
            {title}
          </h1>
          {intro && <div className="mt-6 max-w-[58ch] text-pretty text-lg leading-relaxed text-bone/75 [&_p+p]:mt-3">{intro}</div>}
          {children}
        </div>
        {image && (
          <div className="relative aspect-[16/10] lg:col-span-5 lg:aspect-auto">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              loading="eager"
              className="object-cover brightness-[0.82] contrast-[1.05] saturate-[0.85]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-stage lg:via-stage/10" />
          </div>
        )}
      </div>
    </section>
  );
}

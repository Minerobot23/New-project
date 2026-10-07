import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

type Props = {
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
};

/** Standard inner-page header: breadcrumbs, eyebrow, H1, intro, optional actions. */
export function PageHeader({ crumbs, eyebrow, title, intro, children }: Props) {
  return (
    <section className="border-b border-line">
      <Container className="max-w-7xl py-10 sm:py-14">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-3" : "mt-8"} max-w-4xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl`}>
          {title}
        </h1>
        {intro && <div className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">{intro}</div>}
        {children}
      </Container>
    </section>
  );
}

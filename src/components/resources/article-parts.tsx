import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, MonitorSmartphone, PhoneCall, ScanSearch } from "lucide-react";
import { CALL_PATH, CHECK_PATH } from "@/lib/site";

/** Small building blocks used inside article bodies. */

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="not-prose my-8 border border-line bg-surface p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Lightbulb aria-hidden="true" className="size-4 text-accent" />
        {title ?? "Worth knowing"}
      </p>
      <div className="mt-2 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </aside>
  );
}

const CTA_VARIANTS = {
  check: {
    icon: ScanSearch,
    title: "Want a second opinion on your website?",
    body: "Send it to us and we'll personally review it for design, mobile experience, customer journey, and conversion.",
    href: CHECK_PATH,
    label: "Get a Free Website Check",
  },
  call: {
    icon: PhoneCall,
    title: "Talk it through with us",
    body: "Tell us about your business and what you want your website to do. No pressure, no obligation.",
    href: CALL_PATH,
    label: "Request a Call",
  },
  simulator: {
    icon: MonitorSmartphone,
    title: "See what an immersive website feels like",
    body: "Walk into Maison Arden, an interactive restaurant concept: the entrance, the dining room, the menu, and private dining.",
    href: "/experiences/restaurant",
    label: "Enter the experience",
  },
} as const;

export function ArticleCta({ kind, href }: { kind: keyof typeof CTA_VARIANTS; href?: string }) {
  const cta = CTA_VARIANTS[kind];
  const Icon = cta.icon;
  return (
    <aside className="not-prose my-10 flex flex-col gap-4 border border-accent/25 bg-accent-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between" data-track-location="article-cta">
      <div className="flex gap-3.5">
        <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <p className="font-semibold text-ink">{cta.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{cta.body}</p>
        </div>
      </div>
      <Link
        href={href ?? cta.href}
        className="inline-flex shrink-0 items-center gap-1.5 bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
      >
        {cta.label}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </aside>
  );
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="not-prose my-6 space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
          <span aria-hidden="true" className="mt-[7px] size-3.5 shrink-0 rounded-[4px] border-2 border-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

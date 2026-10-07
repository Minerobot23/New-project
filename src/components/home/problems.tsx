import {
  CircleOff,
  Compass,
  FileText,
  Gauge,
  LayoutTemplate,
  MousePointerClick,
  Search,
  Smartphone,
  SquareMenu,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const problems: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: LayoutTemplate, title: "Outdated design", body: "First impressions happen in seconds. A dated site quietly suggests a dated business." },
  { icon: Smartphone, title: "Poor mobile experience", body: "Many customers will find you on a phone. Pinching and zooming sends them back to search results." },
  { icon: Gauge, title: "Slow pages", body: "Every extra second of loading is a chance for a visitor to give up." },
  { icon: Compass, title: "Confusing navigation", body: "When visitors can't find what they came for, they stop looking." },
  { icon: FileText, title: "PDF menus and price lists", body: "Downloads are slow, hard to read on a phone, and invisible to search engines." },
  { icon: CircleOff, title: "Missing quote, booking, or reservation paths", body: "If the next step isn't obvious, many visitors never take it." },
  { icon: MousePointerClick, title: "Weak calls-to-action", body: "\"Contact us\" at the bottom of a long page is easy to miss." },
  { icon: Search, title: "Poor search visibility", body: "Without the right structure, the people searching for you may find a competitor first." },
  { icon: SquareMenu, title: "Poorly organized services", body: "Customers search for a specific service, not a paragraph listing everything you do." },
  { icon: Star, title: "A site that undersells your reputation", body: "Great reviews and great work deserve a website that reflects them." },
];

export function Problems() {
  return (
    <section aria-labelledby="problems-title" className="py-20 sm:py-24">
      <Container className="max-w-7xl">
        <SectionHeading
          id="problems-title"
          eyebrow="The problem"
          title="Your Website Should Work as Hard as Your Business Does."
          intro={
            <p>
              Many excellent businesses have websites that don&apos;t reflect the quality of their work. The issues are usually
              familiar, and almost all of them are fixable.
            </p>
          }
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {problems.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-surface p-5">
              <Icon aria-hidden="true" className="size-5 text-accent" />
              <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

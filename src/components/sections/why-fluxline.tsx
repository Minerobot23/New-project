import { CircleDollarSign, LineChart, Puzzle, Target, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const principles: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Revenue-focused",
    body: "We focus on opportunities and business outcomes, not marketing vanity metrics.",
    icon: CircleDollarSign,
  },
  {
    title: "Works with your existing operation",
    body: "Fluxline is meant to complement your current CRM and sales process, not replace them.",
    icon: Puzzle,
  },
  {
    title: "Focused on existing demand",
    body: "We work on opportunities your company has already spent time and money creating.",
    icon: Target,
  },
  {
    title: "Measurable",
    body: "Every opportunity should be trackable from identification through outreach, response, appointment, and final outcome.",
    icon: LineChart,
  },
];

export function WhyFluxline() {
  return (
    <section id="why-fluxline" aria-labelledby="why-title" className="border-y border-line bg-surface py-20 sm:py-24">
      <Container>
        <SectionHeading id="why-title" eyebrow="Why Fluxline" title="Four principles behind how we work." />
        <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {principles.map(({ title, body, icon: Icon }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-accent">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

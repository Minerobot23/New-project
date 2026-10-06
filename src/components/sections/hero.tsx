import { Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

const inScope = [
  "Estimates you've already quoted",
  "Opportunities that never closed",
  "A structured, measurable follow-up process",
];

const outOfScope = ["Selling you more leads", "Replacing your CRM", "Generic marketing campaigns"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px)] bg-[size:72px_100%] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            Revenue recovery for home-service companies
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]"
          >
            Turn Unsold Estimates Into Revenue.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            You already paid to generate the lead. You already spent the time creating the estimate.
            Fluxline helps home-service companies identify and recover valuable opportunities that never
            made it across the finish line.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CALL_PATH} size="lg" withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href="/#how-it-works" size="lg" variant="secondary">
              See How It Works
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">
            No new leads. No CRM replacement. We focus on opportunities already in your pipeline.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(15,26,36,0.04),0_8px_24px_-12px_rgba(15,26,36,0.12)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">What we work on</p>
          <ul className="mt-4 space-y-3">
            {inScope.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] text-ink">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
          <div className="my-6 border-t border-dashed border-line-strong" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">What we don&apos;t do</p>
          <ul className="mt-4 space-y-3">
            {outOfScope.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] text-ink-soft">
                <Minus aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

import { ArrowDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const stages = [
  { label: "Lead generated", phase: "invested" },
  { label: "Appointment completed", phase: "invested" },
  { label: "Estimate created", phase: "invested" },
  { label: "Customer doesn't close right away", phase: "leak" },
  { label: "Follow-up becomes inconsistent", phase: "leak" },
  { label: "Opportunity goes cold", phase: "leak" },
] as const;

const investments = ["Acquisition cost", "Technician or estimator time", "Office and admin time", "Sales effort"];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="problem-title"
          eyebrow="The gap"
          title="Your pipeline may be worth more than you think."
          intro={
            <p>
              By the time an estimate exists, your company has already paid for it. Fluxline focuses on what
              happens after that estimate doesn&apos;t close right away.
            </p>
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <PhaseGroup
            title="Money and time already spent"
            tone="invested"
            items={stages.filter((stage) => stage.phase === "invested")}
            startIndex={0}
          />
          <PhaseGroup
            title="Where the value quietly leaks"
            tone="leak"
            items={stages.filter((stage) => stage.phase === "leak")}
            startIndex={3}
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-baseline sm:gap-8">
          <p className="shrink-0 text-sm font-semibold text-ink">Already invested in every estimate:</p>
          <ul className="flex flex-wrap gap-2">
            {investments.map((item) => (
              <li
                key={item}
                className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function PhaseGroup({
  title,
  tone,
  items,
  startIndex,
}: {
  title: string;
  tone: "invested" | "leak";
  items: ReadonlyArray<{ label: string }>;
  startIndex: number;
}) {
  const leak = tone === "leak";
  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 ${leak ? "border-amber-200/80 bg-amber-50/40" : "border-line bg-surface"}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${leak ? "text-amber-800" : "text-accent"}`}>
        {title}
      </p>
      <ol className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {items.map((item, index) => (
          <li key={item.label} className="flex flex-col items-stretch gap-2 sm:flex-1 sm:flex-row sm:items-center">
            <div
              className={`flex flex-1 items-start gap-3 rounded-lg border bg-surface px-4 py-3 sm:min-h-[92px] sm:flex-col sm:gap-2 ${
                leak ? "border-amber-200/80" : "border-line"
              }`}
            >
              <span className="font-mono text-xs text-muted">{String(startIndex + index + 1).padStart(2, "0")}</span>
              <span className={`text-sm font-medium leading-snug ${leak && index === items.length - 1 ? "text-amber-900" : "text-ink"}`}>
                {item.label}
              </span>
            </div>
            {index < items.length - 1 && (
              <>
                <ArrowDown aria-hidden="true" className="mx-auto size-4 shrink-0 text-line-strong sm:hidden" />
                <ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 text-line-strong sm:block" />
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

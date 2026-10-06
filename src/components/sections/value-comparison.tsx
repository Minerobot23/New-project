import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const traditional = [
  "Buy more leads",
  "Pay acquisition cost",
  "Dispatch an employee",
  "Create an estimate",
  "Hope it closes",
];

const fluxline = [
  "Use your existing pipeline",
  "Find overlooked opportunities",
  "Prioritize valuable estimates",
  "Re-engage systematically",
  "Measure outcomes",
];

export function ValueComparison() {
  return (
    <section aria-labelledby="value-title" className="bg-night py-20 text-white sm:py-28">
      <Container>
        <SectionHeading
          id="value-title"
          tone="dark"
          eyebrow="The financial logic"
          title="Before buying another lead, look at the ones you already paid for."
          intro={
            <p>
              You don&apos;t always need more leads. Sometimes you need to stop losing the ones you already paid for.
            </p>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Column title="Traditional growth" subtitle="Every new job starts from zero." items={traditional} variant="muted" />
          <Column
            title="With Fluxline"
            subtitle="Start from work you've already quoted."
            items={fluxline}
            variant="accent"
          />
        </div>
      </Container>
    </section>
  );
}

function Column({
  title,
  subtitle,
  items,
  variant,
}: {
  title: string;
  subtitle: string;
  items: string[];
  variant: "muted" | "accent";
}) {
  const accent = variant === "accent";
  return (
    <div
      className={`rounded-xl border p-6 sm:p-8 ${
        accent ? "border-emerald-400/30 bg-[#0f2a2a]" : "border-night-line bg-white/[0.02]"
      }`}
    >
      <h3 className={`text-sm font-semibold uppercase tracking-[0.14em] ${accent ? "text-emerald-300" : "text-slate-400"}`}>
        {title}
      </h3>
      <p className={`mt-2 text-sm ${accent ? "text-slate-200" : "text-slate-400"}`}>{subtitle}</p>
      <ol className="mt-6">
        {items.map((item, index) => (
          <li key={item} className="relative flex gap-4 pb-5 last:pb-0">
            {index < items.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px ${accent ? "bg-emerald-400/30" : "bg-night-line"}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                accent ? "border-emerald-400/50 text-emerald-300" : "border-slate-600 text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            <span className={`text-[15px] leading-6 ${accent ? "font-medium text-white" : "text-slate-300"}`}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

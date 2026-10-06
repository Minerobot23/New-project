import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const prioritizationFactors = [
  "Estimate value",
  "Estimate age",
  "Job type",
  "Current status",
  "Previous interaction",
  "Available context",
];

const steps = [
  {
    number: "01",
    title: "Identify",
    body: "Review your existing unsold estimates and separate genuine losses from opportunities that may still be viable.",
  },
  {
    number: "02",
    title: "Prioritize",
    body: "Focus attention on the opportunities most worth pursuing, based on factors like:",
    factors: prioritizationFactors,
  },
  {
    number: "03",
    title: "Recover",
    body: "Build and run a structured follow-up process designed to bring qualified opportunities back into the sales conversation.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-y border-line bg-surface py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="A simple process built around your existing pipeline."
          intro={<p>Three steps. No new lead sources, and no change to the system your team already uses.</p>}
        />

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col bg-surface p-6 sm:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-medium text-accent">{step.number}</span>
                <h3 className="text-lg font-semibold uppercase tracking-[0.08em] text-ink">{step.title}</h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
              {step.factors && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {step.factors.map((factor) => (
                    <li key={factor} className="rounded border border-line bg-sunken px-2 py-1 text-xs font-medium text-ink-soft">
                      {factor}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-muted">
          Results depend on your pipeline and your market. We don&apos;t promise a specific amount of recovered
          revenue; we work to systematically identify and pursue the opportunities that are still viable.
        </p>
      </Container>
    </section>
  );
}

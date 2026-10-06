import { Lock } from "lucide-react";
import { Container } from "@/components/ui/container";

const commitments = [
  "Used only for the agreed business purpose",
  "Access limited to what's necessary",
  "Never sold",
  "Not retained longer than needed",
];

export function DataHandling() {
  return (
    <section aria-labelledby="data-title" className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 rounded-xl border border-line bg-sunken p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
          <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink">
              <Lock aria-hidden="true" className="size-[18px]" />
            </span>
            <div>
              <h2 id="data-title" className="text-xl font-semibold tracking-tight text-ink">
                How we treat your data
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Your customer and estimate information belongs to you. We believe it should be:
              </p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {commitments.map((item) => (
              <li key={item} className="rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

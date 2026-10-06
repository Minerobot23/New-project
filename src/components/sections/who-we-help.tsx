import { Check, Droplet, Hammer, House, Snowflake, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const industries: { name: string; icon: LucideIcon }[] = [
  { name: "HVAC", icon: Snowflake },
  { name: "Plumbing", icon: Droplet },
  { name: "Roofing", icon: House },
  { name: "Electrical", icon: Zap },
  { name: "Remodeling", icon: Hammer },
  { name: "Other high-ticket home services", icon: Wrench },
];

const fitSignals = [
  "Generate meaningful estimate volume",
  "Have multiple technicians or estimators",
  "Sell higher-ticket services",
  "Keep historical estimate and customer data",
  "Have estimates that don't get consistent long-term follow-up",
];

export function WhoWeHelp() {
  return (
    <section id="who-we-help" aria-labelledby="who-title" className="py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="who-title"
            eyebrow="Who we help"
            title="Built for home-service companies that quote real work."
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {industries.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <span className="text-sm font-medium leading-snug text-ink">{name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-sunken p-6 sm:p-8 lg:mt-14">
          <h3 className="text-base font-semibold text-ink">Fluxline is usually most useful for businesses that:</h3>
          <ul className="mt-5 space-y-3.5">
            {fitSignals.map((signal) => (
              <li key={signal} className="flex gap-3 text-[15px] leading-snug text-ink-soft">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                {signal}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line-strong/60 pt-5 text-sm text-muted">
            Not sure if that&apos;s you? That&apos;s what the first conversation is for.
          </p>
        </div>
      </Container>
    </section>
  );
}

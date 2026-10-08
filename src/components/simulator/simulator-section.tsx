import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";
import { WebsiteSimulator } from "./simulator";
import type { IndustryId } from "./types";

type Props = {
  id?: string;
  industries?: IndustryId[];
  title?: string;
  intro?: string;
  note?: string;
};

/** Simulator plus the sales CTA that should always follow it. */
export function SimulatorSection({
  id = "simulator",
  industries,
  title = "See what a better website feels like.",
  intro = "Don't just take our word for it. Explore how thoughtful design changes the way customers experience a business online.",
  note,
}: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-ink bg-surface" data-track-location="simulator">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="text-sm font-medium text-accent">Interactive Concept Demo</p>
            <h2 id={`${id}-title`} className="display-tight mt-4 max-w-[20ch] text-balance text-[2.25rem] sm:text-[3.25rem]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:self-end">
            <p className="max-w-[46ch] text-pretty text-lg leading-relaxed text-ink-soft">{intro}</p>
            {note && <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted">{note}</p>}
          </div>
        </div>
        <div className="mt-12">
          <WebsiteSimulator industries={industries} />
        </div>

        <div className="mt-14 flex flex-col gap-6 bg-ink p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h3 className="display-tight text-balance text-2xl sm:text-3xl">Imagine this difference for your business.</h3>
            <p className="mt-3 text-white/70">Send us your current website and we&apos;ll show you what we&apos;d improve.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CHECK_PATH} size="lg" variant="inverse" withArrow>
              {CHECK_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href={CALL_PATH} size="lg" variant="ghost-inverse">
              {CALL_CTA_LABEL}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

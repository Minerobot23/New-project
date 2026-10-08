import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <section id={id} aria-labelledby={`${id}-title`} className="py-24 sm:py-32" data-track-location="simulator">
      <Container className="max-w-7xl">
        <SectionHeading id={`${id}-title`} eyebrow="Interactive Concept Demo" title={title} intro={<p>{intro}</p>} />
        {note && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{note}</p>}
        <div className="mt-12">
          <WebsiteSimulator industries={industries} />
        </div>

        <div className="grain reveal relative mt-14 flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-night p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_90%_at_100%_0%,rgba(47,124,255,0.22),transparent_70%)]"
          />
          <div className="relative max-w-xl">
            <h3 className="text-balance text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">Imagine this difference for your business.</h3>
            <p className="mt-3 text-slate-300">Send us your current website and we&apos;ll show you what we&apos;d improve.</p>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CHECK_PATH} size="lg" variant="inverse" withArrow>
              {CHECK_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href={CALL_PATH} size="lg" variant="ghost-inverse">
              {CALL_CTA_LABEL}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

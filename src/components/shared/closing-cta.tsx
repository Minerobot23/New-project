import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";

export function ClosingCta({
  title = "Your business deserves a website as good as the business behind it.",
  body = "Tell us about your business. We'll talk through what a better website could do for you, with no pressure and no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className="grain relative overflow-hidden bg-night pb-20 pt-24 text-white sm:pb-24 sm:pt-32"
      data-track-location="closing-cta"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_80%_at_0%_0%,rgba(47,124,255,0.2),transparent_70%)]"
      />
      <Container className="relative flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 id="closing-cta-title" className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[3.25rem]">
            {title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-slate-300">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALL_PATH} size="lg" variant="inverse" withArrow className="w-full sm:w-auto">
            {CALL_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href={CHECK_PATH} size="lg" variant="ghost-inverse" className="w-full sm:w-auto">
            {CHECK_CTA_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

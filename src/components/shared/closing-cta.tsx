import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_PATH } from "@/lib/site";

export function ClosingCta({
  title = "Your business deserves a website as good as the business behind it.",
  body = "Tell us about your business. We'll talk through what a better website could do for you, with no pressure and no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="closing-cta-title" className="bg-night py-20 text-white sm:py-24" data-track-location="closing-cta">
      <Container className="flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="closing-cta-title" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={CALL_PATH} size="lg" variant="inverse" withArrow className="w-full sm:w-auto">
            {CALL_CTA_LABEL}
          </ButtonLink>
          <ButtonLink href={CHECK_PATH} size="lg" variant="ghost-inverse" className="w-full sm:w-auto">
            Free Website Check
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

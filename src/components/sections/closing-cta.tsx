import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="bg-night py-20 text-white sm:py-24">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            How much quoted work is sitting in your pipeline?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Let&apos;s spend 15 minutes looking at how your company currently handles estimates that don&apos;t close.
          </p>
        </div>
        <ButtonLink href={CALL_PATH} size="lg" variant="inverse" withArrow className="w-full sm:w-auto">
          {CALL_CTA_LABEL}
        </ButtonLink>
      </Container>
    </section>
  );
}

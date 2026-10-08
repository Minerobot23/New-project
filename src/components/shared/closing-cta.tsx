import { ButtonLink } from "@/components/ui/button-link";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_CTA_LABEL, CHECK_PATH, site } from "@/lib/site";

export function ClosingCta({
  title = "Your business deserves a website as good as the business behind it.",
  body = "Tell us about your business. We'll talk through what a better website could do for you, with no pressure and no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="closing-cta-title" className="bg-night text-white" data-track-location="closing-cta">
      <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <h2 id="closing-cta-title" className="display max-w-[16ch] text-balance text-[2.5rem] sm:text-[clamp(3rem,6vw,5.75rem)]">
          {title}
        </h2>
        <div className="mt-12 grid gap-10 border-t border-white/25 pt-8 lg:grid-cols-12">
          <p className="max-w-[50ch] text-lg leading-relaxed text-white/70 lg:col-span-6">{body}</p>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end">
            <ButtonLink href={CALL_PATH} size="lg" variant="inverse" withArrow className="w-full sm:w-auto">
              {CALL_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href={CHECK_PATH} size="lg" variant="ghost-inverse" className="w-full sm:w-auto">
              {CHECK_CTA_LABEL}
            </ButtonLink>
          </div>
        </div>
        <p className="mt-10 text-sm text-white/55">
          Or email {site.contact.name} directly:{" "}
          <a href={`mailto:${site.contact.email}`} className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            {site.contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}

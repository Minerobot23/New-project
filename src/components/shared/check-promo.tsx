import { ButtonLink } from "@/components/ui/button-link";
import { CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";

/** Compact Website Check offer used on content and industry pages. */
export function CheckPromo({ title = "Not sure what your website needs?" }: { title?: string }) {
  return (
    <div
      className="flex flex-col gap-6 border border-ink bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      data-track-location="check-promo"
    >
      <div>
        <p className="display-tight text-xl text-ink sm:text-2xl">{title}</p>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
          Send us your website. We&apos;ll review it personally and tell you what we&apos;d improve, at no cost.
        </p>
      </div>
      <ButtonLink href={CHECK_PATH} variant="secondary" className="shrink-0" withArrow>
        {CHECK_CTA_LABEL}
      </ButtonLink>
    </div>
  );
}

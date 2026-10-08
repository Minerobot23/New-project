import { ScanSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";

/** Compact Website Check offer used on content and industry pages. */
export function CheckPromo({ title = "Not sure what your website needs?" }: { title?: string }) {
  return (
    <div className="bezel" data-track-location="check-promo">
      <div className="flex flex-col gap-5 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <ScanSearch aria-hidden="true" strokeWidth={1.5} className="size-5" />
        </span>
        <div>
          <p className="text-lg font-semibold tracking-tight text-ink">{title}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
            Send us your website. We&apos;ll review it personally and tell you what we&apos;d improve, at no cost.
          </p>
        </div>
      </div>
      <ButtonLink href={CHECK_PATH} variant="secondary" className="shrink-0" withArrow>
        {CHECK_CTA_LABEL}
      </ButtonLink>
      </div>
    </div>
  );
}

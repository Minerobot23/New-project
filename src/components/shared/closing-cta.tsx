import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { ORDER_CTA_LABEL, ORDER_PATH, site } from "@/lib/site";

export function ClosingCta({
  title = "Your business deserves a website as good as the business behind it.",
  body = "Choose a package, pay the deposit online, and we start on your website. Every price is listed up front, and you review the full scope and agreement before paying.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="closing-cta-title" data-tone="dark" className="bg-stage text-bone" data-track-location="closing-cta">
      <div className="mx-auto max-w-[90rem] px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <h2 id="closing-cta-title" className="display max-w-[18ch] text-balance text-[2.4rem] uppercase sm:text-[clamp(3rem,6vw,5.75rem)]">
          {title}
        </h2>
        <div className="mt-12 grid gap-10 border-t border-bone/25 pt-8 lg:grid-cols-12">
          <p className="max-w-[50ch] text-lg leading-relaxed text-bone/70 lg:col-span-6">{body}</p>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end">
            <ButtonLink href={ORDER_PATH} size="lg" variant="inverse" withArrow className="w-full sm:w-auto">
              {ORDER_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href="/experiences" size="lg" variant="ghost-inverse" className="w-full sm:w-auto">
              Explore the demos
            </ButtonLink>
          </div>
        </div>
        <p className="mt-10 text-sm text-bone/55">
          Questions first? Email {site.contact.name}:{" "}
          <a href={`mailto:${site.contact.email}`} className="text-bone underline decoration-bone/40 underline-offset-4 hover:decoration-bone">
            {site.contact.email}
          </a>
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          <Link href="/website-check" className="text-bone/80 underline decoration-bone/30 underline-offset-4 hover:text-bone">
            or get a free website check
          </Link>
        </p>
      </div>
    </section>
  );
}

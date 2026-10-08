import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { BeforeAfter } from "@/components/home/before-after";
import { SHOWCASE } from "@/lib/images";
import { CALL_CTA_LABEL, CALL_PATH, site } from "@/lib/site";

const lines = ["Websites built", "to turn visitors", "into customers."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" data-track-location="hero">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 pt-8 text-sm text-ink-soft sm:pt-10">
          <p>Web design for local businesses</p>
          <p>Long Island, Queens, and beyond</p>
        </div>

        <h1 id="hero-title" className="display mt-8 text-[2.6rem] text-ink sm:mt-12 sm:text-[clamp(3.5rem,7.6vw,7.4rem)]">
          {lines.map((line, index) => (
            <span key={line} className="line-mask">
              <span style={{ "--i": index } as CSSProperties}>
                {index === lines.length - 1 ? (
                  <>
                    into <span className="text-accent">customers.</span>
                  </>
                ) : (
                  `${line} `
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="fade-late mt-10 grid gap-10 border-t border-ink pb-20 pt-8 sm:mt-14 lg:grid-cols-12 lg:gap-8 lg:pb-28">
          <div className="lg:col-span-4 lg:pr-6">
            <p className="max-w-[40ch] text-pretty text-lg leading-relaxed text-ink-soft">
              {site.name} designs fast, modern websites for businesses that want more calls, bookings, reservations, and
              customers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={CALL_PATH} size="lg" withArrow>
                {CALL_CTA_LABEL}
              </ButtonLink>
              <ButtonLink href="/#simulator" size="lg" variant="secondary">
                See the Difference
              </ButtonLink>
            </div>
            <p className="mt-10 text-sm leading-relaxed text-muted">
              Questions first? Email {site.contact.name.split(" ")[0]} at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </div>

          <div className="lg:col-span-8">
            <BeforeAfter
              before={SHOWCASE.home.before}
              after={SHOWCASE.home.desktop}
              label="North Shore Heating & Cooling homepage"
              url="northshore-hvac.demo"
            />
            <p className="mt-3 text-sm text-muted">
              Drag to compare. North Shore Heating &amp; Cooling is a fictional HVAC company, one of four Interactive Concept
              Demos below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

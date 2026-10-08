import type { CSSProperties } from "react";
import { CalendarCheck, MapPin, MessageSquareText, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { DeviceShowcase } from "@/components/shared/device-showcase";
import { SHOWCASE } from "@/lib/images";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

const outcomes = [
  { icon: Phone, label: "Calls" },
  { icon: MessageSquareText, label: "Quote requests" },
  { icon: CalendarCheck, label: "Appointments" },
  { icon: UtensilsCrossed, label: "Reservations" },
  { icon: ShoppingBag, label: "Orders" },
  { icon: MapPin, label: "Store visits" },
];

export function Hero() {
  return (
    <>
      {/* Pulled up under the floating header so the dark hero runs to the top of the page. */}
      <section
        aria-labelledby="hero-title"
        className="grain relative -mt-[76px] overflow-hidden bg-night text-white"
        data-track-location="hero"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_82%_35%,rgba(47,124,255,0.24),transparent_70%),radial-gradient(35%_45%_at_5%_100%,rgba(47,124,255,0.10),transparent_70%)]"
        />
        <Container className="relative grid max-w-7xl gap-14 pb-20 pt-[calc(76px+3.5rem)] sm:pb-24 sm:pt-[calc(76px+4.5rem)] lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-12 lg:pb-28 lg:pt-[calc(76px+5rem)]">
          <div>
            <p className="rise inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70 ring-1 ring-white/15">
              Web design for local businesses
            </p>
            <h1
              id="hero-title"
              style={{ "--i": 1 } as CSSProperties}
              className="rise mt-6 text-balance text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]"
            >
              Websites built to turn visitors into <span className="text-accent-on-night">customers.</span>
            </h1>
            <p
              style={{ "--i": 2 } as CSSProperties}
              className="rise mt-6 max-w-[44ch] text-pretty text-lg leading-relaxed text-white/70"
            >
              Fast, modern websites for businesses that want more calls, bookings, reservations, and customers.
            </p>
            <div style={{ "--i": 3 } as CSSProperties} className="rise mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={CALL_PATH} size="lg" withArrow>
                {CALL_CTA_LABEL}
              </ButtonLink>
              <ButtonLink href="/#simulator" size="lg" variant="ghost-inverse">
                See the Difference
              </ButtonLink>
            </div>
          </div>

          <figure style={{ "--i": 3 } as CSSProperties} className="rise relative">
            <DeviceShowcase
              desktop={SHOWCASE.restaurant.desktop}
              mobile={SHOWCASE.home.mobile}
              alt="Redesigned concept websites: an Italian restaurant homepage on a laptop and an HVAC company homepage on a phone"
              eager
            />
            <figcaption className="mt-5 text-center text-xs text-white/45 lg:text-right">
              Interactive Concept Demos for fictional businesses.
            </figcaption>
          </figure>
        </Container>
      </section>

      <section aria-label="What a Fluxline website is built around" className="border-b border-line bg-surface">
        <Container className="flex max-w-7xl flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-sm font-medium text-ink">Every page built around the next step:</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {outcomes.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4 text-accent" />
                {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

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
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-night text-white" data-track-location="hero">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_30%,rgba(47,124,255,0.28),transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(47,124,255,0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_100%] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />
      <Container className="relative grid max-w-7xl gap-12 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2f7cff]" />
            Websites · Design · Growth
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4rem]"
          >
            Websites Built to Turn Visitors Into <span className="text-[#6ea8ff]">Customers.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75">
            Fluxline Solutions designs fast, modern websites for businesses that want to look better online and turn more visitors
            into calls, reservations, appointments, and customers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CALL_PATH} size="lg" withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href="/#simulator" size="lg" variant="ghost-inverse">
              See the Difference
            </ButtonLink>
          </div>
          <ul aria-label="Built around the next step" className="mt-10 flex flex-wrap gap-2">
            {outcomes.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/80"
              >
                <Icon aria-hidden="true" className="size-3.5 text-[#6ea8ff]" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <DeviceShowcase
            desktop={SHOWCASE.restaurant.desktop}
            mobile={SHOWCASE.home.mobile}
            alt="Redesigned concept websites: an Italian restaurant homepage on a laptop and an HVAC company homepage on a phone"
            eager
          />
          <p className="mt-4 text-center text-xs text-white/50 lg:text-right">
            Interactive Concept Demos for fictional businesses. Explore them below.
          </p>
        </div>
      </Container>
    </section>
  );
}

import { CalendarCheck, MapPin, MessageSquareText, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
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
    <section aria-labelledby="hero-title" className="relative overflow-hidden" data-track-location="hero">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px)] bg-[size:72px_100%] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <Container className="relative grid max-w-7xl gap-12 py-16 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            Web design &amp; development for businesses
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]"
          >
            Websites Built to Turn Visitors Into Customers.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            Fluxline Solutions designs fast, modern websites for businesses that want to look better online and turn more visitors
            into calls, reservations, appointments, and customers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={CALL_PATH} size="lg" withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
            <ButtonLink href="/#simulator" size="lg" variant="secondary">
              See the Difference
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">Modern design. Mobile-first. Built around your business.</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(15,26,36,0.04),0_12px_32px_-16px_rgba(15,26,36,0.16)] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Every page is built around a next step</p>
          <ul className="mt-5 grid grid-cols-2 gap-2.5">
            {outcomes.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-3 text-sm font-medium text-ink">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
            Your business deserves a website as good as the business behind it.
          </p>
        </div>
      </Container>
    </section>
  );
}

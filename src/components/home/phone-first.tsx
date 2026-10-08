import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PHOTOS } from "@/lib/images";
import { CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";

const points = [
  "Your phone number, booking, or quote button is one tap away on every page",
  "Services, menus, and prices read clearly on a small screen, with no PDFs",
  "Hours, location, and directions are easy to find without digging",
];

export function PhoneFirst() {
  return (
    <section aria-labelledby="phone-first-title" className="overflow-hidden py-24 sm:py-32">
      <Container className="grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        {/* Photo sits in a double-bezel tray, tilted slightly off the grid on large screens. */}
        <div className="reveal bezel lg:-rotate-1">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={PHOTOS.ownerPhone.src}
              alt={PHOTOS.ownerPhone.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
        <div className="reveal">
          <h2 id="phone-first-title" className="text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem]">
            For many customers, the first impression happens on a phone.
          </h2>
          <p className="mt-5 max-w-[52ch] text-pretty text-lg leading-relaxed text-ink-soft">
            We design every page for the small screen first, so a customer can go from finding you to contacting you in a few
            taps.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <Check aria-hidden="true" strokeWidth={2.5} className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <ButtonLink href={CHECK_PATH} size="lg" variant="secondary" className="mt-10" withArrow>
            {CHECK_CTA_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

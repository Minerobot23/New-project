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
    <section aria-labelledby="phone-first-title" className="bg-night text-white">
      <Container className="grid max-w-7xl gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Image
            src={PHOTOS.ownerPhone.src}
            alt={PHOTOS.ownerPhone.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            placeholder="blur"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6ea8ff]">Mobile-first</p>
          <h2 id="phone-first-title" className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            For many customers, your website is the first impression, and it happens on a phone.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-white/75">
            We design every page for the small screen first, so a customer can go from finding you to contacting you in a few
            taps.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#6ea8ff]" />
                {point}
              </li>
            ))}
          </ul>
          <ButtonLink href={CHECK_PATH} size="lg" variant="inverse" className="mt-9" withArrow>
            {CHECK_CTA_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

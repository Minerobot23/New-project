import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { SHOWCASE } from "@/lib/images";
import { CHECK_CTA_LABEL, CHECK_PATH } from "@/lib/site";
import type { IndustryId } from "@/components/simulator/types";

const points = [
  "Your phone number, booking, or quote button is one tap away on every page",
  "Services, menus, and prices read clearly on a small screen, with no PDFs",
  "Hours, location, and directions are easy to find without digging",
];

const phones: IndustryId[] = ["home", "restaurant", "salon", "auto"];
/* Staggered heights so the row reads as a set of objects, not a grid. */
const offsets = ["lg:translate-y-10", "lg:-translate-y-4", "lg:translate-y-16", "lg:translate-y-0"];

export function PhoneFirst() {
  return (
    <section aria-labelledby="phone-first-title" className="overflow-hidden bg-accent text-white">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="phone-first-title" className="display-tight text-balance text-[2.25rem] sm:text-[3.25rem]">
            For many customers, the first impression happens on a phone.
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-white/80">
            We design every page for the small screen first, so a customer can go from finding you to contacting you in a few
            taps.
          </p>
          <ul className="mt-8 border-t border-white/30">
            {points.map((point) => (
              <li key={point} className="border-b border-white/30 py-4 text-[15px] leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
          <ButtonLink href={CHECK_PATH} size="lg" variant="inverse" className="mt-10" withArrow>
            {CHECK_CTA_LABEL}
          </ButtonLink>
        </div>

        <figure className="lg:col-span-7 lg:pl-8">
          <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-16">
            {phones.map((id, index) => (
              <li key={id} className={`w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-auto ${offsets[index]}`}>
                <div className="rounded-[1.6rem] bg-ink p-[5px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                  <div className="relative aspect-[640/1282] overflow-hidden rounded-[1.3rem] bg-white">
                    <Image
                      src={SHOWCASE[id].mobile}
                      alt={`${SHOWCASE[id].name} concept homepage on a phone`}
                      fill
                      sizes="(min-width: 1024px) 14vw, 46vw"
                      placeholder="blur"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/75">{SHOWCASE[id].name}</p>
              </li>
            ))}
          </ul>
          <figcaption className="text-sm text-white/75">Interactive Concept Demos for fictional businesses, as they look on a phone.</figcaption>
        </figure>
      </div>
    </section>
  );
}

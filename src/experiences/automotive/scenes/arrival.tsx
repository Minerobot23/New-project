"use client";

import { HeroFilm } from "@/experience";
import { ARRIVAL_FILM } from "../assets";
import { SHOP } from "../content";
import { useAuto } from "../context";

/**
 * The arrival film, from the driver's seat: the roller door lifts as the shop lights come on and
 * the car rolls into the bay. It plays once by itself; "Pull in" skips straight to the bay, and
 * the navigation works the whole time.
 */
export function Arrival() {
  const { go } = useAuto();

  return (
    <HeroFilm
      {...ARRIVAL_FILM}
      label="Driving up to a workshop at night as its roller door lifts, then into the lit service bay"
      skipLabel="Pull in"
      onFinished={() => go("bay")}
    >
      {({ progress }) => (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#050608]/80 to-transparent px-5 pb-24 pt-24 text-bone transition-opacity duration-1000 sm:px-8 sm:pt-28 ${
            progress > 0.6 ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="label text-[#ff4b3a]">{SHOP.kicker}</p>
          <h1
            data-scene-focus
            tabIndex={-1}
            className="condensed mt-3 text-[4.2rem] outline-none sm:text-[clamp(5rem,10vw,9.5rem)]"
          >
            {SHOP.name}
          </h1>
          <p className="mt-3 text-sm text-bone/65">{SHOP.hours}</p>
        </div>
      )}
    </HeroFilm>
  );
}

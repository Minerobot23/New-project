"use client";

import { HeroFilm } from "@/experience";
import { ARRIVAL_FILM } from "../assets";
import { COMPANY } from "../content";

/**
 * The arrival film: up the street at dusk while the lights in the house come on, settling on the
 * whole house. It plays once by itself and can be paused or skipped; the navigation works the
 * whole time. `held` says the film ended on the frame the house scene opens on.
 */
export function Arrival({ onEntered }: { onEntered: (held: boolean) => void }) {
  return (
    <HeroFilm
      {...ARRIVAL_FILM}
      label="A slow approach up the street to a two-storey house at dusk as its lights come on"
      onFinished={({ held }) => onEntered(held)}
    >
      {({ progress }) => (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#060b17]/75 to-transparent px-5 pb-24 pt-24 text-bone transition-opacity duration-1000 sm:px-8 sm:pt-28 ${
            progress > 0.86 ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="label text-[#f2b45c]">{COMPANY.kicker}</p>
          <h1
            data-scene-focus
            tabIndex={-1}
            className="mt-4 max-w-[13ch] font-display text-[2.6rem] font-light uppercase leading-[0.95] tracking-[-0.02em] outline-none [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] sm:text-[clamp(3.25rem,5.4vw,5.5rem)]"
          >
            {COMPANY.name}
          </h1>
        </div>
      )}
    </HeroFilm>
  );
}

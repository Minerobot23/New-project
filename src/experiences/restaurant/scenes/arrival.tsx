"use client";

import { HeroFilm } from "@/experience";
import { ARRIVAL_FILM } from "../assets";
import { RESTAURANT } from "../content";

/**
 * The arrival film: the street, the walk to the door, and through it into the dining room. It
 * plays once by itself and can be paused or skipped; the menu, reservations, and the rest of the
 * navigation are available the whole time. `held` says the film ended on the frame the dining
 * room opens on.
 */
export function Arrival({ onEntered }: { onEntered: (held: boolean) => void }) {
  return (
    <HeroFilm
      {...ARRIVAL_FILM}
      label="A walk from the street, through the front door, into the Maison Arden dining room"
      onFinished={({ held }) => onEntered(held)}
    >
      {({ progress }) => (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-stage/70 to-transparent px-5 pb-24 pt-[14vh] text-center text-bone transition-opacity duration-1000 sm:pt-[11vh] ${
            progress > 0.86 ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="label text-bone/70">{RESTAURANT.kicker}</p>
          <h1
            data-scene-focus
            tabIndex={-1}
            className="mt-4 font-serif text-[3.25rem] font-normal leading-none outline-none sm:text-[clamp(3.5rem,6vw,5.75rem)]"
          >
            {RESTAURANT.name}
          </h1>
          <p className="mt-4 font-serif text-lg italic text-bone/75">Dinner nightly from five</p>
        </div>
      )}
    </HeroFilm>
  );
}

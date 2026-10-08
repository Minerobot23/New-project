"use client";

import { CoverStage, Hotspot, useReducedMotion } from "@/experience";
import { ASSETS } from "../assets";
import { RESTAURANT } from "../content";
import { useRestaurant } from "../context";

/**
 * Scene 04: inside. The room is the interface; each hotspot sits on the real object it leads to.
 * The backdrop is the last frame of the arrival film, so the film hands over without a jump.
 * Positions are fractions of that frame, so they follow the crop on any screen.
 */
export function Interior() {
  const { go } = useRestaurant();
  const reduced = useReducedMotion();

  return (
    <>
      <CoverStage
        image={ASSETS.arrivalEnd}
        imageClassName="film-frame"
        parallax
        pan
        grade={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_45%,rgba(8,7,6,0.55)_100%)]"
          />
        }
      >
        <Hotspot at={{ x: 0.2, y: 0.51 }} label="Menu" hint="Tonight's menu" onSelect={(o) => go("menu", o)} index={0} />
        <Hotspot
          at={{ x: 0.826, y: 0.43 }}
          label="Gallery"
          hint="The room by night"
          onSelect={(o) => go("gallery", o)}
          align="left"
          index={1}
        />
        <Hotspot at={{ x: 0.4, y: 0.37 }} label="The bar" hint="Cocktails and wine" onSelect={(o) => go("bar", o)} index={2} />
        <Hotspot
          at={{ x: 0.735, y: 0.345 }}
          label="Find us"
          hint="Hours and directions"
          onSelect={(o) => go("visit", o)}
          align="left"
          index={3}
        />
        <Hotspot
          at={{ x: 0.17, y: 0.215 }}
          label="Private dining"
          hint="Through here: the Salon"
          onSelect={(o) => go("private", o)}
          index={4}
        />
        <Hotspot
          at={{ x: 0.695, y: 0.61 }}
          label="Reserve"
          hint="Book this table"
          onSelect={(o) => go("reserve", o)}
          align="left"
          index={5}
        />
        <Hotspot
          at={{ x: 0.57, y: 0.525 }}
          label="Tonight's plate"
          hint="From the kitchen"
          onSelect={(o) => go("dish", o)}
          index={6}
        />
      </CoverStage>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-24 text-bone sm:px-8 md:pb-28">
        <h2
          data-scene-focus
          tabIndex={-1}
          className="arrive-in max-w-md font-serif text-[2.25rem] italic leading-[1.05] outline-none [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl"
        >
          {RESTAURANT.welcome}
        </h2>
        <p className="arrive-in mt-3 hidden text-sm text-bone/70 [animation-delay:300ms] md:block">
          Select a light in the room, or use the menu below.
        </p>
        <p className="arrive-in mt-3 text-sm text-bone/70 [animation-delay:300ms] md:hidden">Drag to look around. Tap a light.</p>
        {!reduced && (
          <button
            type="button"
            onClick={() => go("arrival")}
            className="label pointer-events-auto mt-4 inline-flex min-h-11 items-center text-bone/80 underline decoration-bone/40 underline-offset-4 hover:text-bone hover:decoration-bone"
          >
            Replay the arrival film
          </button>
        )}
      </div>
    </>
  );
}

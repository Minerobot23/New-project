"use client";

import { CoverStage, Hotspot } from "@/experience";
import { ASSETS } from "../assets";
import { RESTAURANT } from "../content";
import { useRestaurant } from "../context";

/**
 * Scene 04: inside. The room is the interface; each hotspot sits on the real object it leads to.
 * Positions are fractions of the photograph, so they follow the crop on any screen.
 */
export function Interior() {
  const { go } = useRestaurant();

  return (
    <>
      <CoverStage
        image={ASSETS.mainRoom}
        drift
        parallax
        pan
        grade={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_45%,rgba(8,7,6,0.55)_100%)]"
          />
        }
      >
        <Hotspot at={{ x: 0.13, y: 0.27 }} label="Menu" hint="Tonight's menu" onSelect={(o) => go("menu", o)} index={0} />
        <Hotspot
          at={{ x: 0.42, y: 0.17 }}
          label="Gallery"
          hint="The room by night"
          onSelect={(o) => go("gallery", o)}
          index={1}
        />
        <Hotspot
          at={{ x: 0.81, y: 0.44 }}
          label="The bar"
          hint="Cocktails and wine"
          onSelect={(o) => go("bar", o)}
          align="left"
          index={2}
        />
        <Hotspot
          at={{ x: 0.93, y: 0.33 }}
          label="Find us"
          hint="Hours and directions"
          onSelect={(o) => go("visit", o)}
          align="left"
          index={3}
        />
        <Hotspot
          at={{ x: 0.06, y: 0.53 }}
          label="Private dining"
          hint="Through here: the Salon"
          onSelect={(o) => go("private", o)}
          index={4}
        />
        <Hotspot at={{ x: 0.55, y: 0.74 }} label="Reserve" hint="Book this table" onSelect={(o) => go("reserve", o)} index={5} />
        <Hotspot
          at={{ x: 0.9, y: 0.71 }}
          label="Tonight's plate"
          hint="From the kitchen"
          onSelect={(o) => go("dish", o)}
          align="left"
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
      </div>
    </>
  );
}

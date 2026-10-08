"use client";

import { CoverStage, Hotspot, useReducedMotion } from "@/experience";
import { ASSETS } from "../assets";
import { AREAS, COMPANY } from "../content";
import { useHome } from "../context";

/**
 * The house is the interface: every part of the home is a way in. The backdrop is the last frame
 * of the arrival film (where the lights have come on), so the film hands over without a jump.
 */
export function House() {
  const { go } = useHome();
  const reduced = useReducedMotion();

  return (
    <>
      <CoverStage
        image={ASSETS.house}
        parallax
        pan
        grade={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_50%,rgba(4,8,16,0.6)_100%)]"
          />
        }
      >
        {AREAS.map((area, index) => (
          <Hotspot
            key={area.id}
            at={area.at}
            label={area.title}
            align={area.align}
            index={index}
            onSelect={(origin) => go(area.id, origin)}
          />
        ))}
      </CoverStage>

      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#060b17]/70 to-transparent px-5 pb-16 pt-24 text-bone sm:px-8 sm:pt-28">
        <p className="label arrive-in text-[#f2b45c]">{COMPANY.name}</p>
        <h1
          data-scene-focus
          tabIndex={-1}
          className="arrive-in mt-4 max-w-[13ch] font-display text-[2.6rem] font-light uppercase leading-[0.95] tracking-[-0.02em] outline-none [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] sm:text-[clamp(3.25rem,5.4vw,5.5rem)]"
        >
          What do you want to transform?
        </h1>
        <p className="arrive-in mt-5 hidden max-w-sm text-[15px] leading-relaxed text-bone/75 [animation-delay:300ms] md:block">
          Select any part of the house: the roof, the siding, the windows, or step inside.
        </p>
        <p className="arrive-in mt-4 text-sm text-bone/70 [animation-delay:300ms] md:hidden">Drag to look around. Tap a light on the house.</p>
        {!reduced && (
          <button
            type="button"
            onClick={() => go("arrival")}
            className="label pointer-events-auto mt-3 inline-flex min-h-11 items-center text-bone/80 underline decoration-bone/40 underline-offset-4 hover:text-bone hover:decoration-bone"
          >
            Replay the arrival film
          </button>
        )}
      </div>
    </>
  );
}

"use client";

import { CoverStage, Hotspot, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { SERVICES } from "../content";
import { useAuto } from "../context";

/** The vehicle is the interface: every service starts from the part of the car it touches. */
export function Bay() {
  const { go } = useAuto();
  return (
    <>
      <CoverStage
        image={ASSETS.vehicle}
        drift
        parallax
        pan
        grade={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(110%_90%_at_65%_55%,transparent_40%,rgba(3,4,6,0.7)_100%)]"
          />
        }
      >
        {SERVICES.map((service, index) => (
          <Hotspot
            key={service.id}
            at={service.at}
            label={service.title}
            align={service.align}
            index={index}
            onSelect={(origin) => go(service.id, origin)}
          />
        ))}
      </CoverStage>
      <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-24 text-bone sm:px-8 sm:pt-28">
        <p className="label arrive-in text-[#ff4b3a]">Bay 2</p>
        <h2
          data-scene-focus
          tabIndex={-1}
          className="condensed arrive-in mt-3 max-w-[11ch] text-[3.4rem] outline-none sm:text-[clamp(4rem,7vw,7rem)]"
        >
          What does your car need?
        </h2>
        <p className="arrive-in mt-4 hidden max-w-sm text-[15px] leading-relaxed text-bone/70 [animation-delay:1100ms] md:block">
          Select a part of the car. Each service shows what&apos;s involved, how long it takes, and books from there.
        </p>
      </div>
      {/* On a phone the car is wider than the screen, so every service is also one tap away here. */}
      <div className="arrive-in absolute inset-x-0 bottom-[4.5rem] z-10 flex gap-2 overflow-x-auto px-5 pb-3 [animation-delay:1300ms] [scrollbar-width:none] md:hidden">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={(event) => go(service.id, originOf(event.currentTarget))}
            className="label min-h-11 shrink-0 bg-[#040507]/70 px-4 text-bone shadow-[inset_0_0_0_1px_rgba(239,234,226,0.3)] backdrop-blur-sm"
          >
            {service.title}
          </button>
        ))}
      </div>
    </>
  );
}

"use client";

import { ContextCTA, EntranceSequence } from "@/experience";
import { ASSETS } from "../assets";
import { RESTAURANT } from "../content";

/** Signage around the doorway: the name above, a way past the intro below. */
function Signage({ skip }: { skip: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-between px-5 pb-[14vh] pt-[14vh] text-center text-bone sm:pt-[11vh] md:pb-[13vh]">
      <div className="arrive-in">
        <p className="label text-bone/60">{RESTAURANT.kicker}</p>
        <h1
          data-scene-focus
          tabIndex={-1}
          className="mt-4 font-serif text-[3.25rem] font-normal leading-none outline-none sm:text-[clamp(3.5rem,6vw,5.75rem)]"
        >
          {RESTAURANT.name}
        </h1>
      </div>
      <div className="flex flex-col items-center gap-5">
        <ContextCTA onClick={skip} tone="outline" className="min-w-40">
          Skip intro
        </ContextCTA>
        <p className="font-serif text-lg italic text-bone/70">Dinner nightly from five</p>
      </div>
    </div>
  );
}

/**
 * The street, the walk to the door, and through it. It starts by itself and can be skipped; the menu,
 * reservations, and the rest of the navigation are available the whole time.
 */
export function Arrival({ onEntered }: { onEntered: () => void }) {
  return <EntranceSequence interior={ASSETS.mainRoom} onEntered={onEntered} Copy={Signage} autoStart={1.1} />;
}

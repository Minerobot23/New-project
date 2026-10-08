"use client";

import { ContextCTA, EntranceSequence } from "@/experience";
import { ASSETS } from "../assets";
import { RESTAURANT } from "../content";

/** Signage around the doorway: the name above, the way in below. */
function Signage({ enter, entering }: { enter: () => void; entering: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-between px-5 pb-[5vh] pt-[11vh] text-center text-bone sm:pt-[8vh]">
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
      <div className="arrive-in flex flex-col items-center gap-5 [animation-delay:600ms]">
        <ContextCTA onClick={enter} disabled={entering} tone="outline" className="min-w-40">
          Enter
        </ContextCTA>
        <p className="font-serif text-lg italic text-bone/70">Dinner nightly from five</p>
      </div>
    </div>
  );
}

/** Scene 01 to 03: the street, the walk to the door, and through it. */
export function Arrival({ onEntered }: { onEntered: () => void }) {
  return <EntranceSequence interior={ASSETS.mainRoom} onEntered={onEntered} Copy={Signage} />;
}

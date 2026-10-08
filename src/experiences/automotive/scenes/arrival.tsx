"use client";

import { useState } from "react";
import { ContextCTA, CoverStage, ShutterReveal, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { SHOP } from "../content";
import { useAuto } from "../context";

/** The garage door lifts on a car under red light; then the visitor pulls into the bay. */
export function Arrival() {
  const { go, ready } = useAuto();
  const [open, setOpen] = useState(false);

  return (
    <ShutterReveal onOpen={() => setOpen(true)} delay={0.5} start={ready}>
      <CoverStage
        image={ASSETS.garageDoor}
        drift
        preload
        grade={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,6,8,0.85)_0%,transparent_45%),linear-gradient(to_bottom,rgba(5,6,8,0.6)_0%,transparent_30%)]"
          />
        }
      />
      <div
        className={`absolute inset-x-0 bottom-0 px-5 pb-[8vh] text-bone transition-opacity duration-1000 sm:px-8 ${open ? "opacity-100" : "opacity-0"}`}
      >
        <p className="label text-[#ff4b3a]">{SHOP.kicker}</p>
        <h1
          data-scene-focus
          tabIndex={-1}
          className="condensed mt-3 text-[4.2rem] outline-none sm:text-[clamp(5rem,10vw,9.5rem)]"
        >
          {SHOP.name}
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <ContextCTA onClick={(event) => go("bay", originOf(event.currentTarget))} disabled={!open} className="min-w-40">
            Pull in
          </ContextCTA>
          <p className="text-sm text-bone/65">{SHOP.hours}</p>
        </div>
      </div>
    </ShutterReveal>
  );
}

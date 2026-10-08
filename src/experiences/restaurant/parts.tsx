"use client";

import type { ReactNode } from "react";
import { originOf } from "@/experience";
import { useRestaurant } from "./context";

/** "Back to the room": the camera pulls back out of the current space. */
export function BackToRoom({ label = "The dining room" }: { label?: string }) {
  const { back } = useRestaurant();
  return (
    <button
      type="button"
      onClick={(event) => back(originOf(event.currentTarget))}
      className="label group absolute left-5 top-20 z-20 flex h-11 items-center gap-3 text-bone/80 hover:text-bone sm:left-8 sm:top-24"
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-x-1"
      >
        ←
      </span>
      {label}
    </button>
  );
}

/** Scene heading in the restaurant's serif. Receives focus when its scene becomes active. */
export function SceneTitle({ kicker, children, className = "" }: { kicker?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {kicker && <p className="label text-bone/60">{kicker}</p>}
      <h2
        data-scene-focus
        tabIndex={-1}
        className="mt-3 font-serif text-[3.4rem] font-normal leading-[0.92] tracking-[-0.01em] outline-none sm:text-[5.5rem]"
      >
        {children}
      </h2>
    </div>
  );
}

/** Photographic grade: darken toward the edges and under text, never a coloured gradient. */
export function Grade({ side = "left", strength = 0.75 }: { side?: "left" | "right" | "bottom" | "full"; strength?: number }) {
  const direction = {
    left: "to right",
    right: "to left",
    bottom: "to top",
    full: "to top",
  }[side];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          side === "full"
            ? `rgba(8,7,6,${strength})`
            : `linear-gradient(${direction}, rgba(8,7,6,${strength}) 0%, rgba(8,7,6,${strength * 0.55}) 38%, rgba(8,7,6,0) 70%)`,
      }}
    />
  );
}

/** One line of a menu or cocktail list: name, note, price. */
export function MenuLine({ name, note, price }: { name: string; note: string; price: string }) {
  return (
    <li className="menu-line flex items-baseline gap-4 border-b border-bone/15 py-4">
      <div className="flex-1">
        <p className="font-serif text-2xl leading-tight sm:text-[1.75rem]">{name}</p>
        <p className="mt-1 text-sm text-bone/65">{note}</p>
      </div>
      <p className="font-serif text-xl tabular-nums text-bone/80">{price}</p>
    </li>
  );
}

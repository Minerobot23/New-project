"use client";

import type { CSSProperties } from "react";
import type { FocalPoint } from "./types";
import { originOf } from "./transitions";

type Props = {
  /** Position inside the photo (fractions), used inside a CoverStage. */
  at: FocalPoint;
  label: string;
  /** Short line that appears with the label on hover or focus. */
  hint?: string;
  /** Receives the on-screen origin of the hotspot so the camera can travel toward it. */
  onSelect: (origin: FocalPoint) => void;
  /** Which side the label opens toward, so labels near an edge stay on screen. */
  align?: "left" | "right";
  /** Stagger index for the entrance. */
  index?: number;
  disabled?: boolean;
};

/**
 * A point of interest that belongs to the room: a breathing light on the object itself.
 * It is a real button (keyboard, focus ring, accessible name), and its label is always visible on touch screens.
 */
export function Hotspot({ at, label, hint, onSelect, align = "right", index = 0, disabled = false }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => onSelect(originOf(event.currentTarget))}
      style={
        {
          left: `${at.x * 100}%`,
          top: `${at.y * 100}%`,
          "--i": index,
        } as CSSProperties
      }
      className="hotspot group absolute z-10 -translate-x-1/2 -translate-y-1/2 p-3 text-bone outline-none"
    >
      <span className="beacon relative block size-3.5 rounded-full">
        <span className="absolute inset-[3px] rounded-full bg-bone shadow-[0_0_18px_rgba(255,236,200,0.85)] transition-transform duration-500 group-hover:scale-125 group-focus-visible:scale-125" />
      </span>
      <span
        className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 flex-col whitespace-nowrap ${
          align === "right" ? "left-full items-start pl-1" : "right-full items-end pr-1"
        }`}
      >
        <span className="label text-bone [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">{label}</span>
        {hint && (
          <span className="mt-1 max-h-0 overflow-hidden font-serif text-base italic text-bone/85 opacity-0 transition-all duration-500 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)] group-hover:max-h-8 group-hover:opacity-100 group-focus-visible:max-h-8 group-focus-visible:opacity-100">
            {hint}
          </span>
        )}
      </span>
      <span className="absolute inset-0 rounded-full ring-bone/80 group-focus-visible:ring-1" />
    </button>
  );
}

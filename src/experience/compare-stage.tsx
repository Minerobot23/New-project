"use client";

import { useEffect, useRef, useState } from "react";
import { CoverStage } from "./cover-stage";
import { prefersReducedMotion } from "./use-reduced-motion";
import type { ExperienceImage } from "./types";

type Props = {
  /** Left side: the earlier state (e.g. mid-project). */
  before: ExperienceImage;
  /** Right side: the finished state. */
  after: ExperienceImage;
  beforeLabel?: string;
  afterLabel?: string;
  /** Accessible name for the slider. */
  label: string;
  /** Sweep the divider once on arrival so visitors see it can move. */
  hint?: boolean;
};

/**
 * Full-screen comparison: two photographs on top of each other with a draggable divider.
 * The scene is the comparison, rather than a slider in a box. A native range input carries
 * mouse, touch, keyboard, and screen-reader control.
 */
export function CompareStage({ before, after, beforeLabel = "Before", afterLabel = "After", label, hint = true }: Props) {
  const [position, setPosition] = useState(50);
  const touched = useRef(false);

  useEffect(() => {
    if (!hint || prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now() + 1400;
    const sweep = (now: number) => {
      if (touched.current) return;
      const t = Math.min(1, Math.max(0, (now - start) / 2000));
      setPosition(50 - Math.sin(t * Math.PI * 2) * 18);
      if (t < 1) frame = requestAnimationFrame(sweep);
    };
    frame = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(frame);
  }, [hint]);

  return (
    <div className="absolute inset-0 select-none has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:-outline-offset-4 has-[input:focus-visible]:outline-bone">
      <CoverStage image={after} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <CoverStage image={before} />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
        <span className="absolute inset-y-0 -left-px w-[2px] bg-bone/90 shadow-[0_0_24px_rgba(0,0,0,0.5)]" />
        <span className="label absolute top-[30%] flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-stage md:top-1/2">
          ↔
        </span>
      </div>

      <span
        aria-hidden="true"
        className="label pointer-events-none absolute left-5 top-36 bg-stage/80 px-3 py-2 text-bone sm:left-8 md:bottom-28 md:top-auto"
      >
        {beforeLabel}
      </span>
      <span
        aria-hidden="true"
        className="label pointer-events-none absolute right-5 top-36 bg-bone px-3 py-2 text-stage sm:right-8 md:bottom-28 md:top-auto"
      >
        {afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={position}
        aria-label={label}
        aria-valuetext={`${Math.round(position)}% ${beforeLabel}, ${Math.round(100 - position)}% ${afterLabel}`}
        onChange={(event) => {
          touched.current = true;
          setPosition(Number(event.target.value));
        }}
        onPointerDown={() => {
          touched.current = true;
        }}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

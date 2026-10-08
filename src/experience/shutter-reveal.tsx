"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./use-reduced-motion";

type Props = {
  /** The scene behind the shutter. */
  children: ReactNode;
  /** Number of horizontal panels drawn on the door. */
  panels?: number;
  /** Seconds before the door starts to lift. */
  delay?: number;
  /** Called when the door has fully opened. */
  onOpen?: () => void;
  /** Hold the door shut until this is true (e.g. while a loader covers the scene). */
  start?: boolean;
};

/**
 * A sectional door that lifts to reveal the scene: garages, loading bays, shop shutters.
 * The door rises with a little hesitation at the start (the motor taking the weight),
 * and the light under it reaches the floor before the room is seen.
 */
export function ShutterReveal({ children, panels = 7, delay = 0.6, onOpen, start = true }: Props) {
  const door = useRef<HTMLDivElement>(null);
  const spill = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!door.current || !start) return;
    if (prefersReducedMotion()) {
      gsap.set(door.current, { yPercent: -100 });
      onOpen?.();
      return;
    }
    const tl = gsap
      .timeline({ delay, onComplete: onOpen })
      .to(door.current, { yPercent: -4, duration: 0.5, ease: "power1.inOut" })
      .to(spill.current, { opacity: 1, duration: 0.4 }, "<")
      .to(door.current, { yPercent: -100, duration: 2.4, ease: "power2.inOut" }, "+=0.15")
      .to(spill.current, { opacity: 0, duration: 0.8 }, "-=0.9");
    return () => {
      tl.kill();
    };
    // Runs once, when the door is allowed to open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {children}
      <div ref={door} aria-hidden="true" className="absolute inset-0 flex flex-col bg-[#101214]">
        {Array.from({ length: panels }, (_, i) => (
          <div key={i} className="relative flex-1 border-b border-black/70 bg-gradient-to-b from-[#1c1f22] to-[#121416]">
            <span className="absolute inset-x-[8%] top-1/2 h-px bg-white/[0.04]" />
          </div>
        ))}
        {/* Light spilling under the rising door. */}
        <div
          ref={spill}
          className="absolute inset-x-0 -bottom-24 h-24 bg-gradient-to-b from-[rgba(120,200,220,0.35)] to-transparent opacity-0"
        />
      </div>
    </div>
  );
}

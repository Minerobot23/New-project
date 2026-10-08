"use client";

import { gsap } from "gsap";
import type { FocalPoint, SceneTransition } from "./types";

/**
 * Camera-like handovers between two full-screen scene layers.
 * `origin` is in viewport fractions (where on screen the visitor clicked), so the camera always
 * pushes toward the thing they chose, whatever the crop of the photo on their screen.
 */
export function runSceneTransition(
  outgoing: HTMLElement | null,
  incoming: HTMLElement,
  transition: SceneTransition,
  options: { reduced: boolean; lowPower: boolean },
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let timeline: gsap.core.Timeline | undefined;
    // Animations need animation frames. A background tab, a throttled device, or an embedded
    // browser may never deliver them; navigation must not wait on that. Longest move is 2.1s.
    const guard = window.setTimeout(() => finish(), TRANSITION_LIMIT_MS);
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(guard);
      timeline?.kill();
      // Set the end state directly rather than through the animation engine, so it holds even
      // when no animation frame is ever delivered.
      for (const property of ["transform", "opacity", "filter", "transform-origin"]) {
        incoming.style.removeProperty(property);
      }
      if (outgoing) outgoing.style.opacity = "0";
      resolve();
    };

    if (transition.kind === "cut" || !outgoing) {
      finish();
      return;
    }

    // Reduced motion: every move becomes a short crossfade.
    if (options.reduced) {
      timeline = gsap
        .timeline({ onComplete: finish })
        .fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "none" })
        .to(outgoing, { opacity: 0, duration: 0.25, ease: "none" }, 0);
      return;
    }

    // Blur on full-screen layers is expensive on phones; there the move relies on scale and fade alone.
    const blur = (px: number) => (options.lowPower ? "blur(0px)" : `blur(${px}px)`);
    const tl = gsap.timeline({ onComplete: finish });
    timeline = tl;

    if (transition.kind === "travel") {
      const origin = toOrigin(transition.origin);
      tl.set([outgoing, incoming], { transformOrigin: origin })
        .to(
          outgoing,
          {
            scale: 2.4,
            opacity: 0,
            filter: blur(10),
            duration: 1.3,
            ease: "power3.in",
          },
          0,
        )
        .fromTo(
          incoming,
          { scale: 1.28, opacity: 0, filter: blur(14) },
          {
            scale: 1,
            opacity: 1,
            filter: blur(0),
            duration: 1.45,
            ease: "power3.out",
          },
          0.62,
        );
      return;
    }

    if (transition.kind === "retreat") {
      tl.set(incoming, {
        transformOrigin: toOrigin(transition.origin ?? { x: 0.5, y: 0.5 }),
      })
        .to(
          outgoing,
          {
            scale: 0.86,
            opacity: 0,
            filter: blur(6),
            duration: 0.95,
            ease: "power2.in",
          },
          0,
        )
        .fromTo(
          incoming,
          { scale: 1.7, opacity: 0, filter: blur(12) },
          {
            scale: 1,
            opacity: 1,
            filter: blur(0),
            duration: 1.35,
            ease: "power3.out",
          },
          0.3,
        );
      return;
    }

    // fade: dip through the stage colour, the way a film cuts between rooms.
    tl.to(outgoing, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0).fromTo(
      incoming,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
      0.45,
    );
  });
}

/** Upper bound on any scene change, animated or not. */
const TRANSITION_LIMIT_MS = 2600;

const toOrigin = (point: FocalPoint) => `${(point.x * 100).toFixed(2)}% ${(point.y * 100).toFixed(2)}%`;

/** Viewport-fraction centre of an element: the origin to pass to a travel transition. */
export function originOf(element: Element | null): FocalPoint {
  if (!element || typeof window === "undefined") return { x: 0.5, y: 0.5 };
  const box = element.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (box.left + box.width / 2) / window.innerWidth)),
    y: Math.min(1, Math.max(0, (box.top + box.height / 2) / window.innerHeight)),
  };
}

/** Staggered rise for text that belongs to a scene (headings, menu lines, controls). */
export function revealLines(targets: gsap.TweenTarget, options: { delay?: number; reduced?: boolean } = {}) {
  if (options.reduced) return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: options.delay ?? 0 });
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.08,
      delay: options.delay ?? 0,
    },
  );
}

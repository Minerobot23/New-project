"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import { CoverStage, Hotspot, prefersReducedMotion } from "@/experience";
import { ASSETS } from "../assets";
import { AREAS, COMPANY } from "../content";
import { useHome } from "../context";

/** Window and lamp positions on the house photograph, switched on one by one at dusk. */
const LIGHTS = [
  { x: 0.13, y: 0.4, size: 9 },
  { x: 0.1, y: 0.54, size: 7 },
  { x: 0.38, y: 0.35, size: 18 },
  { x: 0.18, y: 0.4, size: 12 },
  { x: 0.62, y: 0.45, size: 16 },
  { x: 0.62, y: 0.68, size: 20 },
  { x: 0.25, y: 0.66, size: 12 },
  { x: 0.46, y: 0.65, size: 8 },
  { x: 0.71, y: 0.65, size: 8 },
];

// The lights come on once per visit; returning to the house later doesn't replay it.
let introPlayed = false;

/** The house is the interface: dusk, the lights come on, and every part of the home is a way in. */
export function House() {
  const { go } = useHome();
  const dim = useRef<HTMLDivElement>(null);
  const lights = useRef<HTMLDivElement>(null);
  const ui = useRef<HTMLDivElement>(null);
  const spots = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const glows = lights.current?.children ?? [];
    if (introPlayed || prefersReducedMotion()) {
      gsap.set(dim.current, { opacity: 0 });
      gsap.set(glows, { opacity: 1 });
      gsap.set([ui.current, spots.current], { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap
      .timeline({
        delay: 0.5,
        onComplete: () => {
          introPlayed = true;
        },
      })
      .fromTo(glows, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", stagger: { each: 0.22, from: "random" } })
      .to(dim.current, { opacity: 0, duration: 2.4, ease: "power2.inOut" }, 0.3)
      .fromTo(ui.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 1.6)
      .fromTo(spots.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 2.2);
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <CoverStage
        image={ASSETS.house}
        drift
        parallax
        pan
        grade={
          <>
            {/* Window light: warm pools that switch on one by one. */}
            <div ref={lights} aria-hidden="true" className="absolute inset-0 mix-blend-screen">
              {LIGHTS.map((light, i) => (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                  style={{
                    left: `${light.x * 100}%`,
                    top: `${light.y * 100}%`,
                    width: `${light.size}%`,
                    aspectRatio: "1",
                    background: "radial-gradient(circle, rgba(255,190,110,0.45) 0%, rgba(255,170,90,0.12) 45%, transparent 70%)",
                  }}
                />
              ))}
            </div>
            {/* Before dusk settles: the house in shadow. */}
            <div ref={dim} aria-hidden="true" className="absolute inset-0 bg-[#060b17]/80" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_50%,rgba(4,8,16,0.6)_100%)]"
            />
          </>
        }
      >
        <div ref={spots} className="absolute inset-0">
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
        </div>
      </CoverStage>

      <div ref={ui} className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-24 text-bone sm:px-8 sm:pt-28">
        <p className="label text-[#f2b45c]">{COMPANY.name}</p>
        <h1
          data-scene-focus
          tabIndex={-1}
          className="mt-4 max-w-[13ch] font-display text-[2.6rem] font-light uppercase leading-[0.95] tracking-[-0.02em] outline-none [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] sm:text-[clamp(3.25rem,5.4vw,5.5rem)]"
        >
          What do you want to transform?
        </h1>
        <p className="mt-5 hidden max-w-sm text-[15px] leading-relaxed text-bone/75 md:block">
          Select any part of the house: the roof, the siding, the windows, or step inside.
        </p>
        <p className="mt-4 text-sm text-bone/70 md:hidden">Drag to look around. Tap a light on the house.</p>
      </div>
    </>
  );
}

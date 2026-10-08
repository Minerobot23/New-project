"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ContextCTA, ExperienceLoader, prefersReducedMotion, useAssetPreload } from "@/experience";
import { LogoMark } from "@/components/brand/logo-mark";
import { brandFont } from "@/components/brand/fonts";
import { CHOOSER_IMAGES } from "./environments";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";

const SEEN_KEY = "fluxline:intro-seen";

// Read once per page load: the intro plays on a visitor's first homepage view in a session,
// not again when they come back from an experience or press Back.
let cachedSkip: boolean | null = null;
const readSkip = () => {
  if (cachedSkip === null) {
    try {
      cachedSkip = window.sessionStorage.getItem(SEEN_KEY) === "1" || window.location.hash.length > 1;
    } catch {
      cachedSkip = false;
    }
  }
  return cachedSkip;
};
const subscribeNoop = () => () => {};

type Phase = "loading" | "title" | "leaving" | "gone";

/**
 * The first ten seconds: black, a small mark, real loading progress; then the line and ENTER.
 * ENTER doesn't scroll anywhere: the title lifts away and a shutter opens onto the environments beneath.
 */
export function FluxlineIntro() {
  const skip = useSyncExternalStore(subscribeNoop, readSkip, () => false);
  const { progress, done } = useAssetPreload(CHOOSER_IMAGES, { minDuration: 1800 });
  const [phase, setPhase] = useState<Phase>("loading");
  const overlay = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const visible = !skip && phase !== "gone";

  useEffect(() => {
    if (done && phase === "loading") {
      const timer = window.setTimeout(() => setPhase("title"), 250);
      return () => window.clearTimeout(timer);
    }
  }, [done, phase]);

  // While the intro is up, the page underneath doesn't scroll.
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [visible]);

  useLayoutEffect(() => {
    if (phase === "title") title.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }, [phase]);

  const enter = () => {
    if (phase !== "title") return;
    setPhase("leaving");
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const finish = () => {
      setPhase("gone");
      document.getElementById("environments-title")?.focus({ preventScroll: true });
    };
    if (prefersReducedMotion()) {
      gsap.to(overlay.current, { opacity: 0, duration: 0.3, onComplete: finish });
      return;
    }
    // The title lifts out, then the black closes like a shutter toward a single line of light and is gone.
    gsap
      .timeline({ onComplete: finish })
      .to(title.current, { y: -40, opacity: 0, duration: 0.7, ease: "power2.in" })
      .to(overlay.current, { clipPath: "inset(50% 0% 50% 0%)", duration: 1.1, ease: "power4.inOut" }, 0.45)
      .fromTo(
        "[data-environment]",
        { scale: 1.12, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "power3.out", stagger: 0.08 },
        0.75,
      );
  };

  if (!visible) return null;

  return (
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Fluxline Solutions"
      data-intro
      className="fixed inset-0 z-[60] overflow-hidden bg-stage text-bone"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {phase === "loading" ? (
        <ExperienceLoader
          progress={progress}
          label="Loading"
          mark={<LogoMark tone="light" className="size-9" />}
        />
      ) : (
        <>
          {/* A dim glimpse of what's behind the door. */}
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.22]">
            <div className="drift absolute inset-0">
              <Image src={mainRoom} alt="" fill sizes="100vw" className="object-cover grayscale" />
            </div>
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_0%,rgba(10,9,8,0.85)_100%)]" />
          <div className="film-grain" />

          <div ref={title} className="relative flex h-full flex-col items-center justify-center px-5 text-center">
            <p className={`${brandFont.className} intro-rise text-sm font-bold tracking-[0.5em] text-bone/80`} style={{ "--i": 0 } as CSSProperties}>
              FLUXLINE
            </p>
            <p className="display mt-10 max-w-[18ch] text-balance text-[2.1rem] uppercase sm:mt-12 sm:text-[clamp(2.75rem,5.2vw,4.9rem)]">
              <span className="line-mask keep-lines">
                <span style={{ "--i": 1 } as CSSProperties}>Your business is an experience. </span>
              </span>
              <span className="line-mask keep-lines text-bone/45">
                <span style={{ "--i": 3 } as CSSProperties}>Your website should be too.</span>
              </span>
            </p>
            <div className="intro-rise mt-14" style={{ "--i": 7 } as CSSProperties}>
              <ContextCTA tone="outline" onClick={enter} className="min-w-44">
                Enter
              </ContextCTA>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

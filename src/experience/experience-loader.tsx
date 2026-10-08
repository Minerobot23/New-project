"use client";

import { getImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type PreloadImage = { src: StaticImageData; sizes?: string };

/**
 * Warms the browser cache with the exact responsive candidates next/image will request
 * (same srcset and sizes), and reports real progress. Resolves anyway after `timeout`
 * so a slow or failed image never traps the visitor behind the loader. Every wait here is a
 * plain timer, never an animation callback, so it also resolves in a tab that is not painting.
 */
export function useAssetPreload(images: PreloadImage[], { minDuration = 300, timeout = 2500 } = {}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let loaded = 0;
    let finished = false;
    const startedAt = performance.now();
    const total = Math.max(1, images.length);

    const complete = () => {
      if (finished) return;
      finished = true;
      setProgress(1);
      const wait = Math.max(0, minDuration - (performance.now() - startedAt));
      window.setTimeout(() => setDone(true), wait);
    };

    // Save-Data or very slow networks: skip the wait entirely; scenes load progressively instead.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") {
      complete();
      return;
    }

    images.forEach(({ src, sizes = "100vw" }) => {
      const { props } = getImageProps({ src, alt: "", fill: true, sizes });
      const image = new window.Image();
      image.sizes = props.sizes ?? sizes;
      if (props.srcSet) image.srcset = props.srcSet;
      image.src = props.src;
      const settle = () => {
        loaded += 1;
        setProgress(loaded / total);
        if (loaded >= total) complete();
      };
      image.decode().then(settle, settle);
    });
    const guard = window.setTimeout(complete, timeout);
    return () => window.clearTimeout(guard);
  }, [images, minDuration, timeout]);

  return { progress, done };
}

/** The black opening screen: a small mark and a hairline that fills with real loading progress. */
export function ExperienceLoader({ progress, mark, label }: { progress: number; mark: ReactNode; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="absolute inset-0 flex flex-col items-center justify-center bg-stage text-bone"
    >
      <div className="opacity-90">{mark}</div>
      <div className="mt-8 h-px w-36 overflow-hidden bg-bone/15">
        <div
          className="h-full origin-left bg-bone transition-transform duration-500 ease-[var(--ease-out-soft)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <p className="label mt-5 tabular-nums text-bone/45">{String(Math.round(progress * 100)).padStart(3, "0")}</p>
    </div>
  );
}

/** Fire-and-forget warm-up for images the visitor will probably need next (no progress, no blocking). */
export function warmImages(images: PreloadImage[]) {
  if (typeof window === "undefined") return;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  images.forEach(({ src, sizes = "100vw" }) => {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    const image = new window.Image();
    image.sizes = props.sizes ?? sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
  });
}

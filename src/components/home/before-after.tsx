"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  before: StaticImageData;
  after: StaticImageData;
  /** Describes what the two screenshots show. */
  label: string;
  url: string;
};

/**
 * Drag-to-compare: the After screenshot is revealed over the Before one.
 * A native range input sits on top, so mouse, touch, and keyboard all work and screen readers get a real slider.
 */
export function BeforeAfter({ before, after, label, url }: Props) {
  const [position, setPosition] = useState(50);
  const touched = useRef(false);

  // One slow sweep after load hints that the divider can be moved. Skipped for reduced motion or once the visitor touches it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames: number[] = [];
    const start = performance.now() + 900;
    const sweep = (now: number) => {
      if (touched.current) return;
      const t = Math.min(1, Math.max(0, (now - start) / 1800));
      const eased = 0.5 - Math.cos(t * Math.PI * 2) / 2;
      setPosition(50 + eased * 22);
      if (t < 1) frames.push(requestAnimationFrame(sweep));
    };
    frames.push(requestAnimationFrame(sweep));
    return () => frames.forEach(cancelAnimationFrame);
  }, []);

  return (
    <figure>
      <div className="border border-ink bg-white">
        <div className="flex items-center gap-3 border-b border-ink px-3 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2 border border-ink" />
            <span className="size-2 border border-ink" />
            <span className="size-2 border border-ink" />
          </span>
          <span className="truncate font-mono text-[11px] text-muted">{url}</span>
        </div>

        <div className="relative aspect-[1400/888] select-none overflow-hidden bg-sunken has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-accent">
          <Image
            src={after}
            alt={`${label}, redesigned (After)`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-top"
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <Image
              src={before}
              alt={`${label}, original (Before)`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              placeholder="blur"
              loading="eager"
              className="object-cover object-top"
            />
          </div>

          <span className="pointer-events-none absolute left-0 top-0 bg-ink px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-white">
            Before
          </span>
          <span className="pointer-events-none absolute right-0 top-0 bg-accent px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-white">
            After
          </span>

          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${position}%` }}>
            <span className="absolute inset-y-0 -left-px w-[2px] bg-ink" />
            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ink text-sm text-white">
              ↔
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={position}
            aria-label="Compare the original and redesigned website"
            aria-valuetext={`${Math.round(position)}% original, ${Math.round(100 - position)}% redesign`}
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
      </div>
    </figure>
  );
}

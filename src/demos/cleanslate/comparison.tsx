"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { comparisons } from "./content";

/**
 * Before/after slider for finished jobs. A native range input covers the image, so mouse, touch,
 * and keyboard all work and screen readers get a real slider (same pattern as the site's BeforeAfter).
 * The sample pairs are unrelated stock photos and are labeled that way on screen.
 */
export function ComparisonGallery() {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const touched = useRef(false);
  const frame = useRef<HTMLDivElement>(null);
  const pair = comparisons[index];

  // One slow sweep the first time the slider scrolls into view, to show that it moves.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = frame.current;
    if (!element) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now() + 300;
        const sweep = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, Math.max(0, (now - start) / 2000));
          setPosition(50 - Math.sin(t * Math.PI * 2) * 24);
          if (t < 1) raf = requestAnimationFrame(sweep);
        };
        raf = requestAnimationFrame(sweep);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      <figure>
        <div
          ref={frame}
          className="relative aspect-[4/3] select-none overflow-hidden bg-cs-mist sm:aspect-[16/9] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-cs-blue"
        >
          <Image src={pair.after.src} alt={`After: ${pair.after.alt} (illustrative)`} fill sizes="(min-width: 1280px) 80rem, 100vw" placeholder="blur" className="object-cover" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <Image src={pair.before.src} alt={`Before: ${pair.before.alt} (illustrative)`} fill sizes="(min-width: 1280px) 80rem, 100vw" placeholder="blur" className="object-cover" />
          </div>

          <span className="pointer-events-none absolute left-0 top-0 bg-cs-night px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Before</span>
          <span className="pointer-events-none absolute right-0 top-0 bg-cs-blue px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">After</span>

          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${position}%` }}>
            <span className="absolute inset-y-0 -left-px w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
            <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cs-ink shadow-lg">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={position}
            aria-label={`Compare before and after: ${pair.label}`}
            aria-valuetext={`${Math.round(position)}% before, ${Math.round(100 - position)}% after`}
            onChange={(event) => {
              touched.current = true;
              setPosition(Number(event.target.value));
            }}
            onPointerDown={() => {
              touched.current = true;
            }}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />

          <span className="pointer-events-none absolute bottom-0 left-0 bg-cs-night/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85">
            Illustrative sample · Not a Clean Slate project
          </span>
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-cs-slate">
          Sample imagery shows how a finished job would be presented. The two photos in each pair come from different, unrelated properties.
          At launch, this gallery would show Clean Slate&apos;s own before-and-after photos.
        </figcaption>
      </figure>

      <div role="group" aria-label="Sample comparisons" className="mt-6 flex flex-wrap gap-2">
        {comparisons.map((item, itemIndex) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={itemIndex === index}
            onClick={() => {
              touched.current = true;
              setIndex(itemIndex);
              setPosition(50);
            }}
            className={`h-11 px-4 text-sm font-semibold transition-colors ${
              itemIndex === index ? "bg-cs-ink text-white" : "bg-cs-mist text-cs-slate hover:text-cs-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { gallery, type GalleryItem } from "./content";

const FILTERS: { id: "all" | GalleryItem["type"]; label: string }[] = [
  { id: "all", label: "All projects" },
  { id: "water", label: "Water" },
  { id: "fire", label: "Fire & smoke" },
  { id: "mold", label: "Mold" },
];

const TYPE_LABEL: Record<GalleryItem["type"], string> = { water: "Water damage", fire: "Fire & smoke", mold: "Mold remediation" };

/**
 * Project gallery: filter by damage, pick a project, drag to compare. A native range input covers the image,
 * so mouse, touch, and keyboard all work and screen readers get a real slider (same pattern as the site's BeforeAfter).
 * The sample pairs are unrelated stock photos and are labeled that way on screen.
 */
export function ComparisonGallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState(gallery[0].id);
  const [position, setPosition] = useState(50);
  const touched = useRef(false);
  const frame = useRef<HTMLDivElement>(null);

  const visible = filter === "all" ? gallery : gallery.filter((item) => item.type === filter);
  const pair = visible.find((item) => item.id === selectedId) ?? visible[0];

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

  const choose = (item: GalleryItem) => {
    touched.current = true;
    setSelectedId(item.id);
    setPosition(50);
  };

  return (
    <div>
      <div role="group" aria-label="Filter projects by damage type" className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count = item.id === "all" ? gallery.length : gallery.filter((entry) => entry.type === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => {
                setFilter(item.id);
                const first = item.id === "all" ? gallery[0] : gallery.find((entry) => entry.type === item.id);
                if (first) choose(first);
              }}
              className={`h-11 px-4 text-sm font-semibold transition-colors ${filter === item.id ? "bg-cs-ink text-white" : "bg-cs-mist text-cs-slate hover:text-cs-ink"}`}
            >
              {item.label} <span className="ml-1 font-mono text-[11px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <figure className="lg:col-span-8">
          <div
            ref={frame}
            className="relative aspect-[4/3] select-none overflow-hidden bg-cs-mist sm:aspect-[16/10] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-cs-blue"
          >
            <Image key={`a-${pair.id}`} src={pair.after.src} alt={`After: ${pair.after.alt} (illustrative)`} fill sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" className="object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
              <Image key={`b-${pair.id}`} src={pair.before.src} alt={`Before: ${pair.before.alt} (illustrative)`} fill sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" className="object-cover" />
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
          <figcaption className="sr-only">{pair.label}, illustrative sample imagery</figcaption>
        </figure>

        <div key={pair.id} className="cs-swap flex flex-col border border-cs-ink/10 bg-white p-6 lg:col-span-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cs-blue">{TYPE_LABEL[pair.type]}</p>
          <h3 className="mt-2 text-xl font-semibold leading-snug">{pair.label}</h3>
          <p className="mt-5 text-sm font-semibold">Typical scope</p>
          <ul className="mt-2 space-y-2">
            {pair.scope.map((line) => (
              <li key={line} className="flex gap-2.5 text-[15px] leading-snug text-cs-slate">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cs-blue" strokeWidth={2.5} />
                {line}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-px border-t border-cs-ink/10 pt-4 text-[13px]">
            {["Location", "Timeline", "Crew notes", "Customer review"].map((field) => (
              <div key={field} className="py-1.5">
                <dt className="font-semibold text-cs-ink">{field}</dt>
                <dd className="font-mono text-[11px] uppercase tracking-[0.1em] text-cs-blue">From Clean Slate</dd>
              </div>
            ))}
          </dl>
          <p className="mt-auto pt-5 text-[12.5px] leading-relaxed text-cs-slate">
            Sample imagery: the two photos come from different, unrelated properties. At launch, each card is a real Clean Slate job.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Projects">
        {visible.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => choose(item)}
              aria-pressed={item.id === pair.id}
              aria-label={item.label}
              className={`group relative block aspect-[4/3] w-full overflow-hidden bg-cs-mist outline-offset-2 transition-[box-shadow] ${
                item.id === pair.id ? "shadow-[0_0_0_3px_var(--color-cs-blue)]" : ""
              }`}
            >
              <Image src={item.after.src} alt="" fill sizes="(min-width: 640px) 15vw, 30vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cs-night/90 to-transparent px-2 pb-1.5 pt-4 text-left text-[11px] font-medium leading-tight text-white">
                {TYPE_LABEL[item.type]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

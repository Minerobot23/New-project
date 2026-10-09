"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ClipboardCheck, Hammer, PhoneCall, Wind } from "lucide-react";
import { stages } from "./content";

const ICONS = [PhoneCall, ClipboardCheck, Wind, Hammer];
const DWELL_MS = 6500;

/**
 * Four stages, advancing on their own while the section is on screen.
 * The timer stops for good once the visitor picks a stage, and never runs under reduced motion.
 */
export function RestorationProcess({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a media query
      setAuto(false);
      return;
    }
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const running = auto && inView && !paused;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % stages.length), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  const choose = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  const stage = stages[active];

  return (
    <div
      ref={root}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ol className="grid grid-cols-4 gap-2 sm:gap-4">
        {stages.map((item, index) => {
          const Icon = ICONS[index];
          const done = index < active;
          const current = index === active;
          return (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => choose(index)}
                aria-current={current ? "step" : undefined}
                aria-label={`Stage ${index + 1}: ${item.title}`}
                className={`group flex w-full flex-col items-start text-left transition-colors ${
                  current ? (dark ? "text-white" : "text-cs-ink") : dark ? "text-white/45 hover:text-white/80" : "text-cs-slate/70 hover:text-cs-ink"
                }`}
              >
                <span className={`relative mb-4 block h-[3px] w-full overflow-hidden ${dark ? "bg-white/12" : "bg-cs-ink/10"}`}>
                  {done && <span className="absolute inset-0 bg-cs-sky" />}
                  {current &&
                    (running ? (
                      <span key={`fill-${active}`} className="cs-fill absolute inset-0 bg-cs-sky" style={{ "--dwell": `${DWELL_MS}ms` } as CSSProperties} />
                    ) : (
                      <span className="absolute inset-0 bg-cs-sky" />
                    ))}
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={`hidden size-9 items-center justify-center transition-colors duration-300 sm:flex ${
                      current ? "bg-cs-blue text-white" : dark ? "bg-white/8 text-white/60" : "bg-cs-mist text-cs-slate"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block font-mono text-[11px] opacity-70">0{index + 1}</span>
                    <span className="hidden text-[15px] font-semibold leading-tight sm:block lg:text-base">{item.title}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="relative aspect-[16/10] overflow-hidden bg-cs-panel lg:col-span-7">
          {stages.map((item, index) => (
            <Image
              key={item.title}
              src={item.image.src}
              alt={index === active ? item.image.alt : ""}
              aria-hidden={index !== active}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              placeholder="blur"
              className={`object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-soft)] ${index === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <span className="absolute left-0 top-0 bg-cs-night/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
            Illustrative photo
          </span>
        </div>
        <div key={active} className="cs-swap flex flex-col justify-center lg:col-span-5" aria-live="polite">
          <p className="font-mono text-sm text-cs-sky">Stage 0{active + 1} of 04</p>
          <h3 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-[2.5rem]" style={{ fontStretch: "104%" }}>
            {stage.title}
          </h3>
          <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/80" : "text-cs-ink"}`}>{stage.body}</p>
          <p className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-white/55" : "text-cs-slate"}`}>{stage.detail}</p>
        </div>
      </div>
    </div>
  );
}

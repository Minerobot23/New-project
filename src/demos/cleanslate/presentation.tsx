"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Presentation, X } from "lucide-react";

/**
 * Presentation mode: for walking Clean Slate's management through the concept.
 * Turns on proposal notes inside each section and a presenter dock (← → to move between sections).
 * Opens from the concept bar, the P key, or a shared link ending in ?present=1.
 */

type PresentationState = { on: boolean; setOn: (on: boolean) => void };

const PresentationContext = createContext<PresentationState>({ on: false, setOn: () => {} });

export const usePresentation = () => useContext(PresentationContext);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [on, setOnState] = useState(false);

  // Keep the URL in step so the presenter can copy the current link and get the same mode.
  const setOn = useCallback((next: boolean) => {
    setOnState(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("present", "1");
    else url.searchParams.delete("present");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  useEffect(() => {
    // Read once after hydration; the server render is always the plain site.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL, an external store read once
    if (new URLSearchParams(window.location.search).get("present") === "1") setOnState(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "p" || event.key === "P") setOn(!on);
      else if (event.key === "Escape" && on) setOn(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [on, setOn]);

  const value = useMemo(() => ({ on, setOn }), [on, setOn]);
  return (
    <PresentationContext.Provider value={value}>
      {children}
      {on && <PresenterDock onExit={() => setOn(false)} />}
    </PresentationContext.Provider>
  );
}

export function PresentationToggle({ className = "" }: { className?: string }) {
  const { on, setOn } = usePresentation();
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 font-medium transition-colors ${className}`}
    >
      <Presentation aria-hidden="true" className="size-3.5" strokeWidth={2} />
      {on ? "Exit presentation" : "Presentation mode"}
    </button>
  );
}

/**
 * A proposal note shown at the top of a section in presentation mode.
 * Styled as Fluxline's annotation (dashed rule, mono label) so it never reads as part of Clean Slate's site.
 */
export function Annotation({ n, title, children, tone = "light" }: { n: number; title: string; children: ReactNode; tone?: "light" | "dark" }) {
  const { on } = usePresentation();
  if (!on) return null;
  const dark = tone === "dark";
  return (
    <aside
      aria-label={`Proposal note ${n}: ${title}`}
      className={`cs-swap mb-10 flex max-w-3xl gap-4 border border-dashed p-4 sm:p-5 ${
        dark ? "border-cs-sky/60 bg-cs-blue/15 text-white" : "border-cs-blue/50 bg-cs-blue/[0.04] text-cs-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-8 shrink-0 items-center justify-center font-mono text-xs font-semibold ${dark ? "bg-cs-sky text-cs-night" : "bg-cs-blue text-white"}`}
      >
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <p className={`font-mono text-[10.5px] uppercase tracking-[0.18em] ${dark ? "text-cs-sky" : "text-cs-blue"}`}>
          Fluxline proposal note
        </p>
        <p className="mt-1 text-[15px] font-semibold">{title}</p>
        <div className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/75" : "text-cs-slate"}`}>{children}</div>
      </div>
    </aside>
  );
}

type Step = { id: string; label: string };

/** Floating presenter controls. Sections opt in with data-present="Label" and an id. */
function PresenterDock({ onExit }: { onExit: () => void }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("[data-present][id]")];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the rendered sections once on open
    setSteps(elements.map((element) => ({ id: element.id, label: element.dataset.present ?? element.id })));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(elements.indexOf(entry.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (index: number) => {
      const step = steps[Math.max(0, Math.min(steps.length - 1, index))];
      if (!step) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(step.id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [steps],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [role=slider], input[type=range]")) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        go(current + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(current - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, go]);

  if (steps.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Presenter controls"
      className="cs-swap fixed inset-x-3 bottom-[5.25rem] z-[70] mx-auto flex max-w-xl items-center gap-2 border border-white/15 bg-cs-night/95 p-2 text-white shadow-2xl backdrop-blur md:inset-x-auto md:bottom-5 md:right-5 md:w-[26rem]"
    >
      <button
        type="button"
        onClick={() => go(current - 1)}
        disabled={current === 0}
        aria-label="Previous section"
        className="flex size-10 shrink-0 items-center justify-center hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <div className="min-w-0 flex-1 px-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cs-sky">
          Presenting · {current + 1} / {steps.length}
        </p>
        <p className="truncate text-sm font-medium" aria-live="polite">
          {steps[current]?.label}
        </p>
        <div aria-hidden="true" className="mt-1.5 flex gap-1">
          {steps.map((step, index) => (
            <span key={step.id} className={`h-[3px] flex-1 transition-colors duration-500 ${index <= current ? "bg-cs-sky" : "bg-white/15"}`} />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={current === steps.length - 1}
        aria-label="Next section"
        className="flex size-10 shrink-0 items-center justify-center hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit presentation mode"
        className="flex size-10 shrink-0 items-center justify-center border-l border-white/15 hover:bg-white/10"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

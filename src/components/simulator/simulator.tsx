"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import { Check, Info, Monitor, Smartphone, Sparkles, X, type LucideIcon } from "lucide-react";
import { Car, Scissors, ThermometerSnowflake, UtensilsCrossed } from "lucide-react";
import { track } from "@/lib/analytics";
import { DesktopFrame, PhoneFrame } from "./device-frame";
import { INDUSTRY_DEMOS, INDUSTRY_ORDER } from "./data";
import type { DemoProps, IndustryId, Variant } from "./types";

function DemoLoading() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center text-sm text-muted" aria-busy="true">
      Loading demo…
    </div>
  );
}

// Each industry's demo is its own chunk, so visitors only download the one they're looking at.
const DEMOS: Record<IndustryId, ComponentType<DemoProps>> = {
  home: dynamic(() => import("./demos/home-service"), { loading: DemoLoading }),
  restaurant: dynamic(() => import("./demos/restaurant"), { loading: DemoLoading }),
  salon: dynamic(() => import("./demos/salon"), { loading: DemoLoading }),
  auto: dynamic(() => import("./demos/auto"), { loading: DemoLoading }),
};

const ICONS: Record<IndustryId, LucideIcon> = {
  home: ThermometerSnowflake,
  restaurant: UtensilsCrossed,
  salon: Scissors,
  auto: Car,
};

const SMALL_SCREEN_QUERY = "(max-width: 767px)";
const subscribeSmallScreen = (onChange: () => void) => {
  const query = window.matchMedia(SMALL_SCREEN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getSmallScreen = () => window.matchMedia(SMALL_SCREEN_QUERY).matches;

type SimulatorProps = {
  /** Restrict to these industries (e.g. a single one on an industry page). Defaults to all four. */
  industries?: IndustryId[];
  initialIndustry?: IndustryId;
};

export function WebsiteSimulator({ industries = INDUSTRY_ORDER, initialIndustry }: SimulatorProps) {
  const [industry, setIndustry] = useState<IndustryId>(initialIndustry ?? industries[0]);
  const [variant, setVariant] = useState<Variant>("before");
  // Until the visitor chooses, phones default to the mobile preview: it's the experience most of their customers have.
  const smallScreen = useSyncExternalStore(subscribeSmallScreen, getSmallScreen, () => false);
  const [chosenDevice, setDevice] = useState<"desktop" | "mobile" | null>(null);
  const device = chosenDevice ?? (smallScreen ? "mobile" : "desktop");
  const [note, setNote] = useState<string | null>(null);
  const started = useRef(false);
  const noteTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noteTimer.current), []);

  const markStarted = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track("simulator_started", { industry });
  }, [industry]);

  const chooseIndustry = (id: IndustryId) => {
    if (id === industry) return;
    markStarted();
    setIndustry(id);
    setVariant("before");
    setNote(null);
    track("simulator_industry_changed", { industry: id });
  };

  const chooseVariant = (value: Variant) => {
    if (value === variant) return;
    markStarted();
    setVariant(value);
    setNote(null);
    track(value === "after" ? "simulator_after_viewed" : "simulator_before_viewed", { industry, device });
  };

  const chooseDevice = (value: "desktop" | "mobile") => {
    if (value === device) return;
    markStarted();
    setDevice(value);
    if (value === "mobile") track("simulator_mobile_viewed", { industry, variant });
  };

  const onAction = useCallback(
    (description: string) => {
      markStarted();
      setNote(description);
      window.clearTimeout(noteTimer.current);
      noteTimer.current = window.setTimeout(() => setNote(null), 4500);
    },
    [markStarted],
  );

  const demo = INDUSTRY_DEMOS[industry];
  const Demo = DEMOS[industry];
  const isAfter = variant === "after";
  const Frame = device === "mobile" ? PhoneFrame : DesktopFrame;
  const viewKey = `${industry}-${variant}-${device}`;

  const overlay = (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3">
      {note && (
        <div className="sim-note pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl bg-ink/95 px-3.5 py-2.5 text-[13px] leading-snug text-white shadow-lg">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#6ea8ff]" />
          <span>
            <span className="font-semibold">Concept demo:</span> on a real site, this would {note}.
          </span>
          <button type="button" onClick={() => setNote(null)} aria-label="Dismiss" className="-mr-1 ml-1 text-white/60 hover:text-white">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {industries.length > 1 && (
        <div role="group" aria-label="Choose a business type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {industries.map((id) => {
            const Icon = ICONS[id];
            const selected = id === industry;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseIndustry(id)}
                className={`flex min-h-12 items-center gap-2.5 rounded-2xl border px-4 sm:rounded-full py-2.5 text-left text-sm font-medium transition-colors ${
                  selected ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-soft hover:border-ink/40 hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" className={`size-[18px] shrink-0 ${selected ? "text-[#6ea8ff]" : "text-accent"}`} />
                {INDUSTRY_DEMOS[id].label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Before or after" className="grid grid-cols-2 rounded-full border border-line-strong bg-sunken p-1 sm:w-80">
          {(["before", "after"] as const).map((value) => {
            const selected = variant === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseVariant(value)}
                className={`flex h-11 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] ${
                  selected
                    ? value === "after"
                      ? "bg-accent text-white shadow-sm"
                      : "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {value === "after" && <Sparkles aria-hidden="true" className="size-4" />}
                {value === "before" ? "Before" : "After"}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-xs text-muted sm:hidden">Preview as</p>
          <div role="group" aria-label="Preview device" className="flex rounded-full border border-line-strong bg-surface p-1">
            {(
              [
                ["desktop", Monitor, "Desktop"],
                ["mobile", Smartphone, "Mobile"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={device === value}
                onClick={() => chooseDevice(value)}
                className={`flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors sm:h-9 ${
                  device === value ? "bg-sunken text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-5 grid gap-6 ${device === "desktop" ? "lg:grid-cols-[1fr_300px]" : "md:grid-cols-[1fr_minmax(280px,360px)] md:items-start"}`}>
        <div className="min-w-0">
          <p className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span className="rounded-full border border-line bg-surface px-2 py-0.5 font-semibold uppercase tracking-[0.12em] text-accent">
              Interactive Concept Demo
            </span>
            <span>
              {demo.business} is a fictional {demo.kind}. Try the buttons inside.
            </span>
          </p>
          <div className="sim-fade" key={viewKey}>
            <Frame url={demo.url} overlay={overlay} scrollKey={viewKey}>
              <Demo variant={variant} mobile={device === "mobile"} onAction={onAction} />
            </Frame>
          </div>
        </div>

        <aside aria-live="polite" className="rounded-[1.25rem] border border-line bg-surface p-6">
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${isAfter ? "text-accent" : "text-amber-700"}`}>
            {isAfter ? "What changed" : "What's holding it back"}
          </p>
          <ul className="mt-4 space-y-3.5">
            {demo.changes.map((change) => (
              <li key={change.before} className="flex gap-3 text-[14px] leading-snug">
                {isAfter ? (
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                ) : (
                  <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-700" strokeWidth={2.5} />
                )}
                <span className={isAfter ? "text-ink" : "text-ink-soft"}>{isAfter ? change.after : change.before}</span>
              </li>
            ))}
          </ul>
          {!isAfter ? (
            <button type="button" onClick={() => chooseVariant("after")} className="mt-5 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-300 active:scale-[0.98] hover:bg-accent-strong">
              Show the After version
            </button>
          ) : (
            <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              Illustrative concept. Real results depend on the business, its market, and how the site is used.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

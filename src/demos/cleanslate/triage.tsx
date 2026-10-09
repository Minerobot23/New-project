"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, CircleAlert, CloudLightning, Droplets, Flame, Microscope, Phone } from "lucide-react";
import { business } from "./content";
import { TRIAGE } from "./guides";
import { PREFILL_EVENT } from "./inquiry-form";

const ICONS = { water: Droplets, fire: Flame, mold: Microscope, storm: CloudLightning, boardup: CloudLightning } as const;

/**
 * "What's happening right now?" Useful before it's persuasive: a few safety steps for the next ten minutes,
 * then the two ways to get help. The request button carries the damage type into the form.
 */
export function TriagePanel() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = TRIAGE[active];
  const Icon = ICONS[item.id];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, from: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? TRIAGE.length - 1 : (from + (step ?? 0) + TRIAGE.length) % TRIAGE.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const startRequest = () => {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: item.damage }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("assessment")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="grid gap-px bg-white/10 lg:grid-cols-12">
      <div role="tablist" aria-label="What's happening" aria-orientation="vertical" className="grid grid-cols-2 gap-px bg-white/10 lg:col-span-4 lg:grid-cols-1">
        {TRIAGE.map((entry, index) => {
          const EntryIcon = ICONS[entry.id];
          const selected = index === active;
          return (
            <button
              key={entry.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`cs-triage-tab-${entry.id}`}
              aria-selected={selected}
              aria-controls="cs-triage-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`flex items-center gap-3 p-4 text-left transition-colors sm:p-5 ${selected ? "bg-cs-blue text-white" : "bg-cs-night text-white/70 hover:bg-cs-panel hover:text-white"}`}
            >
              <EntryIcon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
              <span className="text-[15px] font-semibold leading-tight sm:text-base">{entry.label}</span>
            </button>
          );
        })}
      </div>

      <div id="cs-triage-panel" role="tabpanel" aria-labelledby={`cs-triage-tab-${item.id}`} className="bg-cs-night p-6 sm:p-10 lg:col-span-8">
        <div key={item.id} className="cs-swap">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cs-sky">
            <Icon aria-hidden="true" className="size-4" />
            In the next ten minutes
          </p>
          <h3 className="mt-3 font-display text-[1.75rem] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[2.2rem]" style={{ fontStretch: "104%" }}>
            {item.headline}
          </h3>
          <ol className="mt-6 space-y-3">
            {item.steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-[16px] leading-relaxed text-white/85">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center bg-white/10 font-mono text-[11px] text-cs-sky">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-6 flex gap-3 border-l-2 border-cs-alert pl-4 text-[15px] leading-relaxed text-white/70">
            <CircleAlert aria-hidden="true" className="mt-1 size-4 shrink-0 text-cs-alert" />
            {item.avoid}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={business.phoneHref} className="group inline-flex h-12 items-center justify-center gap-2.5 bg-cs-blue px-6 text-[15px] font-semibold text-white hover:bg-cs-blue-deep">
              <Phone aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
              Then call {business.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={startRequest}
              className="inline-flex h-12 items-center justify-center gap-2 px-6 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.4)] hover:bg-white hover:text-cs-ink"
            >
              Or send a request
              <ArrowDown aria-hidden="true" className="size-4" />
            </button>
          </div>
          <p className="mt-6 text-[12.5px] leading-relaxed text-white/45">
            General safety guidance. Always follow instructions from the fire department, your utility, and your insurer.
          </p>
        </div>
      </div>
    </div>
  );
}

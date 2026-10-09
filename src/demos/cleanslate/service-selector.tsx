"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Droplets, Flame, Microscope } from "lucide-react";
import { BASE, primaryServices as services, type ServiceId } from "./content";
import { EmergencyCallButton } from "./chrome";

const ICONS: Record<Exclude<ServiceId, "boardup">, typeof Droplets> = { water: Droplets, fire: Flame, mold: Microscope };

/**
 * Water / Fire & Smoke / Mold: one choice swaps the photograph, the copy, and the call to action.
 * Accessible tabs (roving tabindex, arrow keys). All three photos stay mounted so switching is instant.
 */
export function ServiceSelector() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const service = services[active];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, from: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (from + keys[event.key] + services.length) % services.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = services.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Type of damage" className="grid grid-cols-3 border-b border-cs-ink/15">
        {services.map((item, index) => {
          const Icon = ICONS[item.id as keyof typeof ICONS];
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`cs-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="cs-service-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`group relative flex flex-col items-start gap-2 px-1 pb-5 pt-2 text-left transition-colors sm:flex-row sm:items-center sm:gap-3 sm:px-2 ${
                selected ? "text-cs-ink" : "text-cs-slate hover:text-cs-ink"
              }`}
            >
              <span
                className={`flex size-10 items-center justify-center transition-colors duration-300 ${
                  selected ? "bg-cs-blue text-white" : "bg-cs-mist text-cs-slate group-hover:text-cs-ink"
                }`}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-[15px] font-semibold sm:text-lg">{item.tab}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-[3px] origin-left bg-cs-blue transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div id="cs-service-panel" role="tabpanel" aria-labelledby={`cs-tab-${service.id}`} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden bg-cs-mist lg:col-span-7 lg:aspect-auto lg:min-h-[34rem]">
          {services.map((item, index) => (
            <Image
              key={item.id}
              src={item.image.src}
              alt={index === active ? item.image.alt : ""}
              aria-hidden={index !== active}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              placeholder="blur"
              className={`object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-soft)] ${
                index === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
              }`}
            />
          ))}
          <span className="absolute left-0 top-0 bg-cs-night/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
            Illustrative photo
          </span>
        </div>

        <div key={service.id} className="cs-swap lg:col-span-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cs-blue">{service.tab}</p>
          <h3 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-[2.6rem]" style={{ fontStretch: "104%" }}>
            {service.name}
          </h3>
          <p className="mt-5 text-[17px] leading-relaxed text-cs-slate">{service.lede}</p>

          <h4 className="mt-8 text-sm font-semibold text-cs-ink">How the work goes</h4>
          <ol className="mt-3 divide-y divide-cs-ink/10 border-y border-cs-ink/10">
            {service.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-3.5">
                <span className="w-6 shrink-0 font-mono text-xs leading-6 text-cs-blue">0{index + 1}</span>
                <span className="text-[15px] leading-6">
                  <strong className="font-semibold text-cs-ink">{step.title}.</strong> <span className="text-cs-slate">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <EmergencyCallButton label={service.cta} className="w-full sm:w-auto" />
            <Link
              href={`${BASE}/${service.slug}`}
              className="group inline-flex h-11 items-center justify-center gap-2 px-2 text-sm font-semibold text-cs-ink hover:text-cs-blue"
            >
              {service.name}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

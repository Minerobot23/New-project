"use client";

import { CinematicImage, ContextCTA, originOf } from "@/experience";
import { SERVICE_BY_ID, SERVICES, type ServiceId } from "../content";
import { useAuto } from "../context";

/** One service, shot close: what it involves, how long it takes, and the way to book it. */
export function Service({ id }: { id: ServiceId }) {
  const service = SERVICE_BY_ID[id];
  const { go, back } = useAuto();
  const index = SERVICES.findIndex((item) => item.id === id);
  const next = SERVICES[(index + 1) % SERVICES.length];

  return (
    <>
      <div
        className="absolute inset-0"
        style={
          service.zoom
            ? {
                transform: `scale(${service.zoom})`,
                transformOrigin: `${(service.hero.focus?.x ?? 0.5) * 100}% ${(service.hero.focus?.y ?? 0.5) * 100}%`,
              }
            : undefined
        }
      >
        <CinematicImage image={service.hero} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(4,5,7,0.94)_0%,rgba(4,5,7,0.6)_45%,transparent_75%)] md:bg-[linear-gradient(to_right,rgba(4,5,7,0.92)_0%,rgba(4,5,7,0.6)_34%,transparent_58%)]"
      />

      <button
        type="button"
        onClick={(event) => back(originOf(event.currentTarget))}
        className="label group absolute left-5 top-20 z-20 flex h-11 items-center gap-3 text-bone/85 hover:text-bone sm:left-8 sm:top-24"
      >
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1">
          ←
        </span>
        The bay
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 max-h-[54svh] overflow-y-auto px-5 pb-24 pt-6 text-bone sm:px-8 md:inset-y-0 md:right-auto md:flex md:max-h-none md:w-[min(30rem,42vw)] md:flex-col md:justify-center md:pb-28 md:pt-36">
        <div className="pointer-events-auto">
          <p className="label arrive-in text-[#ff4b3a]">{service.time}</p>
          <h2 data-scene-focus tabIndex={-1} className="condensed arrive-in mt-3 text-[4rem] outline-none sm:text-[6rem]">
            {service.title}
          </h2>
          <p className="arrive-in mt-4 max-w-[36ch] text-[15px] leading-relaxed text-bone/80 [animation-delay:1000ms]">
            {service.line}
          </p>
          <ul className="arrive-in mt-6 border-t border-bone/15 [animation-delay:1100ms]">
            {service.includes.map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-bone/15 py-3 text-[15px]">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-[#ff4b3a]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="arrive-in mt-6 flex flex-wrap items-center gap-4 [animation-delay:1300ms]">
            <ContextCTA onClick={(event) => go("schedule", originOf(event.currentTarget))}>Schedule service</ContextCTA>
            <button
              type="button"
              onClick={(event) => go(next.id, originOf(event.currentTarget))}
              className="label group flex h-11 items-center gap-3 text-bone/70 hover:text-bone"
            >
              Next: {next.title}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
          <p className="mt-5 max-w-[40ch] text-xs leading-relaxed text-bone/50">
            Concept: photos are licensed stand-ins from different cars. A real site shows the shop&apos;s own work.
          </p>
        </div>
      </div>
    </>
  );
}

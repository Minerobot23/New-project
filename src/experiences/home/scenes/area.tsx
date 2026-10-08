"use client";

import Image from "next/image";
import { useState } from "react";
import { CinematicImage, ContextCTA, originOf } from "@/experience";
import { AREA_BY_ID, type AreaId } from "../content";
import { useHome } from "../context";

/**
 * One part of the house: the finished work fills the scene, the gallery swaps the photograph, and the
 * material choice travels with the visitor into the estimate.
 */
export function Area({ id }: { id: AreaId }) {
  const area = AREA_BY_ID[id];
  const { go, back, selections, choose } = useHome();
  const [view, setView] = useState(-1);
  const chosen = selections[id];
  const photo = view === -1 ? area.finished : area.gallery[view];

  return (
    <>
      <CinematicImage key={photo.slot + photo.src.src} image={photo} />

      {/* Shade under the panel so text holds on any photograph. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,10,18,0.92)_0%,rgba(6,10,18,0.55)_45%,transparent_75%)] md:bg-[linear-gradient(to_right,rgba(6,10,18,0.9)_0%,rgba(6,10,18,0.6)_32%,transparent_55%)]"
      />

      <button
        type="button"
        onClick={(event) => back(originOf(event.currentTarget))}
        className="label group absolute left-5 top-20 z-20 flex h-11 items-center gap-3 text-bone/85 hover:text-bone sm:left-8 sm:top-24"
      >
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1">
          ←
        </span>
        The house
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 max-h-[52svh] overflow-y-auto px-5 pb-24 pt-6 text-bone sm:px-8 md:inset-y-0 md:right-auto md:flex md:max-h-none md:w-[min(30rem,42vw)] md:flex-col md:justify-center md:pb-28 md:pt-36">
        <div className="pointer-events-auto">
          <h2
            data-scene-focus
            tabIndex={-1}
            className="arrive-in font-display text-[3rem] font-light uppercase leading-[0.9] tracking-[-0.02em] outline-none sm:text-[4.5rem]"
          >
            {area.title}
          </h2>
          <p className="arrive-in mt-4 max-w-[36ch] text-[15px] leading-relaxed text-bone/80 [animation-delay:1000ms]">
            {area.line}
          </p>

          <fieldset className="arrive-in mt-7 [animation-delay:1100ms]">
            <legend className="label text-bone/60">{area.materialLabel}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {area.materials.map((material) => (
                <button
                  key={material.id}
                  type="button"
                  aria-pressed={chosen === material.label}
                  onClick={() => choose(id, material.label)}
                  className={`flex min-h-11 items-center gap-2.5 px-3 text-sm transition-colors ${
                    chosen === material.label
                      ? "bg-bone text-[#0b1220]"
                      : "text-bone/85 shadow-[inset_0_0_0_1px_rgba(239,234,226,0.3)] hover:shadow-[inset_0_0_0_1px_rgba(239,234,226,0.75)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-4 rounded-full ring-1 ring-black/20"
                    style={{ background: material.swatch }}
                  />
                  {material.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="arrive-in mt-7 [animation-delay:1200ms]">
            <p className="label text-bone/60">Projects</p>
            <div className="mt-3 flex gap-2">
              {[area.finished, ...area.gallery].map((image, index) => {
                const key = index - 1;
                return (
                  <button
                    key={`${image.slot}-${index}`}
                    type="button"
                    aria-pressed={view === key}
                    aria-label={`Show photo: ${image.alt}`}
                    onClick={() => setView(key)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden transition-opacity ${view === key ? "ring-2 ring-bone" : "opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="arrive-in mt-7 space-y-2 text-sm text-bone/75 [animation-delay:1300ms]">
            {area.details.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-[#f2b45c]" />
                {detail}
              </li>
            ))}
          </ul>

          <div className="arrive-in mt-8 [animation-delay:1400ms]">
            <ContextCTA onClick={(event) => go("estimate", originOf(event.currentTarget))}>Get my estimate</ContextCTA>
          </div>
          <p className="mt-5 max-w-[40ch] text-xs leading-relaxed text-bone/50">
            Concept: photos are licensed stand-ins from different homes. A real site shows the client&apos;s own projects.
          </p>
        </div>
      </div>
    </>
  );
}

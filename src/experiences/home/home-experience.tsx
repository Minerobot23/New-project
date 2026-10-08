"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ConceptNote,
  ContextCTA,
  ExperienceLoader,
  ExperienceNavigation,
  MobileExperienceControls,
  SceneStack,
  useSceneDirector,
  type FocalPoint,
} from "@/experience";
import { useExperienceShell } from "../use-experience-shell";
import { CRITICAL_IMAGES, DEFERRED_IMAGES } from "./assets";
import { AREAS, COMPANY, type AreaId } from "./content";
import { HomeContext, SCENE_LABELS, type SceneId } from "./context";
import { House } from "./scenes/house";
import { Area } from "./scenes/area";
import { Estimate } from "./scenes/estimate";

const label = (id: SceneId) => SCENE_LABELS[id];
const isArea = (id: SceneId): id is AreaId => AREAS.some((area) => area.id === id);

/** Saltbox Home Co.: a Fluxline Interactive Concept. The house is the interface. */
export function HomeExperience() {
  const director = useSceneDirector<SceneId>("house");
  const scene = director.current.id;
  const shell = useExperienceShell("home", CRITICAL_IMAGES, DEFERRED_IMAGES, { inside: true });
  const [selections, setSelections] = useState<Partial<Record<AreaId, string>>>({});
  const [visited, setVisited] = useState<AreaId[]>([]);

  const { go: directorGo, back: directorBack } = director;
  const { note, setChromeHidden } = shell;
  const api = useMemo(
    () => ({
      go: (id: SceneId, origin?: FocalPoint) => {
        if (isArea(id)) setVisited((current) => (current.includes(id) ? current : [...current, id]));
        directorGo(id, origin ? { kind: "travel", origin } : { kind: "fade" });
      },
      back: (origin?: FocalPoint) => directorBack("house", origin),
      note,
      selections,
      choose: (area: AreaId, material: string) => setSelections((current) => ({ ...current, [area]: material })),
      visited,
      setChromeHidden,
    }),
    [directorGo, directorBack, note, selections, visited, setChromeHidden],
  );

  const render = useCallback((id: SceneId) => {
    if (id === "house") return <House />;
    if (id === "estimate") return <Estimate />;
    return <Area id={id} />;
  }, []);

  const jump = (id: SceneId) => () => api.go(id);
  const call = () => note(`On a real site this calls ${COMPANY.name}: ${COMPANY.phoneDisplay}.`);

  return (
    <HomeContext.Provider value={api}>
      <div className="fixed inset-0 h-[100svh] overflow-hidden bg-[#060b17] text-bone">
        <SceneStack director={director} label={label} render={render} className="bg-[#060b17]!" />

        <ExperienceNavigation
          brand={
            <button type="button" onClick={() => scene !== "house" && api.back()} className="text-left">
              <span className="block font-display text-lg font-light uppercase leading-none tracking-[0.04em]">
                {COMPANY.name}
              </span>
              <span className="label mt-1 block text-[10px] text-bone/55">{COMPANY.kicker}</span>
            </button>
          }
          credit={
            <p className="label text-bone/60">
              Fluxline interactive concept ·{" "}
              <Link href="/request-a-call?from=home" className="border-b border-bone/50 text-bone hover:border-bone">
                Want this for your business?
              </Link>
            </p>
          }
          exitHref="/#demos"
          exitLabel="All demos"
          items={[
            ...AREAS.map((area) => ({ id: area.id, label: area.title, onSelect: jump(area.id), active: scene === area.id })),
            { id: "call", label: "Call", onSelect: call },
          ]}
          action={
            scene !== "estimate" ? (
              <ContextCTA onClick={jump("estimate")} className="min-h-11">
                Get my estimate
              </ContextCTA>
            ) : undefined
          }
          hidden={shell.showLoader || shell.chromeHidden}
        />

        <MobileExperienceControls
          hidden={shell.showLoader || shell.chromeHidden}
          primary={[
            { id: "house", label: "House", onSelect: () => scene !== "house" && api.back() },
            { id: "kitchen", label: "Kitchen", onSelect: jump("kitchen") },
          ]}
          more={[
            ...AREAS.filter((area) => area.id !== "kitchen").map((area) => ({
              id: area.id,
              label: area.title,
              onSelect: jump(area.id),
            })),
            { id: "call", label: `Call ${COMPANY.phoneDisplay}`, onSelect: call },
            {
              id: "fluxline",
              label: "Want this for your business?",
              onSelect: () => window.location.assign("/request-a-call?from=home"),
            },
          ]}
          sticky={scene !== "estimate" ? { id: "estimate", label: "Estimate", onSelect: jump("estimate") } : undefined}
        />

        <ConceptNote message={shell.message} onDismiss={shell.dismiss} />

        {shell.showLoader && (
          <div
            className={`absolute inset-0 z-50 transition-opacity duration-700 ${shell.loaderFading ? "opacity-0" : "opacity-100"}`}
          >
            <ExperienceLoader
              progress={shell.progress}
              label={`Loading ${COMPANY.name}`}
              mark={
                <div className="text-center">
                  <p className="font-display text-2xl font-light uppercase tracking-[0.06em]">{COMPANY.name}</p>
                  <p className="label mt-3 text-bone/45">Fluxline Interactive Concept</p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </HomeContext.Provider>
  );
}

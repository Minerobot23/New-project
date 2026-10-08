"use client";

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
import { SERVICES, SHOP, type ServiceId } from "./content";
import { AutoContext, SCENE_LABELS, type SceneId } from "./context";
import { Arrival } from "./scenes/arrival";
import { Bay } from "./scenes/bay";
import { Service } from "./scenes/service";
import { Schedule } from "./scenes/schedule";

const label = (id: SceneId) => SCENE_LABELS[id];
const isService = (id: SceneId): id is ServiceId => SERVICES.some((service) => service.id === id);

/** Halden Motor Works: a Fluxline Interactive Concept. The garage door opens, the car is the interface. */
export function AutoExperience() {
  const director = useSceneDirector<SceneId>("arrival");
  const scene = director.current.id;
  const shell = useExperienceShell("automotive", CRITICAL_IMAGES, DEFERRED_IMAGES, { inside: scene !== "arrival" });
  const [visited, setVisited] = useState<ServiceId[]>([]);

  const { go: directorGo, back: directorBack } = director;
  const { note, setChromeHidden } = shell;
  const api = useMemo(
    () => ({
      go: (id: SceneId, origin?: FocalPoint) => {
        if (isService(id)) setVisited((current) => (current.includes(id) ? current : [...current, id]));
        directorGo(id, origin ? { kind: "travel", origin } : { kind: "fade" });
      },
      back: (origin?: FocalPoint) => directorBack("bay", origin),
      note,
      visited,
      setChromeHidden,
      ready: shell.loaderFading || !shell.showLoader,
    }),
    [directorGo, directorBack, note, visited, setChromeHidden, shell.loaderFading, shell.showLoader],
  );

  const render = useCallback((id: SceneId) => {
    if (id === "arrival") return <Arrival />;
    if (id === "bay") return <Bay />;
    if (id === "schedule") return <Schedule />;
    return <Service id={id} />;
  }, []);

  const jump = (id: SceneId) => () => api.go(id);
  const toBay = () => scene !== "bay" && api.go("bay");
  const call = () => note(`On a real site this calls ${SHOP.name}: ${SHOP.phoneDisplay}.`);
  const directions = () => note("On a real site this opens directions to the shop in Maps.");
  const chromeHidden = shell.showLoader || shell.chromeHidden || scene === "arrival";

  return (
    <AutoContext.Provider value={api}>
      <div className="fixed inset-0 h-[100svh] overflow-hidden bg-[#040507] text-bone">
        <SceneStack director={director} label={label} render={render} className="bg-[#040507]!" />

        <ExperienceNavigation
          brand={
            <button type="button" onClick={toBay} className="text-left">
              <span className="condensed block text-xl leading-none">{SHOP.name}</span>
              <span className="label mt-1 block text-[10px] text-bone/55">{SHOP.kicker}</span>
            </button>
          }
          credit={<p className="label text-bone/50">Fluxline Interactive Concept</p>}
          exitHref="/#after"
          items={[
            ...SERVICES.map((service) => ({
              id: service.id,
              label: service.title,
              onSelect: jump(service.id),
              active: scene === service.id,
            })),
            { id: "call", label: "Call", onSelect: call },
            { id: "directions", label: "Directions", onSelect: directions },
          ]}
          action={
            scene !== "schedule" ? (
              <ContextCTA onClick={jump("schedule")} className="min-h-11">
                Schedule service
              </ContextCTA>
            ) : undefined
          }
          hidden={chromeHidden}
        />

        <MobileExperienceControls
          hidden={chromeHidden}
          primary={[
            { id: "bay", label: "Bay", onSelect: toBay },
            { id: "maintenance", label: "Service", onSelect: jump("maintenance") },
          ]}
          more={[
            ...SERVICES.filter((service) => service.id !== "maintenance").map((service) => ({
              id: service.id,
              label: service.title,
              onSelect: jump(service.id),
            })),
            { id: "call", label: `Call ${SHOP.phoneDisplay}`, onSelect: call },
            { id: "directions", label: "Directions", onSelect: directions },
          ]}
          sticky={scene !== "schedule" ? { id: "schedule", label: "Schedule", onSelect: jump("schedule") } : undefined}
        />

        <ConceptNote message={shell.message} onDismiss={shell.dismiss} />

        {shell.showLoader && (
          <div
            className={`absolute inset-0 z-50 transition-opacity duration-700 ${shell.loaderFading ? "opacity-0" : "opacity-100"}`}
          >
            <ExperienceLoader
              progress={shell.progress}
              label={`Loading ${SHOP.name}`}
              mark={
                <div className="text-center">
                  <p className="condensed text-4xl">{SHOP.name}</p>
                  <p className="label mt-3 text-bone/45">Fluxline Interactive Concept</p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </AutoContext.Provider>
  );
}

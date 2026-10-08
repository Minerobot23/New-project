"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ConceptNote,
  ContextCTA,
  ExperienceLoader,
  ExperienceNavigation,
  MobileExperienceControls,
  SceneStack,
  useAssetPreload,
  useSceneDirector,
  warmImages,
  type FocalPoint,
} from "@/experience";
import { CRITICAL_IMAGES, DEFERRED_IMAGES } from "./assets";
import { RESTAURANT } from "./content";
import { VIA_HOME_KEY } from "../keys";
import { RestaurantContext, SCENE_LABELS, type SceneId } from "./context";
import { Arrival } from "./scenes/arrival";
import { Interior } from "./scenes/interior";
import { Bar } from "./scenes/bar";
import { Menu } from "./scenes/menu";
import { Reserve } from "./scenes/reserve";
import { Dish } from "./scenes/dish";
import { PrivateDining } from "./scenes/private-dining";
import { Visit } from "./scenes/visit";
import { Gallery } from "./scenes/gallery";

const subscribeNoop = () => () => {};
// Read once per page load and cached, so clearing the flag below doesn't bring the loader back.
let cachedViaHome: boolean | null = null;
const readViaHome = () => {
  if (cachedViaHome === null) {
    try {
      cachedViaHome = window.sessionStorage.getItem(VIA_HOME_KEY) === "restaurant";
    } catch {
      cachedViaHome = false;
    }
  }
  return cachedViaHome;
};

const label = (id: SceneId) => SCENE_LABELS[id];

/**
 * Maison Arden: a Fluxline Interactive Concept.
 * Composes the experience engine: loader, entrance, a room with hotspots, and rooms beyond it.
 */
export function RestaurantExperience() {
  const viaHome = useSyncExternalStore(subscribeNoop, readViaHome, () => false);
  const director = useSceneDirector<SceneId>("arrival");
  const { progress, done } = useAssetPreload(CRITICAL_IMAGES, {
    minDuration: 300,
  });
  const [loaderGone, setLoaderGone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [chromeHidden, setChromeHidden] = useState(false);
  const noteTimer = useRef<number | undefined>(undefined);
  const inside = director.current.id !== "arrival";
  const showLoader = !viaHome && !loaderGone;

  // Once inside, quietly fetch the rooms the visitor is likely to open next.
  useEffect(() => {
    if (inside) warmImages(DEFERRED_IMAGES);
  }, [inside]);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setLoaderGone(true), 450);
    return () => window.clearTimeout(timer);
  }, [done]);

  useEffect(() => {
    try {
      window.sessionStorage.removeItem(VIA_HOME_KEY);
    } catch {}
    return () => window.clearTimeout(noteTimer.current);
  }, []);

  const { go: directorGo, back: directorBack } = director;
  const api = useMemo(
    () => ({
      go: (id: SceneId, origin?: FocalPoint) => directorGo(id, origin ? { kind: "travel", origin } : { kind: "fade" }),
      back: (origin?: FocalPoint) => directorBack("interior", origin),
      note: (text: string) => {
        setMessage(text);
        window.clearTimeout(noteTimer.current);
        noteTimer.current = window.setTimeout(() => setMessage(null), 6000);
      },
      setChromeHidden,
    }),
    [directorGo, directorBack],
  );

  const render = useCallback(
    (id: SceneId) => {
      switch (id) {
        case "arrival":
          return <Arrival onEntered={() => directorGo("interior", { kind: "cut" })} />;
        case "interior":
          return <Interior />;
        case "bar":
          return <Bar />;
        case "menu":
          return <Menu />;
        case "reserve":
          return <Reserve />;
        case "dish":
          return <Dish />;
        case "private":
          return <PrivateDining />;
        case "visit":
          return <Visit />;
        case "gallery":
          return <Gallery />;
      }
    },
    [directorGo],
  );

  const scene = director.current.id;
  const jump = (id: SceneId) => () => api.go(id);

  return (
    <RestaurantContext.Provider value={api}>
      <div className="fixed inset-0 h-[100svh] overflow-hidden bg-stage text-bone">
        <SceneStack director={director} label={label} render={render} />

        <ExperienceNavigation
          brand={
            <button
              type="button"
              onClick={() => (inside ? scene !== "interior" && api.back() : api.go("interior"))}
              className="font-serif text-2xl leading-none"
            >
              {RESTAURANT.name}
            </button>
          }
          credit={
            <p className="label text-bone/60">
              Fluxline interactive concept ·{" "}
              <Link href="/request-a-call?from=restaurant" className="border-b border-bone/50 text-bone hover:border-bone">
                Want this for your business?
              </Link>
            </p>
          }
          exitHref="/#demos"
          exitLabel="All demos"
          items={
            [
                  {
                    id: "menu",
                    label: "Menu",
                    onSelect: jump("menu"),
                    active: scene === "menu",
                  },
                  {
                    id: "reserve",
                    label: "Reserve",
                    onSelect: jump("reserve"),
                    active: scene === "reserve",
                  },
                  {
                    id: "bar",
                    label: "The bar",
                    onSelect: jump("bar"),
                    active: scene === "bar",
                  },
                  {
                    id: "private",
                    label: "Private dining",
                    onSelect: jump("private"),
                    active: scene === "private",
                  },
                  {
                    id: "gallery",
                    label: "Gallery",
                    onSelect: jump("gallery"),
                    active: scene === "gallery",
                  },
                  {
                    id: "visit",
                    label: "Find us",
                    onSelect: jump("visit"),
                    active: scene === "visit",
                  },
                  {
                    id: "call",
                    label: "Call",
                    onSelect: () => api.note(`On a real site this calls the restaurant: ${RESTAURANT.phoneDisplay}.`),
                  },
                ]
          }
          action={
            scene !== "reserve" ? (
              <ContextCTA onClick={jump("reserve")} className="min-h-11">
                Reserve
              </ContextCTA>
            ) : undefined
          }
          hidden={showLoader || chromeHidden}
        />

        <MobileExperienceControls
          hidden={showLoader || chromeHidden}
          primary={[
            { id: "menu", label: "Menu", onSelect: jump("menu") },
            { id: "bar", label: "Bar", onSelect: jump("bar") },
          ]}
          more={[
            {
              id: "interior",
              label: "The dining room",
              onSelect: () => (inside ? scene !== "interior" && api.back() : api.go("interior")),
            },
            {
              id: "private",
              label: "Private dining",
              onSelect: jump("private"),
            },
            { id: "dish", label: "Tonight's plate", onSelect: jump("dish") },
            { id: "gallery", label: "Gallery", onSelect: jump("gallery") },
            {
              id: "visit",
              label: "Hours & directions",
              onSelect: jump("visit"),
            },
            {
              id: "call",
              label: `Call ${RESTAURANT.phoneDisplay}`,
              onSelect: () => api.note(`On a real site this calls the restaurant: ${RESTAURANT.phoneDisplay}.`),
            },
            {
              id: "fluxline",
              label: "Want this for your business?",
              onSelect: () => window.location.assign("/request-a-call?from=restaurant"),
            },
          ]}
          sticky={scene !== "reserve" ? { id: "reserve", label: "Reserve", onSelect: jump("reserve") } : undefined}
        />

        <ConceptNote message={message} onDismiss={() => setMessage(null)} />

        {showLoader && (
          <div className={`absolute inset-0 z-50 transition-opacity duration-700 ${done ? "opacity-0" : "opacity-100"}`}>
            <ExperienceLoader
              progress={progress}
              label="Loading Maison Arden"
              mark={
                <div className="text-center">
                  <p className="font-serif text-3xl">{RESTAURANT.name}</p>
                  <p className="label mt-3 text-bone/45">Fluxline Interactive Concept</p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </RestaurantContext.Provider>
  );
}

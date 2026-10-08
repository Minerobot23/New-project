"use client";

import { createContext, useContext } from "react";
import type { FocalPoint } from "@/experience";
import type { AreaId } from "./content";

export type SceneId = "arrival" | "house" | AreaId | "estimate";

export const SCENE_LABELS: Record<SceneId, string> = {
  arrival: "Saltbox Home Co.: arriving at the house",
  house: "The house: choose what to transform",
  roof: "Roof",
  siding: "Siding",
  windows: "Windows",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  outdoor: "Outdoor",
  estimate: "Get my estimate",
};

type HomeApi = {
  go: (id: SceneId, origin?: FocalPoint) => void;
  back: (origin?: FocalPoint) => void;
  note: (message: string) => void;
  /** Material chosen per area; carried into the estimate. */
  selections: Partial<Record<AreaId, string>>;
  choose: (area: AreaId, material: string) => void;
  /** Areas the visitor has looked at, in order; the estimate starts with them ticked. */
  visited: AreaId[];
  setChromeHidden: (hidden: boolean) => void;
};

export const HomeContext = createContext<HomeApi | null>(null);

export function useHome() {
  const api = useContext(HomeContext);
  if (!api) throw new Error("useHome must be used inside the home experience");
  return api;
}

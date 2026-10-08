"use client";

import { createContext, useContext } from "react";
import type { FocalPoint } from "@/experience";
import type { ServiceId } from "./content";

export type SceneId = "arrival" | "bay" | ServiceId | "schedule";

export const SCENE_LABELS: Record<SceneId, string> = {
  arrival: "Halden Motor Works: the garage door",
  bay: "The service bay: choose what your car needs",
  paint: "Paint",
  wheels: "Wheels",
  brakes: "Brakes",
  interior: "Interior",
  detailing: "Detailing",
  maintenance: "Maintenance",
  schedule: "Schedule service",
};

type AutoApi = {
  go: (id: SceneId, origin?: FocalPoint) => void;
  back: (origin?: FocalPoint) => void;
  note: (message: string) => void;
  /** Services the visitor has looked at; the booking starts with them ticked. */
  visited: ServiceId[];
  setChromeHidden: (hidden: boolean) => void;
  /** False while the opening loader still covers the scene. */
  ready: boolean;
};

export const AutoContext = createContext<AutoApi | null>(null);

export function useAuto() {
  const api = useContext(AutoContext);
  if (!api) throw new Error("useAuto must be used inside the automotive experience");
  return api;
}

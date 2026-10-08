"use client";

import { createContext, useContext } from "react";
import type { FocalPoint } from "@/experience";

export type SceneId = "arrival" | "interior" | "bar" | "menu" | "reserve" | "dish" | "private" | "visit" | "gallery";

export const SCENE_LABELS: Record<SceneId, string> = {
  arrival: "Maison Arden: the entrance",
  interior: "The dining room",
  bar: "The bar",
  menu: "The menu",
  reserve: "Reserve a table",
  dish: "Tonight's plate",
  private: "Private dining: the Salon",
  visit: "Find us: hours and directions",
  gallery: "Gallery",
};

type RestaurantApi = {
  /** Move to a room. With an origin the camera travels toward that point; without one it crossfades. */
  go: (id: SceneId, origin?: FocalPoint) => void;
  /** Step back out to the previous room. */
  back: (origin?: FocalPoint) => void;
  /** Explain a simulated action (calls, directions, bookings) in a concept. */
  note: (message: string) => void;
  /** Hide the experience chrome while a full-screen task (an enquiry form) has the visitor's attention. */
  setChromeHidden: (hidden: boolean) => void;
};

export const RestaurantContext = createContext<RestaurantApi | null>(null);

export function useRestaurant() {
  const api = useContext(RestaurantContext);
  if (!api) throw new Error("useRestaurant must be used inside the restaurant experience");
  return api;
}

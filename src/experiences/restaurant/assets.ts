import type { ExperienceImage } from "@/experience";
import arrivalEnd from "../../../public/experiences/restaurant/film/arrival-end.webp";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";
import sala from "../../../public/experiences/restaurant/private-dining/sala.webp";
import tableService from "../../../public/experiences/restaurant/food/table-service.webp";
import pastaOverhead from "../../../public/experiences/restaurant/food/pasta-overhead.webp";
import pastaDetail from "../../../public/experiences/restaurant/food/pasta-detail.webp";
import wineGlass from "../../../public/experiences/restaurant/bar/wine-glass.webp";

/**
 * Every photograph in the Maison Arden concept, by capture slot.
 * Slots match ASSET_CAPTURE_GUIDE.md. To turn the concept into a real client's site, shoot each slot,
 * export it to the same path, and update `alt` and `focus` here. Several slots currently share a
 * placeholder (licensed stock); each has its own dedicated shot in the guide.
 */
export const ASSETS = {
  /** Last frame of the arrival film (a 3D render, not a photograph): the room the visitor lands in. */
  arrivalEnd: {
    slot: "film/arrival-end",
    src: arrivalEnd,
    alt: "The dining room at night: a lit back bar with bottles, a chandelier, round tables with candles, and wall lamps",
    focus: { x: 0.5, y: 0.5 },
  },
  mainRoom: {
    slot: "interior/main-room",
    src: mainRoom,
    alt: "The dining room: checked tablecloths, bentwood chairs, a chandelier, and wine signs painted on the back mirror",
    focus: { x: 0.52, y: 0.5 },
  },
  sala: {
    slot: "private-dining/sala",
    src: sala,
    alt: "The private dining salon: tall windows, white tablecloths, gold-rimmed plates, and a marble fireplace",
    focus: { x: 0.55, y: 0.55 },
  },
  tableService: {
    slot: "food/table-service",
    src: tableService,
    alt: "A plated fish course being served at a candlelit table, with bread and wine glasses",
    focus: { x: 0.5, y: 0.55 },
  },
  pastaOverhead: {
    slot: "food/pasta-overhead",
    src: pastaOverhead,
    alt: "Tagliatelle with clams in a blue bowl on a worn wooden table, with red wine",
    focus: { x: 0.32, y: 0.55 },
  },
  pastaDetail: {
    slot: "food/pasta-detail",
    src: pastaDetail,
    alt: "Close-up of pappardelle with wild mushrooms and crisp sage",
    focus: { x: 0.45, y: 0.5 },
  },
  wineGlass: {
    slot: "bar/wine-glass",
    src: wineGlass,
    alt: "A glass of red wine catching warm light at the bar",
    focus: { x: 0.32, y: 0.5 },
  },
} satisfies Record<string, ExperienceImage>;

/** Re-frame a slot on a different subject (same photo, different crop) until a dedicated shot exists. */
export const reframe = (
  image: ExperienceImage,
  focus: { x: number; y: number },
  slot: string,
  alt?: string,
): ExperienceImage => ({
  ...image,
  focus,
  slot,
  alt: alt ?? image.alt,
});

/** Loaded behind the opening screen: the first two scenes. Everything else streams in after entry. */
export const CRITICAL_IMAGES = [{ src: arrivalEnd }];

/** The arrival film: one continuous move from the street into the dining room. See media/README.md. */
export const ARRIVAL_FILM = {
  sources: {
    landscape: "/experiences/restaurant/film/arrival-desktop.mp4",
    portrait: "/experiences/restaurant/film/arrival-mobile.mp4",
  },
  poster: {
    landscape: "/experiences/restaurant/film/arrival-desktop-poster.jpg",
    portrait: "/experiences/restaurant/film/arrival-mobile-poster.jpg",
  },
};

export const DEFERRED_IMAGES = [
  { src: mainRoom },
  { src: wineGlass },
  { src: sala },
  { src: tableService },
  { src: pastaOverhead },
  { src: pastaDetail },
];

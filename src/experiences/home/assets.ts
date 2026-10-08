import type { ExperienceImage } from "@/experience";
import houseDusk from "../../../public/experiences/home/arrival/house-dusk.webp";
import roofMid from "../../../public/experiences/home/roof/mid-project.webp";
import roofCrew from "../../../public/experiences/home/roof/crew.webp";
import sidingMid from "../../../public/experiences/home/siding/mid-project.webp";
import sidingFinished from "../../../public/experiences/home/siding/finished.webp";
import windowsFinished from "../../../public/experiences/home/windows/finished.webp";
import kitchenFinished from "../../../public/experiences/home/kitchen/finished.webp";
import kitchenDetail from "../../../public/experiences/home/kitchen/detail.webp";
import kitchenMid from "../../../public/experiences/home/kitchen/mid-project.webp";
import bathFinished from "../../../public/experiences/home/bathroom/finished.webp";
import bathShower from "../../../public/experiences/home/bathroom/shower.webp";
import bathMid from "../../../public/experiences/home/bathroom/mid-project.webp";
import outdoorNight from "../../../public/experiences/home/outdoor/night.webp";
import outdoorDeck from "../../../public/experiences/home/outdoor/deck.webp";
import porch from "../../../public/experiences/home/gallery/porch.webp";

/**
 * Every photograph in the Saltbox Home Co. concept, by capture slot (see ASSET_CAPTURE_GUIDE.md).
 * Stand-in photography (Unsplash License) from different homes, labeled as such in the experience.
 * A real client's site uses its own during and after shots.
 */
export const ASSETS = {
  house: {
    slot: "arrival/house-dusk",
    src: houseDusk,
    alt: "A two-story timber house at dusk, its windows lit warm against a blue sky",
    focus: { x: 0.5, y: 0.5 },
  },
  roofMid: {
    slot: "roof/mid-project",
    src: roofMid,
    alt: "A roofer stripping old shingles on a sunny day",
    focus: { x: 0.55, y: 0.45 },
  },
  roofCrew: {
    slot: "roof/crew",
    src: roofCrew,
    alt: "A roofer on a ladder at the edge of a brick house's roof",
    focus: { x: 0.5, y: 0.4 },
  },
  sidingMid: {
    slot: "siding/mid-project",
    src: sidingMid,
    alt: "Painters on ladders refinishing a house's clapboard siding",
    focus: { x: 0.5, y: 0.45 },
  },
  sidingFinished: {
    slot: "siding/finished",
    src: sidingFinished,
    alt: "A white clapboard house with a red metal roof and new windows",
    focus: { x: 0.5, y: 0.5 },
  },
  windowsFinished: {
    slot: "windows/finished",
    src: windowsFinished,
    alt: "A bay window seat looking out to green trees through new windows",
    focus: { x: 0.5, y: 0.45 },
  },
  kitchenFinished: {
    slot: "kitchen/finished",
    src: kitchenFinished,
    alt: "A finished white kitchen with shaker cabinets, stainless appliances, and pendant lights over an island",
    focus: { x: 0.5, y: 0.5 },
  },
  kitchenDetail: {
    slot: "kitchen/detail",
    src: kitchenDetail,
    alt: "Marble counters and a gas range in a bright new kitchen",
    focus: { x: 0.5, y: 0.6 },
  },
  kitchenMid: {
    slot: "kitchen/mid-project",
    src: kitchenMid,
    alt: "A carpenter cutting timber on site during a renovation",
    focus: { x: 0.55, y: 0.5 },
  },
  bathFinished: {
    slot: "bathroom/finished",
    src: bathFinished,
    alt: "A finished bathroom with a freestanding tub, a floating vanity, and a plant by the window",
    focus: { x: 0.45, y: 0.55 },
  },
  bathShower: {
    slot: "bathroom/shower",
    src: bathShower,
    alt: "A walk-in glass shower with a rainfall head and a wood vanity",
    focus: { x: 0.5, y: 0.5 },
  },
  bathMid: {
    slot: "bathroom/mid-project",
    src: bathMid,
    alt: "An electrician in a hard hat working on wiring during a renovation",
    focus: { x: 0.6, y: 0.45 },
  },
  outdoorNight: {
    slot: "outdoor/night",
    src: outdoorNight,
    alt: "A lit pool and patio outside a house at night",
    focus: { x: 0.5, y: 0.55 },
  },
  outdoorDeck: {
    slot: "outdoor/deck",
    src: outdoorDeck,
    alt: "Glass doors opening from a living room to a deck and pool",
    focus: { x: 0.5, y: 0.55 },
  },
  porch: { slot: "gallery/porch", src: porch, alt: "A craftsman house with a white porch in autumn", focus: { x: 0.5, y: 0.55 } },
} satisfies Record<string, ExperienceImage>;

export const CRITICAL_IMAGES = [{ src: houseDusk }];
export const DEFERRED_IMAGES = [
  { src: roofMid },
  { src: sidingFinished },
  { src: kitchenFinished },
  { src: bathFinished },
  { src: outdoorNight },
  { src: windowsFinished },
];

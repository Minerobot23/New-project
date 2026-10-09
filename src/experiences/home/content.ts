import type { ExperienceImage } from "@/experience";
import { ASSETS } from "./assets";

/**
 * Saltbox Home Co. is a fictional exterior and remodeling contractor: a Fluxline Interactive Concept.
 * Services, materials, and timelines are illustrative.
 */
export const COMPANY = {
  name: "Saltbox Home Co.",
  kicker: "Exteriors & Remodeling",
  phoneDisplay: "(631) 555-0127",
  serviceArea: "Long Island, New York",
};

export type Material = { id: string; label: string; swatch: string };

export type Area = {
  id: AreaId;
  title: string;
  line: string;
  /** Where the hotspot sits on the house photograph. */
  at: { x: number; y: number };
  align?: "left" | "right";
  finished: ExperienceImage;
  gallery: ExperienceImage[];
  materialLabel: string;
  materials: Material[];
  details: string[];
};

export type AreaId = "roof" | "siding" | "windows" | "kitchen" | "bathroom" | "outdoor";

export const AREAS: Area[] = [
  {
    id: "roof",
    title: "Roof",
    line: "Tear-off to ridge cap in days, not weeks, with the yard left cleaner than we found it.",
    at: { x: 0.6, y: 0.27 },
    align: "left",
    finished: { ...ASSETS.house, focus: { x: 0.6, y: 0.3 } },
    gallery: [ASSETS.roofCrew, ASSETS.roofMid, ASSETS.porch],
    materialLabel: "Shingle",
    materials: [
      { id: "charcoal", label: "Charcoal architectural", swatch: "#2b2d31" },
      { id: "weathered", label: "Weathered wood", swatch: "#6b5a48" },
      { id: "slate", label: "Slate gray", swatch: "#5d6670" },
      { id: "metal", label: "Standing-seam metal", swatch: "#8a2c22" },
    ],
    details: ["Full tear-off and deck inspection", "Ice and water shield at eaves and valleys", "Ridge venting and new flashing"],
  },
  {
    id: "siding",
    title: "Siding",
    line: "New siding changes how the whole house reads from the street, and how it holds up to salt air.",
    at: { x: 0.33, y: 0.5 },
    finished: ASSETS.sidingFinished,
    gallery: [ASSETS.sidingMid, ASSETS.porch, ASSETS.house],
    materialLabel: "Siding",
    materials: [
      { id: "clapboard-white", label: "Clapboard, white", swatch: "#eceae4" },
      { id: "clapboard-harbor", label: "Clapboard, harbor gray", swatch: "#7d8890" },
      { id: "cedar-shake", label: "Cedar shake", swatch: "#a0764e" },
      { id: "board-batten", label: "Board and batten", swatch: "#2f3a40" },
    ],
    details: [
      "House wrap and flashing at every opening",
      "Trim, soffit, and fascia to match",
      "Color samples on the house before we order",
    ],
  },
  {
    id: "windows",
    title: "Windows",
    line: "Quieter rooms, lower bills, and frames that finally match the house.",
    at: { x: 0.455, y: 0.41 },
    finished: ASSETS.windowsFinished,
    gallery: [{ ...ASSETS.house, focus: { x: 0.38, y: 0.35 } }, ASSETS.sidingFinished],
    materialLabel: "Window",
    materials: [
      { id: "double-hung", label: "Double-hung", swatch: "#f2f0ea" },
      { id: "casement", label: "Casement", swatch: "#d9d4ca" },
      { id: "bay", label: "Bay or bow", swatch: "#b9ad9c" },
      { id: "black-frame", label: "Black frames", swatch: "#1d1f21" },
    ],
    details: [
      "Measured and ordered for each opening",
      "Installed from inside in most cases",
      "Interior trim finished the same day",
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    line: "Cabinets, counters, light, and the way the room works when everyone is in it.",
    at: { x: 0.31, y: 0.63 },
    align: "left",
    finished: ASSETS.kitchenFinished,
    gallery: [ASSETS.kitchenDetail, ASSETS.kitchenMid],
    materialLabel: "Finish",
    materials: [
      { id: "white-shaker", label: "White shaker", swatch: "#f3f1ec" },
      { id: "sage", label: "Sage green", swatch: "#8b9a83" },
      { id: "walnut", label: "Walnut", swatch: "#5a3e2b" },
      { id: "quartz", label: "Quartz counters", swatch: "#d8d6d2" },
    ],
    details: ["Design and layout before demolition", "One schedule for every trade", "Dust walls and daily clean-up"],
  },
  {
    id: "bathroom",
    title: "Bathroom",
    line: "A walk-in shower, a tub worth soaking in, and tile that will still look right in twenty years.",
    at: { x: 0.59, y: 0.4 },
    finished: ASSETS.bathFinished,
    gallery: [ASSETS.bathShower, ASSETS.bathMid],
    materialLabel: "Finish",
    materials: [
      { id: "porcelain", label: "Porcelain tile", swatch: "#e6e3dd" },
      { id: "marble", label: "Marble look", swatch: "#cfcac2" },
      { id: "matte-black", label: "Matte black fixtures", swatch: "#1f1f1f" },
      { id: "brass", label: "Brushed brass fixtures", swatch: "#b38b4d" },
    ],
    details: ["Waterproofing behind every wet wall", "Ventilation sized to the room", "Fixtures you choose in person"],
  },
  {
    id: "outdoor",
    title: "Outdoor",
    line: "Decks, patios, and light, so the summer evenings happen outside.",
    at: { x: 0.385, y: 0.84 },
    align: "left",
    finished: ASSETS.outdoorNight,
    gallery: [ASSETS.outdoorDeck, ASSETS.outdoorNight],
    materialLabel: "Build",
    materials: [
      { id: "composite", label: "Composite deck", swatch: "#6e6257" },
      { id: "bluestone", label: "Bluestone patio", swatch: "#56606a" },
      { id: "lighting", label: "Landscape lighting", swatch: "#f2b45c" },
      { id: "kitchen", label: "Outdoor kitchen", swatch: "#9a9a96" },
    ],
    details: ["Footings and permits handled", "Low-voltage lighting planned with the build", "Drainage before decoration"],
  },
];

export const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area])) as Record<AreaId, Area>;

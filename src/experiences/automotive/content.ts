import type { ExperienceImage } from "@/experience";
import { ASSETS } from "./assets";

/**
 * Halden Motor Works is a fictional independent service and detailing shop: a Fluxline Interactive Concept.
 * Services and times are illustrative.
 */
export const SHOP = {
  name: "Halden Motor Works",
  kicker: "Service & Detailing",
  phoneDisplay: "(516) 555-0163",
  hours: "Monday to Friday 7:30 to 6, Saturday 8 to 2",
};

export type ServiceId = "paint" | "wheels" | "brakes" | "interior" | "detailing" | "maintenance";

export type Service = {
  id: ServiceId;
  title: string;
  line: string;
  /** Where the hotspot sits on the vehicle photograph. */
  at: { x: number; y: number };
  align?: "left" | "right";
  hero: ExperienceImage;
  /** Zoom on the hero, for frames where the subject is a detail of a wider shot. */
  zoom?: number;
  includes: string[];
  time: string;
};

export const SERVICES: Service[] = [
  {
    id: "maintenance",
    title: "Maintenance",
    line: "Oil, filters, fluids, and a proper look at everything else while the car is on the lift.",
    at: { x: 0.66, y: 0.44 },
    hero: ASSETS.underHood,
    includes: [
      "Synthetic oil and filter",
      "Fluids topped and checked",
      "Multi-point inspection with photos",
      "Check-engine diagnostics",
    ],
    time: "About an hour",
  },
  {
    id: "interior",
    title: "Interior",
    line: "Seats, carpets, glass, and the smell of a car someone cares about.",
    at: { x: 0.76, y: 0.36 },
    align: "left",
    hero: ASSETS.cockpit,
    includes: ["Steam clean and extraction", "Leather cleaned and conditioned", "Glass inside and out", "Odor treatment"],
    time: "Half a day",
  },
  {
    id: "paint",
    title: "Paint",
    line: "Swirls and haze corrected, then protected so it stays like this.",
    at: { x: 0.88, y: 0.5 },
    align: "left",
    hero: ASSETS.paintCloseUp,
    includes: ["Decontamination wash and clay", "One- or two-step correction", "Ceramic coating options", "Touch-up for chips"],
    time: "One to two days",
  },
  {
    id: "detailing",
    title: "Detailing",
    line: "A full reset, outside and in, done by hand.",
    at: { x: 0.47, y: 0.57 },
    hero: ASSETS.pressureWash,
    includes: ["Foam pre-wash and hand wash", "Wheels, tires, and arches", "Interior refresh", "Sealant to finish"],
    time: "Most of a day",
  },
  {
    id: "brakes",
    title: "Brakes",
    line: "Pads, rotors, and fluid, measured and explained before anything is replaced.",
    at: { x: 0.86, y: 0.68 },
    align: "left",
    hero: ASSETS.caliper,
    zoom: 1.7,
    includes: ["Pad and rotor measurement", "Brake fluid test and flush", "Caliper service", "Road test after"],
    time: "Two to three hours",
  },
  {
    id: "wheels",
    title: "Wheels",
    line: "Tires mounted, balanced, and aligned, and your seasonal set stored here.",
    at: { x: 0.88, y: 0.82 },
    align: "left",
    hero: ASSETS.tires,
    includes: [
      "Mount and road-force balance",
      "Four-wheel alignment",
      "Seasonal swap and storage",
      "Wheel refinishing referrals",
    ],
    time: "About an hour",
  },
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((service) => [service.id, service])) as Record<ServiceId, Service>;

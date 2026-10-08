import type { ExperienceImage } from "@/experience";
import garageDoor from "../../../public/experiences/automotive/arrival/garage-door.webp";
import vehicle from "../../../public/experiences/automotive/bay/vehicle.webp";
import serviceBay from "../../../public/experiences/automotive/bay/service-bay.webp";
import tools from "../../../public/experiences/automotive/bay/tools.webp";
import paintCloseUp from "../../../public/experiences/automotive/paint/close-up.webp";
import handWash from "../../../public/experiences/automotive/paint/hand-wash.webp";
import tires from "../../../public/experiences/automotive/wheels/tires.webp";
import caliper from "../../../public/experiences/automotive/brakes/caliper.webp";
import cockpit from "../../../public/experiences/automotive/interior/cockpit.webp";
import pressureWash from "../../../public/experiences/automotive/detailing/pressure-wash.webp";
import oil from "../../../public/experiences/automotive/maintenance/oil.webp";
import underHood from "../../../public/experiences/automotive/maintenance/under-hood.webp";
import engine from "../../../public/experiences/automotive/maintenance/engine.webp";

/**
 * Every photograph in the Halden Motor Works concept, by capture slot (see ASSET_CAPTURE_GUIDE.md).
 * Stand-in photography (Unsplash License); license plates are blurred.
 */
export const ASSETS = {
  garageDoor: {
    slot: "arrival/garage-door",
    src: garageDoor,
    alt: "A dark coupe under red light in a service bay, garage doors behind it",
    focus: { x: 0.55, y: 0.55 },
  },
  vehicle: {
    slot: "bay/vehicle",
    src: vehicle,
    alt: "A white sports car lit in a dark garage, other cars on lifts behind it",
    focus: { x: 0.7, y: 0.55 },
  },
  serviceBay: {
    slot: "bay/service-bay",
    src: serviceBay,
    alt: "Inside a workshop at night: a classic car's tail lights and a strip light over the bench",
    focus: { x: 0.6, y: 0.5 },
  },
  tools: { slot: "bay/tools", src: tools, alt: "A wall of wrenches and tools in the shop", focus: { x: 0.5, y: 0.5 } },
  paintCloseUp: {
    slot: "paint/close-up",
    src: paintCloseUp,
    alt: "Deep blue paint and a headlight, reflections sharp after correction",
    focus: { x: 0.3, y: 0.45 },
  },
  handWash: {
    slot: "paint/hand-wash",
    src: handWash,
    alt: "A detailer hand-washing a black car with two buckets",
    focus: { x: 0.55, y: 0.55 },
  },
  tires: { slot: "wheels/tires", src: tires, alt: "Stacked tires in the tire room", focus: { x: 0.45, y: 0.5 } },
  caliper: {
    slot: "brakes/caliper",
    src: caliper,
    alt: "A gray coupe with yellow brake calipers behind black wheels",
    focus: { x: 0.74, y: 0.6 },
  },
  cockpit: {
    slot: "interior/cockpit",
    src: cockpit,
    alt: "A driver's hands on the wheel, the dashboard lit at dusk",
    focus: { x: 0.5, y: 0.5 },
  },
  pressureWash: {
    slot: "detailing/pressure-wash",
    src: pressureWash,
    alt: "A black car being pressure-washed, spray catching the light",
    focus: { x: 0.45, y: 0.5 },
  },
  oil: { slot: "maintenance/oil", src: oil, alt: "Fresh oil being poured into an engine", focus: { x: 0.6, y: 0.4 } },
  underHood: {
    slot: "maintenance/under-hood",
    src: underHood,
    alt: "A technician working under an open hood",
    focus: { x: 0.45, y: 0.5 },
  },
  engine: {
    slot: "maintenance/engine",
    src: engine,
    alt: "Belts and pulleys on the front of an engine",
    focus: { x: 0.5, y: 0.5 },
  },
} satisfies Record<string, ExperienceImage>;

export const CRITICAL_IMAGES = [{ src: garageDoor }, { src: vehicle }];
export const DEFERRED_IMAGES = [
  { src: paintCloseUp },
  { src: tires },
  { src: caliper },
  { src: cockpit },
  { src: pressureWash },
  { src: underHood },
  { src: serviceBay },
];

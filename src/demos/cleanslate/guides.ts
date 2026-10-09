import type { ServiceId } from "./content";

/*
 * Helpful, non-salesy content that earns the call: what to do in the first minutes,
 * how insurance claims usually go, and plain answers. General safety and insurance guidance only;
 * every page that shows it says to follow fire department, utility, and insurer instructions.
 */

export const SOURCES = {
  epa: { label: "EPA: A Brief Guide to Mold, Moisture and Your Home", href: "https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home" },
  floodsmart: { label: "FloodSmart.gov (FEMA National Flood Insurance Program)", href: "https://www.floodsmart.gov/" },
} as const;

export type Triage = {
  id: ServiceId | "storm";
  label: string;
  /** Damage value to prefill in the request form. */
  damage: string;
  headline: string;
  steps: string[];
  avoid: string;
};

export const TRIAGE: Triage[] = [
  {
    id: "water",
    label: "Water or flooding",
    damage: "Water or flooding",
    headline: "Stop the water, then stay safe around it.",
    steps: [
      "Shut off the main water valve if the source is a pipe or appliance.",
      "Turn off power to wet areas only if you can reach the panel without standing in water.",
      "Move valuables and electronics out of the water's path.",
      "Photograph the water, the source, and damaged items before cleanup.",
    ],
    avoid: "Don't use a household vacuum on standing water, and stay out of rooms where water may be near outlets.",
  },
  {
    id: "fire",
    label: "Fire or smoke",
    damage: "Fire or smoke",
    headline: "Wait for the all-clear, then protect what's left.",
    steps: [
      "Don't go back inside until the fire department says it's safe.",
      "Leave utilities and HVAC off until they've been checked.",
      "Photograph damage room by room, including smoke on walls and ceilings.",
      "Keep receipts for anything you spend on lodging, food, or supplies.",
    ],
    avoid: "Don't wipe soot off walls or fabrics; it can smear and set. Professional cleaning works better.",
  },
  {
    id: "mold",
    label: "Mold",
    damage: "Mold",
    headline: "Contain it, don't disturb it.",
    steps: [
      "Stop the moisture source if it's obvious, such as a leak or condensation.",
      "Keep fans and HVAC from blowing air across the growth.",
      "Keep children and anyone with breathing problems away from the area.",
      "Note where you smell mustiness, even if you can't see growth.",
    ],
    avoid: "Don't scrub or tear out large areas yourself; disturbing mold spreads spores through the house.",
  },
  {
    id: "storm",
    label: "Storm or break-in",
    damage: "Board-up needed",
    headline: "Secure the opening and keep the weather out.",
    steps: [
      "Stay clear of broken glass, downed wires, and damaged structure.",
      "Move belongings away from open windows, doors, and roof openings.",
      "Photograph the damage from inside and out.",
      "Report a break-in to the police before anything is repaired.",
    ],
    avoid: "Don't climb onto a damaged roof. Emergency board-up and tarping are jobs for a crew with equipment.",
  },
];

/** How a restoration claim usually goes. General information, not insurance or legal advice. */
export const CLAIM_STEPS = [
  {
    title: "Prevent further damage",
    body: "Insurers generally expect reasonable steps to limit damage, like stopping water, drying, and boarding up. Emergency work usually shouldn't wait for the adjuster.",
  },
  {
    title: "Document before cleanup",
    body: "Photos and video of the damage, the source, and affected belongings, taken before anything moves, are the record your claim is built on.",
  },
  {
    title: "Report the claim promptly",
    body: "Call your insurer or agent, get a claim number, and ask what they need from you and from the restoration company.",
  },
  {
    title: "Keep damaged items and receipts",
    body: "Ask before discarding anything the adjuster may want to see, and keep receipts for emergency expenses such as lodging and supplies.",
  },
];

export const HOME_FAQS = [
  {
    q: "Is someone really available 24/7?",
    a: "Yes. Clean Slate Services offers 24/7 emergency service at (631) 977-9300. The office is open Monday to Friday, 8 AM to 5 PM, for non-emergency questions.",
  },
  {
    q: "Do you work with insurance companies?",
    a: "Yes. Clean Slate works with your insurance company to make the process as smooth as possible. What's covered depends on your policy and your insurer.",
  },
  {
    q: "What areas do you serve?",
    a: "Long Island, the five boroughs of New York City, and the Tri-State Area, from a home base in Oakdale, NY. Each area has its own page with local details.",
  },
  {
    q: "Is the consultation free?",
    a: "Yes. Consultations are free, so you can understand the damage and your options before deciding anything.",
  },
  {
    q: "Can you rebuild after the cleanup?",
    a: "Yes. Clean Slate also handles construction and home remodeling, so restoration and rebuilding can stay with one company.",
  },
];

/**
 * Rough ZIP check for the request form: 3-digit prefixes for the areas Clean Slate lists.
 * A hint, not a promise of coverage; anything else is told to call and confirm.
 */
const ZIP_AREAS: [RegExp, string][] = [
  [/^10[0-2]/, "Manhattan"],
  [/^103/, "Staten Island"],
  [/^104/, "the Bronx"],
  [/^112/, "Brooklyn"],
  [/^11[1346]/, "Queens"],
  [/^110/, "Queens or western Nassau"],
  [/^11[5789]/, "Long Island"],
  [/^0647[0-9]|^06482/, "the Newtown, CT area"],
];

export function zipArea(zip: string): string | null {
  if (!/^\d{5}$/.test(zip)) return null;
  return ZIP_AREAS.find(([pattern]) => pattern.test(zip))?.[1] ?? null;
}

/**
 * What a check of cleanslateservicesny.com found on October 9, 2026 (desktop and phone, Chromium),
 * each paired with how this concept handles it. Observations only; nothing here is a guess.
 */
export const AUDIT = [
  {
    found: "The homepage headline (H1) is “Home Remodeling Long Island NY”, and the line above it is cut off: “Emergency disaster cleanup and…”.",
    fix: "The first screen is about emergency water, fire, and mold restoration, with the phone call as the main action.",
  },
  {
    found: "On phones, the header link that shows 631-977-9300 dials 631-417-3213, as does the “Call us today” button. A third number, (888) 689-1226, is in the location pages' code.",
    fix: "One number, (631) 977-9300, displayed and dialed everywhere. If 417-3213 is a call-tracking line, the site should show that same number.",
  },
  {
    found: "The footer “Sitemap” link on every page points to hydrohero.com/sitemap.xml, another company's website.",
    fix: "A real sitemap for the site, linked in the footer.",
  },
  {
    found: "Two internal links return “page not found”: /emergency-board-up-service-in-albertson-ny and /mold-remediation-in-brookhaven-ny.",
    fix: "Every link checked automatically before launch.",
  },
  {
    found: "The homepage title is just “Home” with no description; the contact and blog pages have no description either.",
    fix: "A specific title and description on every page.",
  },
  {
    found: "Location pages repeat one template with the city swapped in. Their titles read “Clean State Services”, /locations/brookhaven-ny is about Oakdale, and /locations/newton-ct is about Newtown.",
    fix: "Eight location pages written for their place, with correct names and a redirect from the misspelled address.",
  },
  {
    found: "The forms ask for name, email, phone, and a message, but not the type of damage, the location, or how urgent it is.",
    fix: "A two-step request built around damage type, urgency, and ZIP code.",
  },
  {
    found: "The Emergency Board-Up page has no main heading (H1), and 7 of 13 images on the homepage have no alt text.",
    fix: "One H1 per page and descriptive alt text on every image.",
  },
];

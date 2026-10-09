import type { StaticImageData } from "next/image";
import heroStorm from "../../../public/demos/cleanslate/hero-storm.webp";
import waterCeiling from "../../../public/demos/cleanslate/water-ceiling.webp";
import waterFlood from "../../../public/demos/cleanslate/water-flood.webp";
import fireHome from "../../../public/demos/cleanslate/fire-home.webp";
import fireInterior from "../../../public/demos/cleanslate/fire-interior.webp";
import moldWall from "../../../public/demos/cleanslate/mold-wall.webp";
import moldTechnician from "../../../public/demos/cleanslate/mold-technician.webp";
import rebuildFraming from "../../../public/demos/cleanslate/rebuild-framing.webp";
import rebuildPlaster from "../../../public/demos/cleanslate/rebuild-plaster.webp";
import rebuildTearout from "../../../public/demos/cleanslate/rebuild-tearout.webp";
import finishedLiving from "../../../public/demos/cleanslate/finished-living.webp";
import finishedLounge from "../../../public/demos/cleanslate/finished-lounge.webp";
import finishedDen from "../../../public/demos/cleanslate/finished-den.webp";
import guttedRoom from "../../../public/demos/cleanslate/gutted-room.webp";

/**
 * Clean Slate Services: an unsolicited redesign concept, not their official website.
 *
 * Every business fact below was taken from https://www.cleanslateservicesny.com (October 2026):
 * name, phone, email, address, hours, services, locations, social profiles, insurance coordination,
 * mold sampling, and the one review quoted. Nothing else is claimed. Photography is Unsplash-licensed
 * stock (docs/PHOTO-CREDITS.md) and is labeled on the page as illustrative, never as their work.
 */

export const BASE = "/demos/cleanslate";

export const business = {
  name: "Clean Slate Services",
  legalName: "Clean Slate Services, Inc.",
  phoneDisplay: "(631) 977-9300",
  phoneHref: "tel:6319779300",
  phoneE164: "+16319779300",
  email: "office@cleanslateservicesny.com",
  street: "186 Locust Ave",
  city: "Oakdale",
  region: "NY",
  postalCode: "11769",
  officialSite: "https://www.cleanslateservicesny.com",
  officeHours: "Office: Mon–Fri, 8:00 AM – 5:00 PM",
  social: [
    { label: "Instagram", href: "https://instagram.com/cleanslateservicesny_" },
    { label: "TikTok", href: "https://tiktok.com/@cleanslateservicesny" },
    { label: "YouTube", href: "https://www.youtube.com/@cleanslateservicesny" },
  ],
} as const;

/** Areas named on their current site (location pages and service-area copy). */
export const serviceAreas = [
  { name: "Oakdale", note: "Home base, Suffolk County" },
  { name: "Long Island", note: "Nassau and Suffolk" },
  { name: "Brookhaven", note: "Suffolk County" },
  { name: "Queens", note: "New York City" },
  { name: "Brooklyn", note: "New York City" },
  { name: "Manhattan", note: "New York City" },
  { name: "The Bronx", note: "New York City" },
  { name: "Staten Island", note: "New York City" },
  { name: "Newtown, CT", note: "Tri-State Area" },
] as const;

export type Photo = { src: StaticImageData; alt: string };

export const photos = {
  hero: { src: heroStorm, alt: "Lightning over a house at night" },
  waterCeiling: { src: waterCeiling, alt: "A room whose ceiling has come down after a leak" },
  waterFlood: { src: waterFlood, alt: "Floodwater surrounding a single-story home" },
  fireHome: { src: fireHome, alt: "A two-story home with fire damage along the roofline" },
  fireInterior: { src: fireInterior, alt: "Charred beams inside a fire-damaged structure" },
  moldWall: { src: moldWall, alt: "Dark mold growth spreading across a wall" },
  moldTechnician: { src: moldTechnician, alt: "Technician in a protective suit and gloves inside a home" },
  rebuildFraming: { src: rebuildFraming, alt: "A room stripped to its framing during reconstruction" },
  rebuildPlaster: { src: rebuildPlaster, alt: "Hands applying plaster to a wall with trowels" },
  rebuildTearout: { src: rebuildTearout, alt: "Removed drywall piled during tear-out" },
  finishedLiving: { src: finishedLiving, alt: "A finished living room with an open kitchen" },
  finishedLounge: { src: finishedLounge, alt: "A finished, bright living room" },
  finishedDen: { src: finishedDen, alt: "A finished den with a fireplace" },
  guttedRoom: { src: guttedRoom, alt: "A gutted room with peeling walls and a damaged floor" },
} satisfies Record<string, Photo>;

export type ServiceId = "water" | "fire" | "mold";

export type Service = {
  id: ServiceId;
  /** Kept identical to the slug on their current site, so a migration preserves the URL. */
  slug: string;
  currentUrl: string;
  tab: string;
  name: string;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  signs: string[];
  steps: { title: string; body: string }[];
  cta: string;
  image: Photo;
  detail: Photo;
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    id: "water",
    slug: "flood-and-water-damage",
    currentUrl: "https://www.cleanslateservicesny.com/flood-and-water-damage",
    tab: "Water Damage",
    name: "Water Damage Restoration",
    pageTitle: "Water Damage Restoration & Flood Cleanup | Long Island & NYC",
    metaDescription:
      "24/7 water damage restoration and flood cleanup from Clean Slate Services in Oakdale, NY. Burst pipes, water heater leaks, and flooding across Long Island, NYC, and the Tri-State Area. Call (631) 977-9300.",
    h1: "Water damage restoration and flood cleanup",
    lede: "Burst pipes, failed water heaters, roof leaks, and storm flooding. Water keeps moving into floors and walls after it stops being visible, so the first hours matter most.",
    signs: [
      "Standing water, or water coming through a ceiling",
      "Soft, stained, or bulging drywall",
      "Warped or cupping floors",
      "A musty smell after a leak was fixed",
    ],
    steps: [
      { title: "Stop and extract", body: "Find the source, stop the water, and extract what is standing." },
      { title: "Dry the structure", body: "Set drying equipment and track moisture until materials are back to dry." },
      { title: "Remove what can't be saved", body: "Saturated drywall, insulation, and flooring come out, documented for your claim." },
      { title: "Rebuild", body: "Drywall, flooring, paint, and trim, finished by the same team." },
    ],
    cta: "Water emergency? Call now",
    image: photos.waterCeiling,
    detail: photos.waterFlood,
    faqs: [
      {
        q: "Are you available after hours for water emergencies?",
        a: "Yes. Clean Slate Services offers 24/7 emergency service. The office keeps regular hours Monday to Friday, 8 AM to 5 PM.",
      },
      {
        q: "Will you work with my insurance company?",
        a: "Clean Slate Services works with your insurance company to make the process as smooth as possible. Coverage depends on your policy and your insurer.",
      },
      {
        q: "What kinds of water damage do you handle?",
        a: "Floods and storms, burst pipes, and water heater leaks, among others, in homes and businesses.",
      },
    ],
  },
  {
    id: "fire",
    slug: "fire-restoration",
    currentUrl: "https://www.cleanslateservicesny.com/fire-restoration",
    tab: "Fire & Smoke",
    name: "Fire & Smoke Damage Restoration",
    pageTitle: "Fire & Smoke Damage Restoration | Long Island & NYC",
    metaDescription:
      "Fire and smoke damage restoration from Clean Slate Services in Oakdale, NY: emergency board-up, soot and odor cleanup, and rebuilding across Long Island, NYC, and the Tri-State Area. Call (631) 977-9300.",
    h1: "Fire and smoke damage restoration",
    lede: "A fire leaves three kinds of damage: the burn, the smoke and soot that travel through the house, and the water used to put it out. Each needs its own work.",
    signs: [
      "Soot on walls, ceilings, and contents",
      "Smoke odor that lingers after airing out",
      "Openings in walls, windows, or the roof",
      "Water damage from firefighting",
    ],
    steps: [
      { title: "Secure the property", body: "Emergency board-up of windows, doors, and openings to keep weather and intruders out." },
      { title: "Clean soot and smoke", body: "Remove residue from surfaces and contents that can be saved." },
      { title: "Treat odor", body: "Address the smoke smell at the source, not with cover-up fragrance." },
      { title: "Rebuild", body: "Structural repair and finish work to bring the home back." },
    ],
    cta: "Fire or smoke damage? Call now",
    image: photos.fireHome,
    detail: photos.fireInterior,
    faqs: [
      {
        q: "Do you board up a property after a fire?",
        a: "Yes. Emergency board-up service is one of Clean Slate Services' core services.",
      },
      {
        q: "Can you rebuild after the cleanup?",
        a: "Clean Slate Services also handles construction and home remodeling, so restoration and rebuilding can stay with one company.",
      },
      {
        q: "Will you work with my insurance company?",
        a: "Clean Slate Services works with your insurance company to make the process as smooth as possible. Coverage depends on your policy and your insurer.",
      },
    ],
  },
  {
    id: "mold",
    slug: "mold-remediation",
    currentUrl: "https://www.cleanslateservicesny.com/mold-remediation",
    tab: "Mold Remediation",
    name: "Mold Remediation",
    pageTitle: "Mold Remediation & Removal | Long Island & NYC",
    metaDescription:
      "Mold remediation from Clean Slate Services in Oakdale, NY, for homes, basements, and crawl spaces, with samples taken before and after. Serving Long Island, NYC, and the Tri-State Area. Call (631) 977-9300.",
    h1: "Mold remediation for homes, basements, and crawl spaces",
    lede: "Mold follows moisture. It can cause health problems, leave a home smelling musty, and lower its value, so removal has to deal with the moisture source as well as the growth.",
    signs: [
      "A musty smell in a basement or crawl space",
      "Visible growth on walls, ceilings, or around windows",
      "Recurring condensation or a past leak",
      "Peeling paint or staining that keeps coming back",
    ],
    steps: [
      { title: "Inspect and sample", body: "Find the growth and the moisture behind it, and take samples before work starts." },
      { title: "Contain", body: "Isolate the work area so spores don't spread to the rest of the home." },
      { title: "Remove and clean", body: "Remove affected materials and clean what remains." },
      { title: "Verify", body: "Take samples again afterward to confirm the work was effective." },
    ],
    cta: "Found mold? Call now",
    image: photos.moldTechnician,
    detail: photos.moldWall,
    faqs: [
      {
        q: "How do you know the mold is gone?",
        a: "Clean Slate Services takes samples before and after remediation to verify the effectiveness of the work.",
      },
      {
        q: "Do you handle basements and crawl spaces?",
        a: "Yes. Clean Slate Services removes mold and moisture from homes, crawl spaces, and basements.",
      },
      {
        q: "What areas do you serve?",
        a: "Long Island, the five boroughs of New York City, and the Tri-State Area, from a home base in Oakdale, NY.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((service) => service.slug === slug);

export type Stage = { title: string; body: string; detail: string; image: Photo };

export const stages: Stage[] = [
  {
    title: "Emergency Contact",
    body: "One call to the 24/7 line. A coordinator takes the address, what happened, and what's affected, and arranges the visit.",
    detail: "You're told what to do while you wait: shut off the water, stay out of smoke-damaged rooms, keep fans off suspected mold.",
    image: photos.waterFlood,
  },
  {
    title: "Damage Assessment",
    body: "Moisture readings, soot mapping, or mold sampling find the full extent, including what's behind walls and under floors.",
    detail: "The findings become a written scope, with the photos and documentation an insurance claim asks for.",
    image: photos.rebuildTearout,
  },
  {
    title: "Mitigation & Cleanup",
    body: "Water extraction and structural drying, soot and odor removal, or mold containment and removal.",
    detail: "What can be saved is cleaned and dried. What can't is removed, so the problem doesn't come back behind new drywall.",
    image: photos.moldTechnician,
  },
  {
    title: "Restoration",
    body: "Drywall, flooring, paint, and finish carpentry, by a company that also does construction and home improvement.",
    detail: "The job ends with a finished room, not an open wall and a referral to someone else.",
    image: photos.rebuildPlaster,
  },
];

/** Illustrative pairs: unrelated stock photos chosen to show the gallery format, labeled as such on the page. */
export const comparisons = [
  { label: "Interior rebuild", before: photos.guttedRoom, after: photos.finishedLounge },
  { label: "Leak-damaged ceiling", before: photos.waterCeiling, after: photos.finishedDen },
  { label: "Framing to finish", before: photos.rebuildFraming, after: photos.finishedLiving },
] as const;

/** The one customer review on their current homepage, quoted verbatim with its source. */
export const publishedReview = {
  title: "Truly professional",
  quote:
    "I scheduled an appointment for a repair quote. They came the same day and then scheduled the work to be done within 48 hours. The work was performed by Ron who was both a pleasure to deal with and the work performed by him was truly professional. I would definitely use the company again for any services I would need and highly recommend them.",
  author: "Kevin S.",
  source: "Published on cleanslateservicesny.com",
} as const;

/** The proposal: what the concept changes, and why it matters to an emergency-services business. */
export const improvements = [
  {
    title: "Stronger first impression",
    body: "The first screen says what happened, what to do, and who to call. Calm, dark, and premium, the way a homeowner wants their restoration company to feel at 2 AM.",
  },
  {
    title: "Faster emergency contact",
    body: "The phone number is one tap from every screen: in the header, in the hero, in a bar that stays on phones, and beside every service.",
  },
  {
    title: "Clearer service navigation",
    body: "Water, fire, and mold each get a selector on the homepage and a dedicated page, so visitors land on the problem they actually have.",
  },
  {
    title: "Better mobile usability",
    body: "Thumb-sized buttons, a persistent call bar, and a short form designed for someone standing in a wet basement with one hand free.",
  },
  {
    title: "Local SEO foundations",
    body: "Semantic headings, one service per page, LocalBusiness structured data from verified details, and the current URLs kept as they are.",
  },
  {
    title: "More effective lead capture",
    body: "The inquiry asks for damage type, ZIP code, and urgency up front, so the office can triage a call before calling back.",
  },
] as const;

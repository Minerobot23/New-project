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
import finishedBasement from "../../../public/demos/cleanslate/finished-basement.webp";
import finishedBasementStairs from "../../../public/demos/cleanslate/finished-basement-stairs.webp";
import finishedExterior from "../../../public/demos/cleanslate/finished-exterior.webp";

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
  finishedBasement: { src: finishedBasement, alt: "A finished basement with white walls and wood-look flooring" },
  finishedBasementStairs: { src: finishedBasementStairs, alt: "A finished basement with a staircase" },
  finishedExterior: { src: finishedExterior, alt: "A finished two-story house exterior" },
} satisfies Record<string, Photo>;

export type ServiceId = "water" | "fire" | "mold" | "boardup";

export type Service = {
  id: ServiceId;
  /** Primary services lead the homepage (hero links, selector). Board-up is a supporting emergency service. */
  primary: boolean;
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
    primary: true,
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
    primary: true,
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
    image: photos.fireInterior,
    detail: photos.fireHome,
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
    primary: true,
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
  {
    id: "boardup",
    primary: false,
    slug: "emergency-board-up-service",
    currentUrl: "https://www.cleanslateservicesny.com/emergency-board-up-service",
    tab: "Board-Up",
    name: "Emergency Board-Up",
    pageTitle: "Emergency Board-Up Service | Long Island & NYC",
    metaDescription:
      "24/7 emergency board-up from Clean Slate Services in Oakdale, NY: windows, doors, and openings secured after a fire, storm, or break-in across Long Island, NYC, and the Tri-State Area. Call (631) 977-9300.",
    h1: "Emergency board-up after a fire, storm, or break-in",
    lede: "Broken windows, forced doors, and openings left by a fire or a storm leave a property exposed to weather, theft, and further damage. Boarding up secures it until repairs can start.",
    signs: [
      "Broken or blown-out windows",
      "A door forced open or off its frame",
      "Openings left after firefighting",
      "Storm damage to walls or the roofline",
    ],
    steps: [
      { title: "Make it safe", body: "Check the opening and the area around it before anyone works near it." },
      { title: "Secure openings", body: "Board windows, doors, and wall openings to keep out weather and intruders." },
      { title: "Document", body: "Photograph the damage before and after, for the insurance claim." },
      { title: "Plan the repair", body: "Scope the permanent repair, which Clean Slate can also handle." },
    ],
    cta: "Need a board-up? Call now",
    image: photos.fireHome,
    detail: photos.rebuildFraming,
    faqs: [
      {
        q: "Is emergency board-up available at night?",
        a: "Clean Slate Services offers 24/7 emergency service, and emergency board-up is one of its core services.",
      },
      {
        q: "Will my insurance pay for a board-up?",
        a: "Insurers generally expect reasonable steps to prevent further damage, and emergency board-up is a common one. What your policy covers depends on the policy, so check with your insurer.",
      },
      {
        q: "Can you do the permanent repair too?",
        a: "Yes. Clean Slate Services also handles construction and repairs, so the same company can follow the board-up with the rebuild.",
      },
    ],
  },
];

export const primaryServices = services.filter((service) => service.primary);

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

/**
 * Project gallery. Every pair is two unrelated stock photos chosen to show the presentation format,
 * and is labeled that way on screen. At launch each entry becomes a real Clean Slate job.
 */
export type GalleryItem = {
  id: string;
  type: Exclude<ServiceId, "boardup">;
  label: string;
  before: Photo;
  after: Photo;
  /** The scope a real job card would list. Generic to the damage type, not a claim about a specific job. */
  scope: string[];
};

export const gallery: GalleryItem[] = [
  {
    id: "interior-water",
    type: "water",
    label: "Interior rebuild after a water loss",
    before: photos.guttedRoom,
    after: photos.finishedLounge,
    scope: ["Water extraction and drying", "Damaged drywall and flooring removed", "Walls, floors, and paint rebuilt"],
  },
  {
    id: "ceiling-leak",
    type: "water",
    label: "Ceiling collapse after a leak",
    before: photos.waterCeiling,
    after: photos.finishedDen,
    scope: ["Leak source found and stopped", "Wet ceiling material removed", "Ceiling rebuilt and finished"],
  },
  {
    id: "fire-interior",
    type: "fire",
    label: "Fire-damaged interior to finished room",
    before: photos.fireInterior,
    after: photos.finishedLiving,
    scope: ["Charred material removed", "Soot and odor treated", "Framing, drywall, and finishes rebuilt"],
  },
  {
    id: "fire-exterior",
    type: "fire",
    label: "Exterior after a house fire",
    before: photos.fireHome,
    after: photos.finishedExterior,
    scope: ["Openings boarded up", "Damaged structure removed", "Exterior rebuilt"],
  },
  {
    id: "basement-mold",
    type: "mold",
    label: "Basement mold to finished basement",
    before: photos.moldWall,
    after: photos.finishedBasement,
    scope: ["Samples taken before work", "Area contained and affected material removed", "Samples taken again afterward"],
  },
  {
    id: "framing-basement",
    type: "mold",
    label: "Open framing to finished basement",
    before: photos.rebuildFraming,
    after: photos.finishedBasementStairs,
    scope: ["Moisture source corrected", "Framing dried and treated", "Basement finished"],
  },
];

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
    title: "Emergency restoration first",
    body: "Water, fire, and mold lead the homepage, with 24/7 call buttons from the first screen. Rebuilding is presented as the last step of restoration, not the headline.",
  },
  {
    title: "Local pages written for the place",
    body: "Eight location pages about each area's housing and risks, instead of one template with the city swapped in. Current URLs are kept; a misspelled one redirects.",
  },
  {
    title: "An established, trustworthy presence",
    body: "Consistent type, color, and photography across every page, one phone number everywhere, and an independent-concept label nobody can miss.",
  },
  {
    title: "A request that qualifies the lead",
    body: "Two steps: damage type and urgency, then ZIP code and contact details. Emergencies are pointed to the phone; everything else arrives ready to triage.",
  },
  {
    title: "Proof that's real",
    body: "A project gallery, the published review, and spaces for certifications, insurance, and reviews that are filled only with what Clean Slate supplies and verifies.",
  },
  {
    title: "Technical SEO done properly",
    body: "Unique titles and descriptions, canonical URLs, LocalBusiness, Service, FAQ, and breadcrumb data, a real sitemap, one H1 per page, and no broken links.",
  },
  {
    title: "Helpful, not pushy",
    body: "What to do in the first ten minutes, how insurance claims usually go, and plain answers. Every section ends with a call or a request, without a hard sell.",
  },
  {
    title: "Fast on a phone",
    body: "Responsive images, a persistent call bar, thumb-sized controls, and motion that respects reduced-motion settings.",
  },
] as const;

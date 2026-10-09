import type { StaticImageData } from "next/image";
import brooklyn from "../../../public/demos/cleanslate/loc-brooklyn.webp";
import queens from "../../../public/demos/cleanslate/loc-queens.webp";
import manhattan from "../../../public/demos/cleanslate/loc-manhattan.webp";
import bronx from "../../../public/demos/cleanslate/loc-bronx.webp";
import statenIsland from "../../../public/demos/cleanslate/loc-staten-island.webp";
import brookhaven from "../../../public/demos/cleanslate/loc-brookhaven.webp";
import oakdale from "../../../public/demos/cleanslate/loc-oakdale.webp";
import newtown from "../../../public/demos/cleanslate/loc-newtown.webp";
import type { ServiceId } from "./content";

/**
 * Service-area pages. Each one is written for its place: the housing, the risks that housing carries,
 * and the practical steps that differ there. Facts are general and public (housing types, documented storms,
 * how buildings and insurers usually work); nothing claims a job, a response time, or a local office.
 *
 * Slugs keep Clean Slate's existing /locations/ URLs, with two fixes a migration would make:
 * - their /locations/brookhaven-ny page is actually about Oakdale, so Oakdale gets its own page and
 *   Brookhaven gets real Brookhaven content;
 * - /locations/newton-ct misspells Newtown, so the page moves to /locations/newtown-ct with a 301 redirect
 *   (next.config.ts redirects the concept's old path the same way).
 */

export type Risk = { title: string; body: string };

export type Location = {
  slug: string;
  name: string;
  /** "Queens, NY" — used in titles and headings. */
  full: string;
  region: string;
  /** Their current URL for this area, when one exists. */
  currentUrl?: string;
  metaDescription: string;
  lede: string;
  image: { src: StaticImageData; alt: string; caption: string };
  housing: string;
  risks: Risk[];
  tip: { title: string; body: string };
  /** Which service matters most here, so the page leads with it. */
  lead: ServiceId;
  faqs: { q: string; a: string }[];
  nearby: string[];
};

const LI = "Long Island";
const NYC = "New York City";

export const locations: Location[] = [
  {
    slug: "oakdale-ny",
    name: "Oakdale",
    full: "Oakdale, NY",
    region: "Suffolk County · Home base",
    metaDescription:
      "Water, fire, and mold damage restoration in Oakdale, NY, from Clean Slate Services at 186 Locust Ave. 24/7 emergency service across the South Shore of Long Island. Call (631) 977-9300.",
    lede: "Clean Slate Services is based in Oakdale, on Long Island's South Shore. For homes in and around the hamlet, this is the shortest call they make.",
    image: { src: oakdale, alt: "A small cottage-style house behind a white picket fence", caption: "South Shore cottage-style home (illustrative)" },
    housing:
      "Oakdale is a hamlet in the Town of Islip, on the Great South Bay. Many homes are older capes, ranches, and cottages, a number of them close to the water.",
    risks: [
      {
        title: "Water near the bay",
        body: "Close to the bay and its tributaries, groundwater and coastal storms can push water into basements and crawl spaces, sometimes with no visible leak.",
      },
      {
        title: "Crawl-space moisture",
        body: "Crawl spaces under older homes hold damp air. Left alone, that moisture is where mold starts, often noticed first as a musty smell upstairs.",
      },
      {
        title: "Winter pipe bursts",
        body: "Pipes in exterior walls, garages, and crawl spaces can freeze and split in a cold snap, and the leak often shows only when the thaw comes.",
      },
    ],
    tip: {
      title: "Flood is usually a separate policy",
      body: "Most homeowners insurance does not cover flood damage, which is covered by separate flood insurance. Water from a burst pipe is a different kind of claim. Knowing which one you have changes the first call to your insurer.",
    },
    lead: "water",
    faqs: [
      {
        q: "Where is Clean Slate Services located?",
        a: "At 186 Locust Ave, Oakdale, NY 11769. Emergency service is available 24/7; the office is open Monday to Friday, 8 AM to 5 PM.",
      },
      {
        q: "Do you handle crawl spaces and basements in Oakdale?",
        a: "Yes. Clean Slate removes mold and moisture from homes, crawl spaces, and basements, with samples taken before and after mold remediation.",
      },
    ],
    nearby: ["brookhaven-ny", "queens-ny", "brooklyn-ny"],
  },
  {
    slug: "brookhaven-ny",
    name: "Brookhaven",
    full: "Brookhaven, NY",
    region: "Suffolk County",
    currentUrl: "https://www.cleanslateservicesny.com/locations/brookhaven-ny",
    metaDescription:
      "Water, fire, and mold damage restoration across the Town of Brookhaven, from Port Jefferson to the South Shore. 24/7 emergency service from Clean Slate Services in nearby Oakdale. Call (631) 977-9300.",
    lede: "The Town of Brookhaven runs from the North Shore to the South Shore of Suffolk County, and its homes range from waterfront cottages to large colonials. The restoration problems change with them.",
    image: { src: brookhaven, alt: "A shingled two-story house with a wraparound porch", caption: "Shingled Long Island home (illustrative)" },
    housing:
      "Brookhaven is Suffolk County's largest town by area, taking in communities such as Port Jefferson, Stony Brook, Medford, Patchogue, and Shirley. Housing spans shore cottages, postwar ranches and capes, and newer colonials with finished basements.",
    risks: [
      {
        title: "Nor'easters and coastal storms",
        body: "Wind-driven rain finds gaps in roofs, chimneys, and window flashing. On the shore, storm surge can reach low-lying streets and basements.",
      },
      {
        title: "Finished basements",
        body: "A failed sump pump or water heater in a finished basement soaks carpet, drywall, and the insulation behind it, which has to dry or come out before mold sets in.",
      },
      {
        title: "Fires that start at home",
        body: "Kitchen fires, heating equipment, and chimney fires leave smoke and soot through the whole house, well beyond the room where they started.",
      },
    ],
    tip: {
      title: "Dry within 24 to 48 hours",
      body: "The EPA advises drying water-damaged areas and items within 24 to 48 hours to prevent mold growth. In a finished basement, that usually means opening walls, not just running fans.",
    },
    lead: "water",
    faqs: [
      {
        q: "Do you serve both shores of Brookhaven?",
        a: "Clean Slate Services lists Brookhaven among its service areas and is based in Oakdale, nearby on the South Shore. Call to confirm scheduling for your address.",
      },
      {
        q: "Can you rebuild a finished basement after water damage?",
        a: "Yes. Clean Slate handles construction and remodeling as well as restoration, so the cleanup and the rebuild can stay with one company.",
      },
    ],
    nearby: ["oakdale-ny", "queens-ny", "newtown-ct"],
  },
  {
    slug: "queens-ny",
    name: "Queens",
    full: "Queens, NY",
    region: NYC,
    currentUrl: "https://www.cleanslateservicesny.com/locations/queens-ny",
    metaDescription:
      "Basement flooding, water damage, fire, and mold restoration in Queens, NY, for attached homes, two-families, and co-ops. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "Queens is a borough of attached and semi-attached houses, two-families, and garden co-ops, and a great many of them have basements. That is where most of its water damage begins.",
    image: { src: queens, alt: "Attached row houses along a city street with parked cars", caption: "Attached row houses (illustrative)" },
    housing:
      "Much of Queens is low-rise housing: attached brick row houses, semi-detached two-families, and garden apartment complexes, many with finished or partly finished basements.",
    risks: [
      {
        title: "Flash flooding into basements",
        body: "Heavy rain can overwhelm street drainage and back up into basements. In September 2021, the remnants of Hurricane Ida flooded basements across the borough.",
      },
      {
        title: "Sewer backups",
        body: "A backup through a basement floor drain is contaminated water. Porous materials it touches usually need to come out, not just dry.",
      },
      {
        title: "Shared walls",
        body: "In attached homes, a leak or a fire next door can reach your side through a shared wall or roofline, so damage isn't always where the cause is.",
      },
    ],
    tip: {
      title: "Photograph before anything moves",
      body: "Photograph water lines on walls, damaged contents, and the source before cleanup starts, and keep damaged items until your insurer says otherwise. It's the record a claim depends on.",
    },
    lead: "water",
    faqs: [
      {
        q: "Is basement flooding covered by homeowners insurance?",
        a: "It depends on the cause. Most homeowners insurance does not cover flood damage, which needs separate flood insurance, while some policies cover sewer backup only with an added endorsement. Your insurer can tell you which applies.",
      },
      {
        q: "Do you work in two-family homes and co-ops?",
        a: "Clean Slate restores homes and businesses. In co-ops and multi-family buildings, the work is coordinated with the building or the other owners where it affects shared areas.",
      },
    ],
    nearby: ["brooklyn-ny", "manhattan-ny", "bronx-ny"],
  },
  {
    slug: "brooklyn-ny",
    name: "Brooklyn",
    full: "Brooklyn, NY",
    region: NYC,
    currentUrl: "https://www.cleanslateservicesny.com/locations/brooklyn-ny",
    metaDescription:
      "Water, fire, and mold damage restoration for Brooklyn brownstones, row houses, and apartments. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "Brooklyn's brownstones and row houses are a century old or more. Their plaster walls, wood floors, and shared structures need restoration that respects how they were built.",
    image: { src: brooklyn, alt: "A row of brownstone townhouses with iron railings and stoops", caption: "Brownstone row houses (illustrative)" },
    housing:
      "Brownstones, frame row houses, and walk-up apartment buildings make up much of the borough, along with newer condo buildings. Many share party walls and rooflines with their neighbors.",
    risks: [
      {
        title: "Roof and parapet leaks",
        body: "Flat roofs and parapet walls on row houses are common sources of slow leaks that show up floors below, often in plaster ceilings.",
      },
      {
        title: "Old plumbing, finished interiors",
        body: "Original supply and drain lines inside finished walls can fail without warning, and plaster and old-growth wood floors take careful drying.",
      },
      {
        title: "Coastal flooding",
        body: "Waterfront neighborhoods such as Red Hook and Coney Island flooded during Hurricane Sandy in 2012. Storm surge there reaches basements and ground floors.",
      },
    ],
    tip: {
      title: "Tell your neighbors",
      body: "In attached houses, water and smoke don't stop at the property line. Letting the neighbors on either side know early helps find the source and protects both homes.",
    },
    lead: "water",
    faqs: [
      {
        q: "Can plaster walls and original floors be saved?",
        a: "Often, depending on how long they were wet and with what. An assessment with moisture readings decides what can be dried in place and what has to be replaced.",
      },
      {
        q: "What if the water came from the house next door?",
        a: "Document the damage and the source, notify your neighbor, and contact your insurer. Restoration on your side can start while the insurers sort out responsibility.",
      },
    ],
    nearby: ["queens-ny", "manhattan-ny", "staten-island-ny"],
  },
  {
    slug: "manhattan-ny",
    name: "Manhattan",
    full: "Manhattan, NY",
    region: NYC,
    currentUrl: "https://www.cleanslateservicesny.com/locations/manhattan-ny",
    metaDescription:
      "Water, fire, and mold damage restoration for Manhattan apartments, co-ops, and condos, coordinated with building management. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "Most Manhattan homes are apartments, so most Manhattan water damage comes from somewhere else: the unit above, a riser, or the roof. Restoration here is as much about coordination as drying.",
    image: { src: manhattan, alt: "The entrance of a prewar apartment building with fire escapes", caption: "Prewar apartment building (illustrative)" },
    housing:
      "Prewar and postwar apartment buildings, co-ops, condos, and brownstones converted into apartments, almost all managed by a superintendent, a managing agent, or a board.",
    risks: [
      {
        title: "Leaks from the unit above",
        body: "An overflowing tub, a failed appliance hose, or a burst pipe upstairs comes through ceilings and down walls, and can affect several floors.",
      },
      {
        title: "Risers and building systems",
        body: "Leaks from shared plumbing risers and steam heating are the building's systems, which brings in the managing agent and the building's insurer.",
      },
      {
        title: "Smoke in shared air",
        body: "Smoke from a fire in one apartment travels through hallways and shafts, so neighboring units can need cleaning even with no flames.",
      },
    ],
    tip: {
      title: "Call the super first, then document",
      body: "Notify the superintendent or managing agent right away so the source can be shut off. Many buildings also require a contractor's certificate of insurance and set work hours, so it helps to ask early.",
    },
    lead: "water",
    faqs: [
      {
        q: "Who pays when water comes from another apartment?",
        a: "It depends on the source and the policies involved: yours, your neighbor's, and the building's. Document everything and notify your insurer and the managing agent; responsibility is settled between them.",
      },
      {
        q: "Can work be scheduled around building rules?",
        a: "Restoration in managed buildings is planned around the building's requirements, such as work hours, elevator use, and insurance paperwork, which management can confirm.",
      },
    ],
    nearby: ["brooklyn-ny", "queens-ny", "bronx-ny"],
  },
  {
    slug: "bronx-ny",
    name: "The Bronx",
    full: "The Bronx, NY",
    region: NYC,
    currentUrl: "https://www.cleanslateservicesny.com/locations/bronx-ny",
    metaDescription:
      "Water, fire, and mold damage restoration in the Bronx, NY, for apartment buildings, multi-family homes, and houses. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "The Bronx mixes large prewar apartment buildings with multi-family and single-family homes. Older heating and plumbing systems are behind much of its water damage.",
    image: { src: bronx, alt: "A street of brick apartment buildings with fire escapes", caption: "Prewar brick buildings (illustrative)" },
    housing:
      "Prewar elevator and walk-up apartment buildings, two- and three-family houses, and detached homes in neighborhoods such as Riverdale and Throgs Neck.",
    risks: [
      {
        title: "Steam heat and old pipes",
        body: "Many older buildings use steam heat. Leaking radiators, valves, and aging supply lines cause slow damage that is often found late.",
      },
      {
        title: "Multi-family water damage",
        body: "In two- and three-family houses, a leak in one unit often reaches the one below, so restoration covers more than one household.",
      },
      {
        title: "Mold after hidden leaks",
        body: "Leaks behind walls and under floors that go unnoticed for weeks are where mold growth starts, especially in bathrooms and kitchens.",
      },
    ],
    tip: {
      title: "Keep damaged items until the adjuster sees them",
      body: "It is tempting to throw out ruined carpet and furniture right away. Photograph it, and ask your insurer before discarding anything they may want to inspect.",
    },
    lead: "mold",
    faqs: [
      {
        q: "How do you know if mold is behind a wall?",
        a: "Signs include a musty smell, staining that returns after painting, and a history of leaks. An inspection with samples confirms it; Clean Slate takes samples before and after remediation.",
      },
      {
        q: "Do you work in multi-family houses?",
        a: "Yes. Clean Slate restores homes and businesses, including buildings with more than one household.",
      },
    ],
    nearby: ["manhattan-ny", "queens-ny", "newtown-ct"],
  },
  {
    slug: "staten-island-ny",
    name: "Staten Island",
    full: "Staten Island, NY",
    region: NYC,
    currentUrl: "https://www.cleanslateservicesny.com/locations/staten-island-ny",
    metaDescription:
      "Flood, water, fire, and mold damage restoration on Staten Island, NY, from the shoreline to the North Shore. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "Staten Island is New York City's most suburban borough, with detached and semi-detached homes and a long, low shoreline. Water is its defining restoration risk.",
    image: { src: statenIsland, alt: "A harbor under storm clouds at dusk", caption: "Waterfront at dusk (illustrative)" },
    housing:
      "Detached and semi-detached houses with basements, townhouse developments, and older homes along the North Shore, with low-lying neighborhoods along the East Shore.",
    risks: [
      {
        title: "Storm surge on the East Shore",
        body: "Hurricane Sandy in 2012 flooded East Shore neighborhoods such as Midland Beach and Oakwood Beach. Low-lying streets there remain exposed to coastal flooding.",
      },
      {
        title: "Basements below grade",
        body: "Heavy rain and high groundwater put water into basements, and finished basements turn a cleanup into drywall, flooring, and insulation removal.",
      },
      {
        title: "Mold after a flood",
        body: "After any flood, drying fast matters. The EPA advises drying water-damaged areas within 24 to 48 hours to prevent mold growth.",
      },
    ],
    tip: {
      title: "Check your flood coverage before the storm",
      body: "Most homeowners insurance does not cover flood damage. If you're in a low-lying area, check whether you have flood insurance and what it covers before storm season.",
    },
    lead: "water",
    faqs: [
      {
        q: "Should I wait for the adjuster before starting cleanup?",
        a: "Insurers generally expect you to prevent further damage, so emergency water removal and drying usually shouldn't wait. Document everything first, and keep your insurer informed.",
      },
      {
        q: "Do you also rebuild after flood cleanup?",
        a: "Yes. Clean Slate handles construction and remodeling as well as restoration.",
      },
    ],
    nearby: ["brooklyn-ny", "manhattan-ny", "queens-ny"],
  },
  {
    slug: "newtown-ct",
    name: "Newtown",
    full: "Newtown, CT",
    region: "Fairfield County · Tri-State Area",
    currentUrl: "https://www.cleanslateservicesny.com/locations/newton-ct",
    metaDescription:
      "Water, fire, and mold damage restoration in Newtown, CT, for colonials and older homes in Fairfield County. 24/7 emergency service from Clean Slate Services. Call (631) 977-9300.",
    lede: "Newtown is the Connecticut end of Clean Slate's service area: a New England town of colonials, farmhouses, and newer homes, with winters that are hard on pipes and roofs.",
    image: { src: newtown, alt: "A white colonial house with black shutters", caption: "New England colonial (illustrative)" },
    housing:
      "A Fairfield County town that includes the village of Sandy Hook, with historic colonials and farmhouses near the center and larger newer homes on wooded lots.",
    risks: [
      {
        title: "Frozen and burst pipes",
        body: "Long freezes split pipes in exterior walls, attics, and unheated spaces. The damage often appears when the pipe thaws, sometimes while a house is empty.",
      },
      {
        title: "Ice dams",
        body: "Snow that melts and refreezes at the eaves can back water up under shingles and into ceilings and walls.",
      },
      {
        title: "Fireplaces and wood stoves",
        body: "Chimney and heating fires leave smoke and soot through older homes, and the water used to put them out adds water damage.",
      },
    ],
    tip: {
      title: "Know where your shutoff is",
      body: "Find your main water shutoff before winter. In a burst-pipe emergency, closing it quickly is the single most effective way to limit the damage.",
    },
    lead: "water",
    faqs: [
      {
        q: "Do you really serve Connecticut from Long Island?",
        a: "Newtown, CT is one of the service areas Clean Slate lists. It is a longer trip from Oakdale, so call to confirm scheduling for your address.",
      },
      {
        q: "Is the page address changing?",
        a: "Clean Slate's current page for this area is at /locations/newton-ct. In this concept, it moves to the correct spelling, /locations/newtown-ct, and the old address redirects so existing links keep working.",
      },
    ],
    nearby: ["bronx-ny", "brookhaven-ny", "oakdale-ny"],
  },
];

export const locationBySlug = (slug: string) => locations.find((location) => location.slug === slug);

export const LOCATION_GROUPS = [
  { title: LI, slugs: ["oakdale-ny", "brookhaven-ny"] },
  { title: NYC, slugs: ["queens-ny", "brooklyn-ny", "manhattan-ny", "bronx-ny", "staten-island-ny"] },
  { title: "Connecticut", slugs: ["newtown-ct"] },
] as const;

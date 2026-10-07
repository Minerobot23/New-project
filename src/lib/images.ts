import type { StaticImageData } from "next/image";
import articleCalls from "../../public/images/article-calls.webp";
import articleChecklist from "../../public/images/article-checklist.webp";
import articleContractor from "../../public/images/article-contractor.webp";
import articleCost from "../../public/images/article-cost.webp";
import articleNeed from "../../public/images/article-need.webp";
import articleNoLeads from "../../public/images/article-noleads.webp";
import articleRedesign from "../../public/images/article-redesign.webp";
import articleRestaurant from "../../public/images/article-restaurant.webp";
import articleSocial from "../../public/images/article-social.webp";
import articleTimeline from "../../public/images/article-timeline.webp";
import deskNight from "../../public/images/desk-night.webp";
import industryAuto from "../../public/images/industry-auto.webp";
import industryContractors from "../../public/images/industry-contractors.webp";
import industryHvac from "../../public/images/industry-hvac.webp";
import industryLocal from "../../public/images/industry-local.webp";
import industryPlumbers from "../../public/images/industry-plumbers.webp";
import industryRestaurants from "../../public/images/industry-restaurants.webp";
import industryRoofers from "../../public/images/industry-roofers.webp";
import industrySalons from "../../public/images/industry-salons.webp";
import locLongIsland from "../../public/images/loc-long-island.webp";
import locNassau from "../../public/images/loc-nassau.webp";
import locQueens from "../../public/images/loc-queens.webp";
import locSuffolk from "../../public/images/loc-suffolk.webp";
import ownerCall from "../../public/images/owner-call.webp";
import ownerPhone from "../../public/images/owner-phone.webp";
import autoDesktop from "../../public/showcase/auto-desktop.webp";
import autoMobile from "../../public/showcase/auto-mobile.webp";
import hvacDesktop from "../../public/showcase/hvac-desktop.webp";
import hvacMobile from "../../public/showcase/hvac-mobile.webp";
import restaurantDesktop from "../../public/showcase/restaurant-desktop.webp";
import restaurantMobile from "../../public/showcase/restaurant-mobile.webp";
import salonDesktop from "../../public/showcase/salon-desktop.webp";
import salonMobile from "../../public/showcase/salon-mobile.webp";
import type { IndustryId } from "@/components/simulator/types";

/**
 * Site photography (Unsplash License, sources in docs/PHOTO-CREDITS.md) and screenshots of the concept demos.
 * Static imports give next/image the dimensions and a blur placeholder.
 */
export type SiteImage = { src: StaticImageData; alt: string };

export const INDUSTRY_IMAGES: Record<string, SiteImage> = {
  "/websites-for-contractors": {
    src: industryContractors,
    alt: "Contractor in a hard hat framing a wooden structure",
  },
  "/websites-for-hvac-companies": {
    src: industryHvac,
    alt: "Service technician in uniform outside a building",
  },
  "/websites-for-plumbers": {
    src: industryPlumbers,
    alt: "Plumber working on a pipe inside an open wall",
  },
  "/websites-for-roofers": {
    src: industryRoofers,
    alt: "Roofer removing old shingles from a roof",
  },
  "/websites-for-restaurants": {
    src: industryRestaurants,
    alt: "Plated dish served on a white plate",
  },
  "/websites-for-salons": {
    src: industrySalons,
    alt: "Stylist curling a client's hair in a salon",
  },
  "/websites-for-auto-repair-shops": {
    src: industryAuto,
    alt: "Mechanic working on a car in a repair shop",
  },
  "/websites-for-local-businesses": {
    src: industryLocal,
    alt: "Customer sitting at the counter of a small local business",
  },
};

export const LOCATION_IMAGES: Record<string, SiteImage> = {
  "/web-design-long-island": {
    src: locLongIsland,
    alt: "Lighthouse above a grassy field on Long Island",
  },
  "/web-design-nassau-county": {
    src: locNassau,
    alt: "People enjoying a beach on a sunny day",
  },
  "/web-design-suffolk-county": {
    src: locSuffolk,
    alt: "Lighthouse on a grassy hill",
  },
  "/web-design-queens": {
    src: locQueens,
    alt: "The Unisphere in Flushing Meadows Corona Park, Queens",
  },
};

export const ARTICLE_IMAGES: Record<string, SiteImage> = {
  "how-much-does-a-small-business-website-cost": {
    src: articleCost,
    alt: "Person planning on a laptop",
  },
  "does-my-business-need-a-website": {
    src: articleNeed,
    alt: "Business owner holding an open sign",
  },
  "how-often-should-a-website-be-redesigned": {
    src: articleRedesign,
    alt: "Person working on a website on a laptop",
  },
  "website-redesign-checklist": {
    src: articleChecklist,
    alt: "Team collaborating around a table",
  },
  "what-makes-a-good-contractor-website": {
    src: articleContractor,
    alt: "Contractor in a hard hat on a job site",
  },
  "what-should-a-restaurant-website-include": {
    src: articleRestaurant,
    alt: "Restaurant dining room with set tables",
  },
  "how-to-turn-website-visitors-into-calls": {
    src: articleCalls,
    alt: "Customer looking up at a menu board",
  },
  "website-gets-traffic-but-no-leads": {
    src: articleNoLeads,
    alt: "Person reviewing a website on a laptop",
  },
  "website-vs-social-media": {
    src: articleSocial,
    alt: "Person scrolling on a smartphone",
  },
  "how-long-does-it-take-to-build-a-website": {
    src: articleTimeline,
    alt: "Person working through a project on a laptop",
  },
};

export const PHOTOS = {
  ownerPhone: {
    src: ownerPhone,
    alt: "Business owner in an apron checking a phone",
  },
  ownerCall: {
    src: ownerCall,
    alt: "Business owner on a phone call while working at a laptop",
  },
  deskNight: {
    src: deskNight,
    alt: "Design workstation with a monitor and keyboard",
  },
} satisfies Record<string, SiteImage>;

/** Screenshots of the redesigned ("After") concept demos. */
export const SHOWCASE: Record<IndustryId, { desktop: StaticImageData; mobile: StaticImageData; name: string }> = {
  restaurant: {
    desktop: restaurantDesktop,
    mobile: restaurantMobile,
    name: "Casa Verona",
  },
  home: {
    desktop: hvacDesktop,
    mobile: hvacMobile,
    name: "North Shore Heating & Cooling",
  },
  auto: {
    desktop: autoDesktop,
    mobile: autoMobile,
    name: "Ridgeway Auto Care",
  },
  salon: {
    desktop: salonDesktop,
    mobile: salonMobile,
    name: "Lumen Hair & Skin Studio",
  },
};

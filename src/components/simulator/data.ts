import type { IndustryId } from "./types";

export type IndustryDemo = {
  id: IndustryId;
  label: string;
  business: string;
  kind: string;
  url: string;
  changes: { before: string; after: string }[];
};

/** Fictional demo businesses. None of these are real companies or Fluxline clients. */
export const INDUSTRY_DEMOS: Record<IndustryId, IndustryDemo> = {
  home: {
    id: "home",
    label: "Home Services",
    business: "North Shore Heating & Cooling",
    kind: "HVAC company",
    url: "northshore-hvac.demo",
    changes: [
      {
        before: "Customers have to search for how to contact the business.",
        after: "Call and estimate buttons are visible immediately and stay within reach on a phone.",
      },
      {
        before: "Services are buried in long paragraphs.",
        after: "Services are organized around what customers are actually looking for.",
      },
      {
        before: "Reviews, financing, and service areas are missing or hidden.",
        after: "Reviews, financing, and service areas answer common questions up front.",
      },
      {
        before: "The website explains the business.",
        after: "The website guides the customer toward taking action.",
      },
    ],
  },
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    business: "Casa Verona",
    kind: "Italian restaurant",
    url: "casaverona.demo",
    changes: [
      {
        before: "Visitors have to download a PDF menu.",
        after: "The menu is fast, readable, mobile-friendly, and visible to search engines.",
      },
      {
        before: "Hours and the address are buried near the footer.",
        after: "Hours, location, and directions sit right where people look for them.",
      },
      {
        before: "The reservation link is small and easy to miss.",
        after: "Reserve, View Menu, and Order Online are the first three actions.",
      },
      {
        before: "Social media icons get more attention than reservations.",
        after: "Social links support the experience instead of competing with it.",
      },
    ],
  },
  salon: {
    id: "salon",
    label: "Beauty / Wellness",
    business: "Lumen Hair & Skin Studio",
    kind: "salon and skin studio",
    url: "lumenstudio.demo",
    changes: [
      {
        before: "Services and prices are hard to compare.",
        after: "Services are grouped clearly, with starting prices.",
      },
      {
        before: "The booking link is buried at the bottom of the page.",
        after: "Book Appointment is always one tap away.",
      },
      {
        before: "Generic template content says little about the studio.",
        after: "The gallery, team, and reviews show the people and the work.",
      },
      {
        before: "The mobile layout is cramped and hard to read.",
        after: "Generous spacing and readable type make the phone experience feel premium.",
      },
    ],
  },
  auto: {
    id: "auto",
    label: "Automotive",
    business: "Ridgeway Auto Care",
    kind: "auto repair shop",
    url: "ridgewayauto.demo",
    changes: [
      {
        before: "Phone is the only way to get in touch.",
        after: "Customers can schedule service, call, or get directions in one tap.",
      },
      {
        before: "Services are buried in one long list.",
        after: "Services are easy to scan, with plain-language descriptions.",
      },
      {
        before: "Little builds trust before a first visit.",
        after: "Reviews, warranty details, and credentials build confidence early.",
      },
      {
        before: "Hours and location take effort to find.",
        after: "Hours and location are visible at a glance.",
      },
    ],
  },
};

export const INDUSTRY_ORDER: IndustryId[] = ["home", "restaurant", "salon", "auto"];

import type { IndustryId } from "@/components/simulator/types";

/**
 * Real client case studies. Add an entry only for a real, permitted project.
 * `results` and `testimonial` are optional and must only contain measured outcomes
 * and words the client actually provided.
 */
export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  summary: string;
  problem: string;
  approach: string;
  features: string[];
  liveUrl?: string;
  results?: { label: string; value: string; note?: string }[];
  testimonial?: { quote: string; name: string; role?: string };
  /** Optional before/after screenshots in /public/work/<slug>/. */
  images?: { before?: string; after?: string };
};

export const CASE_STUDIES: CaseStudy[] = [];

/** Interactive concept projects (fictional businesses) shown until and alongside real work. */
export const CONCEPT_PROJECTS: { industry: IndustryId; name: string; kind: string; focus: string; href: string }[] = [
  {
    industry: "home",
    name: "North Shore Heating & Cooling",
    kind: "HVAC company",
    focus: "Emergency service, estimate requests, financing, and service areas, organized for a phone-first homeowner.",
    href: "/websites-for-hvac-companies#demo",
  },
  {
    industry: "restaurant",
    name: "Casa Verona",
    kind: "Italian restaurant",
    focus: "Reservations, a real HTML menu, online ordering, hours, and directions, all within one tap.",
    href: "/websites-for-restaurants#demo",
  },
  {
    industry: "salon",
    name: "Lumen Hair & Skin Studio",
    kind: "salon and skin studio",
    focus: "Clear starting prices, a persistent booking button, gallery, and team.",
    href: "/websites-for-salons#demo",
  },
  {
    industry: "auto",
    name: "Ridgeway Auto Care",
    kind: "auto repair shop",
    focus: "Schedule service by vehicle, call, or get directions, with warranty and hours up front.",
    href: "/websites-for-auto-repair-shops#demo",
  },
];

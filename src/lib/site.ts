/**
 * Central site configuration. Public, non-secret values only.
 * Anything secret (API keys, notification recipients) lives in server-only env vars.
 */
export const site = {
  name: "Fluxline Solutions",
  shortName: "Fluxline",
  legalName: "Fluxline LLC",
  url: "https://fluxlinesolutions.com",
  domain: "fluxlinesolutions.com",
  tagline: "Immersive websites for real-world businesses",
  title: "Fluxline Solutions | Websites Built to Turn Visitors Into Customers",
  description:
    "Fluxline Solutions designs fast, modern, mobile-first websites for businesses that want to look better online and turn more visitors into calls, reservations, appointments, and customers.",
  serviceArea: "Serving businesses throughout Long Island, Queens, and beyond.",
  contact: {
    name: "Cristhian Garcia",
    title: "Sales",
    email: "cristhian@fluxlinesolutions.com",
  },
  /**
   * Business mailing address shown in the footer and legal pages.
   * Leave as null until a real address is provided; nothing is rendered while null.
   * Example shape: ["Fluxline LLC", "123 Street, Suite 100", "City, ST 00000"]
   */
  mailingAddress: null as readonly string[] | null,
  legalLastUpdated: "October 7, 2026",
} as const;

export const CALL_PATH = "/request-a-call";
export const CALL_CTA_LABEL = "Request a Call";
export const CHECK_PATH = "/website-check";
export const CHECK_CTA_LABEL = "Get a Free Website Check";

export const navLinks = [
  { href: "/experiences", label: "Experiences" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const industryLinks = [
  { href: "/websites-for-contractors", label: "Contractors & Remodelers" },
  { href: "/websites-for-hvac-companies", label: "HVAC Companies" },
  { href: "/websites-for-plumbers", label: "Plumbers" },
  { href: "/websites-for-roofers", label: "Roofers" },
  { href: "/websites-for-restaurants", label: "Restaurants" },
  { href: "/websites-for-salons", label: "Salons & Wellness" },
  { href: "/websites-for-auto-repair-shops", label: "Auto Repair Shops" },
  { href: "/websites-for-local-businesses", label: "Local Businesses" },
] as const;

export const locationLinks = [
  { href: "/web-design-long-island", label: "Long Island" },
  { href: "/web-design-nassau-county", label: "Nassau County" },
  { href: "/web-design-suffolk-county", label: "Suffolk County" },
  { href: "/web-design-queens", label: "Queens" },
] as const;

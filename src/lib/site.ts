/**
 * Central site configuration. Public, non-secret values only.
 * Anything secret (API keys, notification recipients) lives in server-only env vars.
 */
export const site = {
  name: "Fluxline",
  legalName: "Fluxline LLC",
  url: "https://fluxlinesolutions.com",
  domain: "fluxlinesolutions.com",
  tagline: "Revenue Recovery for Home Service Companies",
  title: "Fluxline | Revenue Recovery for Home Service Companies",
  description:
    "Fluxline helps home-service companies identify and pursue valuable unsold estimates already sitting in their pipeline.",
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
  legalLastUpdated: "October 6, 2026",
} as const;

export const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#who-we-help", label: "Who We Help" },
  { href: "/#why-fluxline", label: "Why Fluxline" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const CALL_PATH = "/call";
export const CALL_CTA_LABEL = "Request a 15-Minute Call";

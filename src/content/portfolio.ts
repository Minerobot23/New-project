import type { StaticImageData } from "next/image";
import miamiDesktop from "../../public/portfolio/miami-desktop.webp";
import miamiDetail from "../../public/portfolio/miami-desktop-2.webp";
import miamiTablet from "../../public/portfolio/miami-tablet.webp";
import miamiMobile from "../../public/portfolio/miami-mobile.webp";
import casaDesktop from "../../public/portfolio/casa-desktop.webp";
import casaDetail from "../../public/portfolio/casa-desktop-2.webp";
import casaTablet from "../../public/portfolio/casa-tablet.webp";
import casaMobile from "../../public/portfolio/casa-mobile.webp";
import procamDesktop from "../../public/portfolio/procam-desktop.webp";
import procamDetail from "../../public/portfolio/procam-desktop-2.webp";
import procamTablet from "../../public/portfolio/procam-tablet.webp";
import procamMobile from "../../public/portfolio/procam-mobile.webp";
import cleanslateDesktop from "../../public/portfolio/cleanslate-desktop.webp";
import cleanslateDetail from "../../public/portfolio/cleanslate-desktop-2.webp";
import cleanslateTablet from "../../public/portfolio/cleanslate-tablet.webp";
import cleanslateMobile from "../../public/portfolio/cleanslate-mobile.webp";

/**
 * The /portfolio page. Screenshots are real captures of each live project (October 2026).
 * Status labels are exact: Miami and Casa Catracha are redesign concepts for real restaurants
 * (each demo says so in its own footer); Pro Cam Solutions LI is a live site on its own domain;
 * Clean Slate is an unsolicited concept for a prospective client, not a client project.
 * No results, metrics, or testimonials are claimed for any of them.
 */
export type PortfolioProject = {
  slug: string;
  number: string;
  name: string;
  kind: string;
  status: string;
  statusNote: string;
  /** One line, in the voice of the business problem. */
  objective: string;
  built: string[];
  focus: string[];
  href: string;
  displayUrl: string;
  /** Chapter accent, taken from the project's own palette. */
  accent: string;
  shots: { desktop: StaticImageData; detail: StaticImageData; tablet: StaticImageData; mobile: StaticImageData };
  detailCaption: string;
};

export const PROJECTS: PortfolioProject[] = [
  {
    slug: "miami",
    number: "01",
    name: "Miami Restaurant & Bar",
    kind: "Restaurant & bar · Hauppauge, NY",
    status: "Redesign concept",
    statusNote: "An unofficial redesign concept prepared for the restaurant. Not its official website.",
    objective:
      "Sell the night, not just the menu: give a late-night grill and cocktail bar a site with the room's energy, then turn that mood into reservations, orders, and private events.",
    built: [
      "Cinematic video hero with separate desktop and phone cuts, a poster frame for a fast first paint, and a pause control",
      "Six-category tabbed menu, taken from the restaurant's published menu",
      "Bar program and private-event packages, so groups can plan before they call",
      "A mobile action bar that keeps menu, reservations, calling, and directions under the thumb",
    ],
    focus: ["Immersive design", "Visual storytelling", "Hospitality presentation"],
    href: "https://miami-restaurant-bar-demo.vercel.app",
    displayUrl: "miami-restaurant-bar-demo.vercel.app",
    accent: "#ff4f9a",
    shots: { desktop: miamiDesktop, detail: miamiDetail, tablet: miamiTablet, mobile: miamiMobile },
    detailCaption: "The menu: six categories, one tap apart.",
  },
  {
    slug: "casa-catracha",
    number: "02",
    name: "Casa Catracha",
    kind: "Honduran restaurant · Farmingdale, NY",
    status: "Redesign concept",
    statusNote: "An unofficial redesign concept prepared for the restaurant. Not its official website.",
    objective:
      "Present a Honduran kitchen with warmth and pride, speak to Spanish- and English-speaking guests equally, and make ordering and reservations obvious on a phone.",
    built: [
      "A full English and Spanish language switch",
      "A menu built around the dishes guests come for, from baleadas to desayuno catracho",
      "“Palabras catrachas”: a short glossary that tells the culture behind the food",
      "Pickup ordering and table reservation flows that show the confirmation each would produce",
    ],
    focus: ["Restaurant branding", "Bilingual experience", "Mobile ordering"],
    href: "https://casa-catracha-demo.vercel.app",
    displayUrl: "casa-catracha-demo.vercel.app",
    accent: "#e0a73b",
    shots: { desktop: casaDesktop, detail: casaDetail, tablet: casaTablet, mobile: casaMobile },
    detailCaption: "La carta: start with the classics.",
  },
  {
    slug: "pro-cam-solutions",
    number: "03",
    name: "Pro Cam Solutions LI",
    kind: "Security technology · Long Island, NY",
    status: "Live website",
    statusNote: "Live at procamsolutionsli.com.",
    objective:
      "Position a residential and commercial security installer as a technology company, by showing what good camera coverage looks like before a homeowner books an estimate.",
    built: [
      "An interactive blueprint hero: five camera positions, coverage zones, and a detection simulation",
      "Separate pages for services, why us, process, FAQ, and booking",
      "Appointment booking through Calendly and a working estimate-request form",
      "Clean URLs, with permanent redirects so retired pages still land somewhere useful",
    ],
    focus: ["Security technology", "Interactive design", "Modern business presentation"],
    href: "https://www.procamsolutionsli.com",
    displayUrl: "procamsolutionsli.com",
    accent: "#3b8bff",
    shots: { desktop: procamDesktop, detail: procamDetail, tablet: procamTablet, mobile: procamMobile },
    detailCaption: "Services, why us, process, and FAQ: each opens its own page.",
  },
];

export const CONCEPT: PortfolioProject = {
  slug: "cleanslate",
  number: "CS",
  name: "Clean Slate Services",
  kind: "Property restoration · Oakdale, NY",
  status: "Custom Business Concept",
  statusNote:
    "An independent concept Fluxline prepared on its own initiative to show what this business's website could be. Clean Slate Services is not a Fluxline client, and the concept is not their official website.",
  objective:
    "For a business whose customers find it in an emergency: put the phone call first, make water, fire, and mold easy to tell apart, and look like a company you'd trust inside your home.",
  built: [
    "A 24/7 emergency hero with tap-to-call on every screen and a call bar that stays on phones",
    "An interactive water / fire / mold selector and an animated four-stage restoration process",
    "A before-and-after slider, clearly labeled sample imagery, ready for the company's own job photos",
    "Service pages at the company's existing URLs, with LocalBusiness and FAQ structured data",
    "A presentation mode with proposal notes for walking management through the concept",
  ],
  focus: ["Emergency conversion", "Local SEO architecture", "Sales presentation"],
  href: "/demos/cleanslate",
  displayUrl: "fluxlinesolutions.com/demos/cleanslate",
  accent: "#6aa6ec",
  shots: { desktop: cleanslateDesktop, detail: cleanslateDetail, tablet: cleanslateTablet, mobile: cleanslateMobile },
  detailCaption: "Choose the damage, see the plan, call.",
};

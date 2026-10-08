import { Archivo, Cormorant_Garamond, Montserrat } from "next/font/google";

/** Wordmark typeface: wide, geometric, matching the Fluxline Solutions logo. */
export const brandFont = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

/**
 * Display typeface for headlines. Archivo's width axis lets headlines run expanded,
 * echoing the wide logo, while body copy stays in Geist.
 */
export const displayFont = Archivo({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-archivo",
});

/**
 * Serif for client experiences in hospitality. Each client experience gets its own type;
 * Fluxline's own brand stays in Archivo + Geist.
 */
export const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  // Only experience routes use it; don't preload it on every page.
  preload: false,
});

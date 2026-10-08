import { Archivo, Montserrat } from "next/font/google";

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

import { Archivo, Barlow, Barlow_Condensed, Cormorant_Garamond, Fraunces, IBM_Plex_Mono, Karla, Manrope } from "next/font/google";

/**
 * Each fictional brand gets its own type system, the way four different businesses would.
 * preload: false keeps these out of every page's critical path; they load only when a demo renders.
 * (next/font requires literal option objects, so options are written out per font.)
 */

// North Shore Heating & Cooling: practical local trade.
export const hvacDisplay = Barlow_Condensed({ subsets: ["latin"], display: "swap", preload: false, weight: ["600", "700", "800"] });
export const hvacBody = Barlow({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600", "700"] });

// Casa Verona: editorial trattoria.
export const verDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});
export const verBody = Karla({ subsets: ["latin"], display: "swap", preload: false });

// Lumen Hair & Skin: quiet, minimal luxury.
export const lumenDisplay = Fraunces({ subsets: ["latin"], display: "swap", preload: false, style: ["normal", "italic"], axes: ["SOFT", "opsz"] });
export const lumenBody = Manrope({ subsets: ["latin"], display: "swap", preload: false });

// Ridgeway Auto Care: industrial and no-nonsense.
export const autoDisplay = Archivo({ subsets: ["latin"], display: "swap", preload: false, axes: ["wdth"] });
export const autoMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500", "600"] });

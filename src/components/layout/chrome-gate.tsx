"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Full-screen experiences own the whole viewport: the site header and footer step aside there.
 * Client concept demos (/demos/*) bring their own header and footer, so Fluxline's step aside too.
 */
export function HideOnImmersive({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/experiences/") || pathname.startsWith("/demos/")) return null;
  return <>{children}</>;
}

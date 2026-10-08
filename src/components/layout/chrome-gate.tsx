"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Full-screen experiences own the whole viewport: the site header and footer step aside there. */
export function HideOnImmersive({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/experiences/")) return null;
  return <>{children}</>;
}

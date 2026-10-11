"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { CALL_PATH, CHECK_PATH, ORDER_PATH } from "@/lib/site";

/**
 * Site-wide analytics: cookieless Vercel Web Analytics page views, first-touch attribution,
 * and one delegated click listener for CTA, phone, and email clicks (no per-link wiring needed).
 */
export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    if (pathname === "/pricing") track("pricing_view", { page: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const location = anchor.closest("[data-track-location]")?.getAttribute("data-track-location") ?? window.location.pathname;
      if (href.startsWith("/checkout/")) track("deposit_button_click", { page: window.location.pathname });
      else if (href.startsWith("tel:")) track("phone_click", { location });
      else if (href.startsWith("mailto:")) track("email_click", { location });
      else if (href === ORDER_PATH) track("start_website_click", { location });
      else if (href === CALL_PATH || href.startsWith(`${CALL_PATH}?`)) track("request_call_click", { location });
      else if (href === CHECK_PATH || href.startsWith(`${CHECK_PATH}?`)) track("website_check_click", { location });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <Analytics />;
}

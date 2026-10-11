"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { consent, subscribeMeasurement } from "./advertising";
import { canRecordBehavior } from "@/lib/behavior";
import { track } from "@/lib/analytics";

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global { interface Window { clarity?: Clarity; } }

export function BehaviorAnalytics({ nonce, projectId }: { nonce: string; projectId: string }) {
  const id = /^[a-z0-9]{6,20}$/.test(projectId) ? projectId : "";
  const pathname = usePathname();
  const ready = useSyncExternalStore(subscribeMeasurement, () => Boolean(id && consent() === "yes" && canRecordBehavior(new URL(window.location.href))), () => false);

  useEffect(() => {
    if (!ready) return;
    // A full document navigation prevents a recording script following SPA links into private pages.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.download) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.hash)) return;
      if (url.pathname.startsWith("/checkout/")) track("deposit_button_click", { page: window.location.pathname });
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    };
    const onBack = () => window.location.reload();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onBack);
    window.clarity ??= Object.assign((...args: unknown[]) => { window.clarity!.q!.push(args); }, { q: [] as unknown[][] });
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    const industry = window.location.pathname.split("/")[2];
    if (industry === "contractors" || industry === "restaurants") window.clarity("set", "industry", industry);
    window.clarity("event", window.location.pathname.startsWith("/start/") ? "sales_page_view" : window.location.pathname === "/pricing" ? "pricing_view" : "public_page_view");
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("popstate", onBack); };
  }, [ready, pathname]);

  return ready ? <Script id="fluxline-clarity" nonce={nonce} src={`https://www.clarity.ms/tag/${id}`} /> : null;
}

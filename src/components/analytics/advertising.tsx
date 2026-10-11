"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { validPurchase, type Purchase } from "@/lib/purchase";

const CONSENT = "fluxline-ad-measurement-v1";
const CHANGE = "fluxline-ad-consent";
const READY = "fluxline-ad-ready";
type Tracker = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Tracker; _fbq?: Tracker; fbq?: Tracker & { queue?: unknown[][]; push?: Tracker; loaded?: boolean; version?: string; callMethod?: Tracker }; }
}
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(CHANGE, callback); window.removeEventListener("storage", callback); };
}
function consent() { try { return localStorage.getItem(CONSENT) ?? "unset"; } catch { return "unset"; } }
function choose(value: "yes" | "no") {
  try { localStorage.setItem(CONSENT, value); } catch { /* unavailable storage: default to no tracking */ }
  window.dispatchEvent(new Event(CHANGE));
  // Reload also removes third-party scripts after consent is withdrawn.
  window.location.reload();
}
function cleanUrl() { return window.location.origin + window.location.pathname; }

export function Advertising({ nonce, googleId, pixelId }: { nonce: string; googleId: string; pixelId: string }) {
  const choice = useSyncExternalStore(subscribe, consent, () => "unset");
  const pathname = usePathname();
  const [settings, setSettings] = useState(false);
  const google = /^AW-\d+$/.test(googleId) ? googleId : "";
  const pixel = /^\d+$/.test(pixelId) ? pixelId : "";
  const enabled = Boolean(google || pixel);

  useEffect(() => {
    if (choice !== "yes") return;
    if (google) {
      window.dataLayer ??= [];
      // Google's queue consumes Arguments objects rather than rest-parameter arrays.
      // eslint-disable-next-line prefer-rest-params
      window.gtag ??= function () { window.dataLayer!.push(arguments); };
      window.gtag("consent", "default", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("js", new Date());
      window.gtag("config", google, { send_page_view: false, allow_ad_personalization_signals: false, page_location: cleanUrl(), page_referrer: "" });
    }
    if (pixel && !window.fbq) {
      const queue: NonNullable<Window["fbq"]> = (...args) => {
        if (queue.callMethod) queue.callMethod(...args); else queue.queue!.push(args);
      };
      queue.queue = []; queue.push = queue; queue.loaded = true; queue.version = "2.0";
      window.fbq = queue;
      window._fbq ??= queue;
      queue("set", "autoConfig", false, pixel);
      queue("init", pixel);
    }
  }, [choice, google, pixel]);

  useEffect(() => {
    if (choice === "yes" && pixel && !pathname.startsWith("/checkout/success") && !pathname.startsWith("/client") && !pathname.startsWith("/admin")) {
      window.fbq?.("track", "PageView");
    }
  }, [choice, pixel, pathname]);

  if (!enabled) return null;
  return <>
    {choice === "yes" && google && <Script id="fluxline-google" nonce={nonce} src={`https://www.googletagmanager.com/gtag/js?id=${google}`} onReady={() => { window.dispatchEvent(new Event(READY)); }} />}
    {choice === "yes" && pixel && <Script id="fluxline-meta" nonce={nonce} src="https://connect.facebook.net/en_US/fbevents.js" onReady={() => { window.dispatchEvent(new Event(READY)); }} />}
    {(choice === "unset" || settings) ? <aside aria-label="Advertising measurement choices" className="fixed bottom-4 left-4 right-4 z-[80] max-w-xl border border-night-line bg-night p-5 text-white shadow-xl">
      <p className="font-semibold">Allow advertising measurement?</p>
      <p className="mt-2 text-sm">With your permission, Google and Meta use cookies and purchase information to measure our ads. We do not send your name, email, or card details. Your choice does not affect checkout. <Link href="/privacy" className="underline">Privacy policy</Link></p>
      <div className="mt-4 flex gap-4"><button onClick={() => choose("no")} className="border px-4 py-2">Decline</button><button onClick={() => choose("yes")} className="border px-4 py-2">Allow measurement</button></div>
    </aside> : <button onClick={() => setSettings(true)} className="fixed bottom-2 left-2 z-[70] bg-night px-3 py-2 text-xs text-white">Privacy choices</button>}
  </>;
}

export function PurchaseMeasurement({ sessionId, confirmed, googleDestination, pixelId }: {
  sessionId: string; confirmed: boolean; googleDestination: string; pixelId: string;
}) {
  useEffect(() => {
    if (!confirmed) return;
    let cancelled = false;
    let purchase: Purchase | null = null;
    const send = () => {
      if (cancelled || consent() !== "yes" || !purchase) return;
      // Meta includes the current page URL: remove the Stripe capability before handing off any event.
      if (window.location.pathname === "/checkout/success" && window.location.search) {
        window.history.replaceState(window.history.state, "", cleanUrl());
      }
      // Deduplicate locally; Google also deduplicates by transaction_id. No capability-bearing Stripe URL is sent.
      for (const platform of ["google", "meta"]) {
        const key = `fluxline-purchase:${platform}:${purchase.transactionId}`;
        try {
          if (localStorage.getItem(key)) continue;
          if (platform === "google" && /^AW-\d+\/[A-Za-z0-9_-]+$/.test(googleDestination) && window.gtag) {
            window.gtag("event", "conversion", { send_to: googleDestination, value: purchase.value, currency: purchase.currency,
              transaction_id: purchase.transactionId, page_location: cleanUrl(), page_referrer: "" });
          } else if (platform === "meta" && /^\d+$/.test(pixelId) && window.fbq) {
            window.fbq("trackSingle", pixelId, "Purchase", { value: purchase.value, currency: purchase.currency }, { eventID: purchase.transactionId });
          } else continue;
          localStorage.setItem(key, "queued");
        } catch { /* Measurement must never affect a payment or receipt. */ }
      }
    };
    if (consent() === "yes") fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" })
      .then(r => r.json()).then(body => { if (validPurchase(body.purchase)) purchase = body.purchase; send(); }).catch(() => {});
    window.addEventListener(READY, send);
    return () => { cancelled = true; window.removeEventListener(READY, send); };
  }, [sessionId, confirmed, googleDestination, pixelId]);
  return null;
}

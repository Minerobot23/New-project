"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { validPurchase, type Purchase } from "@/lib/purchase";
import { track } from "@/lib/analytics";

const CONSENT = "fluxline-ad-measurement-v2";
const CHANGE = "fluxline-ad-consent";
const READY = "fluxline-ad-ready";
const OPEN = "fluxline-cookie-settings";
type Tracker = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Tracker; _fbq?: Tracker; fbq?: Tracker & { queue?: unknown[][]; push?: Tracker; loaded?: boolean; version?: string; callMethod?: Tracker }; }
}
export function subscribeMeasurement(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(CHANGE, callback); window.removeEventListener("storage", callback); };
}
export function consent() { try { return localStorage.getItem(CONSENT) ?? "unset"; } catch { return "unset"; } }
function choose(value: "yes" | "no") {
  const withdrawn = consent() === "yes" && value === "no";
  try { localStorage.setItem(CONSENT, value); } catch { /* unavailable storage: default to no tracking */ }
  window.dispatchEvent(new Event(CHANGE));
  // Only a withdrawal needs a reload, to remove third-party scripts already on the page.
  if (withdrawn) window.location.reload();
}
const configured = /^AW-\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "") || /^\d+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "");

/** Reopens the cookie banner; placed in the footer and privacy policy so a choice can be changed later. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!configured) return null;
  return <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN))} className={className}>Cookie settings</button>;
}
function cleanUrl() { return window.location.origin + window.location.pathname; }

export function Advertising({ nonce, googleId, pixelId }: { nonce: string; googleId: string; pixelId: string }) {
  const choice = useSyncExternalStore(subscribeMeasurement, consent, () => "unset");
  const pathname = usePathname();
  const [settings, setSettings] = useState(false);
  const google = /^AW-\d+$/.test(googleId) ? googleId : "";
  const pixel = /^\d+$/.test(pixelId) ? pixelId : "";
  const enabled = Boolean(google || pixel);

  useEffect(() => {
    const open = () => setSettings(true);
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  }, []);

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
    {(choice === "unset" || settings) && <aside aria-label="Cookie choices" className="fixed bottom-4 left-4 right-4 z-[80] max-w-xl border border-night-line bg-night p-5 text-white shadow-xl">
      <p className="font-semibold">This site uses cookies</p>
      <p className="mt-2 text-sm">We use cookies to understand how the site is used and to improve it. You can accept or decline, and change your choice any time from the footer. <Link href="/privacy" className="underline">Privacy policy</Link></p>
      <div className="mt-4 flex gap-4"><button onClick={() => { setSettings(false); choose("no"); }} className="border px-4 py-2">Decline</button><button onClick={() => { setSettings(false); choose("yes"); }} className="border px-4 py-2">Accept cookies</button></div>
    </aside>}
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
      for (const platform of ["google", "meta", "vercel"]) {
        const key = `fluxline-purchase:${platform}:${purchase.transactionId}`;
        try {
          if (localStorage.getItem(key)) continue;
          if (platform === "google" && /^AW-\d+\/[A-Za-z0-9_-]+$/.test(googleDestination) && window.gtag) {
            window.gtag("event", "conversion", { send_to: googleDestination, value: purchase.value, currency: purchase.currency,
              transaction_id: purchase.transactionId, page_location: cleanUrl(), page_referrer: "" });
          } else if (platform === "meta" && /^\d+$/.test(pixelId) && window.fbq) {
            window.fbq("trackSingle", pixelId, "Purchase", { value: purchase.value, currency: purchase.currency }, { eventID: purchase.transactionId });
          } else if (platform === "vercel") {
            track("deposit_paid", { value: purchase.value, currency: purchase.currency });
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

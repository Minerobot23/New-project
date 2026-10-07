import { track as vercelTrack } from "@vercel/analytics";

/**
 * Every custom event the site records. Keeping the list closed prevents typos
 * from silently creating new event names in the analytics dashboard.
 */
export type AnalyticsEvent =
  | "request_call_click"
  | "website_check_click"
  | "website_check_started"
  | "website_check_submitted"
  | "call_form_started"
  | "call_form_submitted"
  | "phone_click"
  | "email_click"
  | "simulator_started"
  | "simulator_industry_changed"
  | "simulator_before_viewed"
  | "simulator_after_viewed"
  | "simulator_mobile_viewed"
  | "portfolio_view"
  | "service_page_view";

type EventProps = Record<string, string | number | boolean | null>;

/**
 * Privacy-conscious event tracking. Vercel Web Analytics is cookieless and collects no personal data.
 * Never pass names, emails, phone numbers, or free text as properties.
 */
export function track(event: AnalyticsEvent, props?: EventProps) {
  try {
    // Page-level events can fire before <Analytics /> initializes its queue; create the same queue stub
    // the library uses so those early events are buffered instead of silently dropped.
    if (typeof window !== "undefined" && !window.va) {
      window.va = (...params) => {
        (window.vaq = window.vaq || []).push(params);
      };
    }
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
}

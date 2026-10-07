"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Records a named page-level event once per mount, e.g. service_page_view on industry pages. */
export function TrackPageView({ event, page }: { event: AnalyticsEvent; page: string }) {
  useEffect(() => {
    track(event, { page });
  }, [event, page]);
  return null;
}

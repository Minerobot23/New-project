"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAssetPreload, warmImages, type PreloadImage } from "@/experience";
import { VIA_HOME_KEY } from "./keys";

const subscribeNoop = () => () => {};
const cache = new Map<string, boolean>();

/** Read once per page load (cached), so clearing the flag doesn't bring the loader back. */
function readViaHome(id: string) {
  if (!cache.has(id)) {
    try {
      cache.set(id, window.sessionStorage.getItem(VIA_HOME_KEY) === id);
    } catch {
      cache.set(id, false);
    }
  }
  return cache.get(id)!;
}

/**
 * The shared frame around a client experience: the opening loader (skipped when the visitor came from
 * the Fluxline homepage), progressive loading of later scenes, concept notes, and hiding the chrome
 * while a form has the visitor's attention.
 */
export function useExperienceShell(
  id: string,
  critical: PreloadImage[],
  deferred: PreloadImage[],
  { inside, minDuration = 300 }: { inside: boolean; minDuration?: number },
) {
  const viaHome = useSyncExternalStore(
    subscribeNoop,
    () => readViaHome(id),
    () => false,
  );
  const { progress, done } = useAssetPreload(critical, { minDuration });
  const [loaderGone, setLoaderGone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [chromeHidden, setChromeHidden] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (inside) warmImages(deferred);
  }, [inside, deferred]);

  useEffect(() => {
    if (!done) return;
    const fade = window.setTimeout(() => setLoaderGone(true), 450);
    return () => window.clearTimeout(fade);
  }, [done]);

  useEffect(() => {
    try {
      window.sessionStorage.removeItem(VIA_HOME_KEY);
    } catch {}
    return () => window.clearTimeout(timer.current);
  }, []);

  const note = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 6000);
  }, []);
  const dismiss = useCallback(() => setMessage(null), []);

  return {
    showLoader: !viaHome && !loaderGone,
    loaderFading: done,
    progress,
    message,
    dismiss,
    note,
    chromeHidden,
    setChromeHidden,
  };
}

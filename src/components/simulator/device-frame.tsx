"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";

/** Measures the available width and returns a scale so a fixed-size virtual viewport fits it. */
function useFitScale(virtualWidth: number, maxScale = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setScale(Math.min(maxScale, element.clientWidth / virtualWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [virtualWidth, maxScale]);

  return { ref, scale };
}

type FrameProps = {
  url: string;
  children: ReactNode;
  overlay?: ReactNode;
  scrollKey: string;
};

const DESKTOP = { width: 1200, height: 760 };
const PHONE = { width: 390, height: 780 };

/** Browser window at a 1200px virtual width, scaled down to fit (CSS zoom keeps layout and scrolling native). */
export function DesktopFrame({ url, children, overlay, scrollKey }: FrameProps) {
  const { ref, scale } = useFitScale(DESKTOP.width);
  return (
    <div ref={ref} className="w-full">
      <div
        className="overflow-hidden rounded-[1.25rem] border border-line-strong bg-white shadow-[0_24px_60px_-28px_rgba(15,26,36,0.45)]"
        style={{ visibility: scale === null ? "hidden" : "visible" }}
      >
        <div className="flex items-center gap-3 border-b border-line bg-sunken px-3 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-white px-3 py-1 text-[11px] text-muted">
            <Lock aria-hidden="true" className="size-3 shrink-0" />
            {url}
          </span>
        </div>
        <div className="relative">
          <div style={{ width: DESKTOP.width, height: DESKTOP.height, zoom: scale ?? 1 }}>
            <div key={scrollKey} className="sim-viewport h-full overflow-y-auto overscroll-contain">
              {children}
            </div>
          </div>
          {overlay}
        </div>
      </div>
    </div>
  );
}

/** Phone at a 390px virtual width. Shown at full size when it fits, scaled down on very small screens. */
export function PhoneFrame({ url, children, overlay, scrollKey }: FrameProps) {
  const bezel = 12;
  const { ref, scale } = useFitScale(PHONE.width + bezel * 2);
  return (
    <div ref={ref} className="flex w-full justify-center">
      <div
        className="rounded-[44px] bg-[#0f1a24] shadow-[0_24px_60px_-24px_rgba(15,26,36,0.55)]"
        style={{ padding: bezel * (scale ?? 1), visibility: scale === null ? "hidden" : "visible" }}
      >
        <div className="relative overflow-hidden rounded-[32px] bg-white">
          <div style={{ width: PHONE.width, zoom: scale ?? 1 }}>
            <div className="flex items-center justify-between bg-white px-6 pb-1 pt-2.5 text-[12px] font-semibold text-[#111]">
              <span>9:41</span>
              <span className="truncate px-3 text-[11px] font-normal text-[#5f5f5f]">{url}</span>
              <span aria-hidden="true">●●●</span>
            </div>
            <div key={scrollKey} className="sim-viewport overflow-y-auto overscroll-contain" style={{ height: PHONE.height }}>
              {children}
            </div>
          </div>
          {overlay}
        </div>
      </div>
    </div>
  );
}

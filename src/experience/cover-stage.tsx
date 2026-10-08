"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useCoarsePointer, useReducedMotion } from "./use-reduced-motion";
import type { ExperienceImage } from "./types";

type Props = {
  image: ExperienceImage;
  /** Overlays positioned in photo percentages (hotspots, light, signage): they stay locked to the photo at any crop. */
  children?: ReactNode;
  /** Let the visitor drag sideways when the photo is wider than the screen (portrait phones). */
  pan?: boolean;
  /** Slow camera drift. */
  drift?: boolean;
  /** Subtle depth from the pointer on desktop. */
  parallax?: boolean;
  /** One sweep across the room on arrival, so phone visitors learn they can look around. */
  sweepOnArrival?: boolean;
  preload?: boolean;
  /** Colour grade and vignette drawn over the photo (not over children). */
  grade?: ReactNode;
  className?: string;
  imageClassName?: string;
  /** Defaults to the rendered width: full viewport width, or height x aspect ratio on portrait screens. */
  sizes?: string;
};

type Box = {
  width: number;
  height: number;
  left: number;
  top: number;
  viewW: number;
};

/** Where a cover-cropped photo lands on a screen of the given size, centred on its focal point. */
export function coverBox(viewW: number, viewH: number, ratio: number, focus: { x: number; y: number }): Box {
  const width = viewW / viewH > ratio ? viewW : viewH * ratio;
  const height = width / ratio;
  const clamp = (value: number, min: number) => Math.min(0, Math.max(min, value));
  return {
    width,
    height,
    left: clamp(viewW / 2 - focus.x * width, viewW - width),
    top: clamp(viewH / 2 - focus.y * height, viewH - height),
    viewW,
  };
}

/**
 * A photograph that fills the screen like `object-fit: cover`, but as a real box: children positioned
 * in photo percentages follow the crop, the drift, the parallax, and the visitor's panning.
 */
export function CoverStage({
  image,
  children,
  pan = false,
  drift = false,
  parallax = false,
  sweepOnArrival = false,
  preload = false,
  grade,
  className = "",
  imageClassName = "",
  sizes,
}: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const focus = image.focus ?? { x: 0.5, y: 0.5 };
  const ratio = image.src.width / image.src.height;

  // Measure the screen and size the photo to cover it, centred on the focal point.
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => setBox(coverBox(element.clientWidth, element.clientHeight, ratio, focus));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus is compared by value
  }, [ratio, focus.x, focus.y]);

  const overflow = box ? box.width - box.viewW : 0;
  const pannable = pan && overflow > 24;

  // Drag to look around (touch and mouse). Small movements still count as taps on hotspots.
  useEffect(() => {
    const element = frame.current;
    const target = stage.current;
    if (!element || !target || !box || !pannable) return;
    const toX = gsap.quickTo(target, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    let startX = 0;
    let base = 0;
    let current = 0;
    let dragging = false;
    let moved = false;
    const min = -(box.width - box.viewW) - box.left;
    const max = -box.left;
    const down = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      startX = event.clientX;
      base = current;
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) moved = true;
      current = Math.min(max, Math.max(min, base + delta));
      toX(current);
    };
    const up = () => {
      dragging = false;
    };
    const swallowClick = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    };
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    element.addEventListener("click", swallowClick, true);

    // Arrival sweep: start at one side of the room and settle on the focal point.
    if (sweepOnArrival && !reduced) {
      const from = Math.min(max, Math.max(min, overflow * 0.35));
      gsap.fromTo(target, { x: from }, { x: 0, duration: 2.6, ease: "power2.inOut", delay: 0.4 });
    }

    return () => {
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      element.removeEventListener("click", swallowClick, true);
    };
  }, [box, pannable, overflow, sweepOnArrival, reduced]);

  // Pointer parallax on desktop: the room shifts a few pixels against the cursor.
  useEffect(() => {
    const target = stage.current;
    if (!target || !parallax || reduced || coarse) return;
    const toX = gsap.quickTo(target, "xPercent", {
      duration: 1.4,
      ease: "power3.out",
    });
    const toY = gsap.quickTo(target, "yPercent", {
      duration: 1.4,
      ease: "power3.out",
    });
    const move = (event: PointerEvent) => {
      toX((0.5 - event.clientX / window.innerWidth) * 1.6);
      toY((0.5 - event.clientY / window.innerHeight) * 1.2);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [parallax, reduced, coarse]);

  return (
    <div
      ref={frame}
      className={`absolute inset-0 overflow-hidden ${pannable ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""} ${className}`}
    >
      <div
        ref={stage}
        className="absolute"
        style={
          box
            ? {
                width: box.width,
                height: box.height,
                left: box.left,
                top: box.top,
              }
            : { inset: 0 }
        }
      >
        <div className={`absolute inset-0 ${drift ? "drift" : ""}`}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            // On portrait screens the photo is height-led (and pannable), so it renders wider than the viewport.
            sizes={sizes ?? `(orientation: portrait) ${Math.ceil(ratio * 100)}vh, 100vw`}
            placeholder="blur"
            preload={preload}
            draggable={false}
            className={`select-none ${box ? "object-fill" : "object-cover"} ${imageClassName}`}
            style={box ? undefined : { objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }}
          />
          {grade}
          {box && children}
        </div>
      </div>
    </div>
  );
}

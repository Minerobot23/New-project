"use client";

import Image from "next/image";
import { useRef, type WheelEvent } from "react";
import { ASSETS } from "../assets";
import { BackToRoom } from "../parts";

const FRAMES = [
  { image: ASSETS.mainRoom, caption: "The dining room" },
  { image: ASSETS.pastaOverhead, caption: "Tagliatelle, clams" },
  { image: ASSETS.sala, caption: "The Salon" },
  { image: ASSETS.wineGlass, caption: "At the bar" },
  { image: ASSETS.tableService, caption: "Sea bass, beurre blanc" },
  { image: ASSETS.pastaDetail, caption: "Pappardelle, mushrooms" },
];

/** A strip of photographs at full height. Scroll, swipe, or use the arrow keys to move along it. */
export function Gallery() {
  const strip = useRef<HTMLUListElement>(null);
  // A vertical mouse wheel moves the strip sideways, so desktop visitors don't need a trackpad.
  const wheel = (event: WheelEvent<HTMLUListElement>) => {
    if (!strip.current || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    strip.current.scrollLeft += event.deltaY;
  };

  return (
    <>
      <BackToRoom />
      <h2 data-scene-focus tabIndex={-1} className="label absolute right-5 top-24 z-20 text-bone/60 outline-none sm:right-8">
        Gallery
      </h2>
      <ul
        ref={strip}
        onWheel={wheel}
        tabIndex={0}
        aria-label="Photographs of Maison Arden"
        className="stagger absolute inset-x-0 bottom-0 top-36 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-5 pb-28 outline-none sm:gap-8 sm:px-8 md:pb-24 [scrollbar-width:none]"
      >
        {FRAMES.map(({ image, caption }) => (
          <li key={caption} className="w-[86vw] shrink-0 snap-center sm:h-full sm:w-auto">
            <figure className="sm:h-full">
              {/* Width-led on phones, height-led on larger screens; the photo keeps its own proportions. */}
              <div
                className="relative w-full sm:h-[calc(100%-2.75rem)] sm:w-auto"
                style={{
                  aspectRatio: `${image.src.width} / ${image.src.height}`,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 70vw, 90vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-serif text-lg italic text-bone/75">{caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}

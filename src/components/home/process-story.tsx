"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";

const STEPS = [
  {
    title: "We visit",
    body: "We spend time in the business: how customers arrive, what they look at first, what they ask, and what they came to do.",
  },
  {
    title: "We capture",
    body: "Photography, video, and spatial shots planned around the experience, not taken at random. Every frame has a job.",
  },
  {
    title: "We design the experience",
    body: "We decide what customers should see, explore, and do, and where in the place each of those things lives.",
  },
  {
    title: "We build",
    body: "Responsive, interactive development that feels as deliberate on a phone in a parking lot as on a desktop at home.",
  },
  {
    title: "We convert",
    body: "Calls, reservations, orders, appointments, and quote requests are built into the experience, where the decision happens.",
  },
];

const POINTS = [
  { x: 13, y: 27, label: "Menu" },
  { x: 81, y: 44, label: "The bar" },
  { x: 55, y: 74, label: "Reserve" },
  { x: 6, y: 53, label: "Private dining" },
];

/**
 * The process told with one photograph that gains a layer per step:
 * the room as found, the viewfinder, the points of interest, the interface, and the booking.
 */
export function ProcessStory() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const on = (step: number) => (active >= step ? "opacity-100" : "opacity-0");

  return (
    <section aria-labelledby="process-title" data-tone="dark" className="bg-stage text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 sm:px-8 sm:pt-32">
        <p className="label text-bone/50">How we work</p>
        <h2 id="process-title" className="display mt-5 max-w-[16ch] text-[2.4rem] uppercase sm:text-[clamp(3rem,5vw,4.75rem)]">
          From the front door to the booking.
        </h2>
      </div>

      <div className="mx-auto grid max-w-[90rem] gap-x-12 px-5 pb-24 sm:px-8 lg:grid-cols-12">
        {/* The photograph stays in view while the steps scroll past it. */}
        <div className="sticky top-16 z-10 -mx-5 bg-stage px-5 pb-4 pt-6 sm:-mx-8 sm:px-8 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-4rem)] lg:px-0 lg:py-0">
          <figure className="lg:flex lg:h-full lg:items-center">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={mainRoom}
                alt="The Maison Arden dining room, shown at each stage of the process"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                placeholder="blur"
                className={`object-cover transition-[filter,transform] duration-1000 ${active === 0 ? "scale-[1.04] saturate-[0.85]" : "scale-100"}`}
              />

              {/* 02: the viewfinder. */}
              <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${active === 1 ? "opacity-100" : "opacity-0"}`}>
                <div className="absolute inset-[6%] border border-white/30" />
                <div className="absolute inset-y-[6%] left-1/3 w-px bg-white/25" />
                <div className="absolute inset-y-[6%] left-2/3 w-px bg-white/25" />
                <div className="absolute inset-x-[6%] top-1/3 h-px bg-white/25" />
                <div className="absolute inset-x-[6%] top-2/3 h-px bg-white/25" />
                {["left-[6%] top-[6%] border-l-2 border-t-2", "right-[6%] top-[6%] border-r-2 border-t-2", "bottom-[6%] left-[6%] border-b-2 border-l-2", "bottom-[6%] right-[6%] border-b-2 border-r-2"].map((corner) => (
                  <span key={corner} className={`absolute size-6 border-white ${corner}`} />
                ))}
                <p className="absolute inset-x-0 bottom-[1.5%] text-center font-mono text-[10px] tracking-wider text-white sm:text-xs">
                  18 mm · f/5.6 · 1/30 s · ISO 800 · tripod
                </p>
              </div>

              {/* 03: points of interest, on the real objects. */}
              <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${on(2)}`}>
                {POINTS.map((point) => (
                  <span key={point.label} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                    <span className="beacon relative block size-3 rounded-full text-bone">
                      <span className="absolute inset-[3px] rounded-full bg-bone" />
                    </span>
                    <span className="label hidden text-[10px] text-bone [text-shadow:0_1px_10px_rgba(0,0,0,0.9)] sm:inline">{point.label}</span>
                  </span>
                ))}
              </div>

              {/* 04: the interface around the room. */}
              <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${on(3)}`}>
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-[4%] pb-8 pt-[3%]">
                  <span className="font-serif text-sm text-bone sm:text-lg">Maison Arden</span>
                  <span className="label text-[9px] text-bone/70">Exit</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex gap-[5%] bg-gradient-to-t from-black/70 to-transparent px-[4%] pb-[3%] pt-10">
                  {["Menu", "Reserve", "The bar", "Private dining"].map((item) => (
                    <span key={item} className="label hidden text-[9px] text-bone/80 sm:inline">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* 05: the booking, made from inside the experience. */}
              <div aria-hidden="true" className={`absolute bottom-[8%] right-[4%] bg-stage/90 px-4 py-3 text-bone transition-all duration-700 sm:px-6 sm:py-5 ${active >= 4 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <p className="label text-[9px] text-bone/60">Reservation requested</p>
                <p className="mt-1 font-serif text-base sm:text-2xl">A table for 2, Friday, 7:30</p>
              </div>
            </div>
            <figcaption className="sr-only">Maison Arden is a Fluxline Interactive Concept.</figcaption>
          </figure>
        </div>

        <ol className="lg:order-1 lg:col-span-5">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              ref={(element) => {
                steps.current[index] = element;
              }}
              data-step={index}
              className={`flex flex-col justify-center border-t border-bone/15 py-14 transition-opacity duration-700 lg:min-h-[78svh] lg:py-0 ${
                active === index ? "opacity-100" : "opacity-35"
              }`}
            >
              <span className="font-mono text-sm text-bone/50">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-[1.9rem] uppercase sm:text-[2.6rem]">{step.title}</h3>
              <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-bone/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { ContextCTA, originOf, prefersReducedMotion, revealLines, type ExperienceImage } from "@/experience";
import { ASSETS, reframe } from "../assets";
import { COURSES } from "../content";
import { useRestaurant } from "../context";
import { BackToRoom, MenuLine } from "../parts";

/**
 * One photograph per course. Placeholders re-frame shared photos (a zoom around a different subject);
 * each course has its own dedicated slot in the capture guide, and a real shot needs no zoom.
 */
const COURSE_ZOOM: Record<string, number> = {
  starters: 1.7,
  mains: 1.3,
  dessert: 1.6,
  drinks: 1.15,
};
const COURSE_IMAGES: Record<string, ExperienceImage> = {
  starters: reframe(
    ASSETS.tableService,
    { x: 0.14, y: 0.42 },
    "menu/starters",
    "Bread and chilled white wine at the start of a meal",
  ),
  pasta: ASSETS.pastaOverhead,
  mains: reframe(ASSETS.tableService, { x: 0.52, y: 0.55 }, "menu/mains"),
  dessert: reframe(ASSETS.sala, { x: 0.8, y: 0.86 }, "menu/dessert", "Gold-rimmed plates set for the final course"),
  drinks: reframe(ASSETS.wineGlass, { x: 0.3, y: 0.5 }, "menu/drinks"),
};

/**
 * The menu as a sequence of courses, not a grid. Changing course wipes the next photograph up
 * over the last, like turning a page; the dishes rise in beside it.
 */
export function Menu() {
  const { go } = useRestaurant();
  const [index, setIndex] = useState(0);
  const [frames, setFrames] = useState([{ key: 0, course: COURSES[0].id }]);
  const counter = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const course = COURSES[index];

  const choose = (next: number) => {
    if (next === index) return;
    counter.current += 1;
    setIndex(next);
    setFrames((current) => [...current.slice(-1), { key: counter.current, course: COURSES[next].id }]);
  };

  // Animate the newest frame in over the previous one, then drop the old frame.
  useLayoutEffect(() => {
    if (frames.length < 2 || !stage.current) return;
    const incoming = stage.current.querySelector<HTMLElement>(`[data-frame="${frames[1].key}"]`);
    const outgoing = stage.current.querySelector<HTMLElement>(`[data-frame="${frames[0].key}"]`);
    const reduced = prefersReducedMotion();
    const tl = gsap.timeline({
      onComplete: () => setFrames((current) => current.slice(-1)),
    });
    if (reduced) {
      tl.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      tl.fromTo(
        incoming,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power3.inOut",
        },
      )
        .fromTo(incoming?.firstElementChild ?? null, { scale: 1.22 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0)
        .to(
          outgoing,
          {
            scale: 1.08,
            filter: "brightness(0.45)",
            duration: 1.15,
            ease: "power3.inOut",
          },
          0,
        );
    }
    if (list.current)
      revealLines(list.current.querySelectorAll(".menu-line, .course-title"), {
        delay: 0.25,
        reduced,
      });
    return () => {
      tl.kill();
    };
  }, [frames]);

  return (
    <div className="absolute inset-0 flex flex-col text-bone md:flex-row-reverse">
      {/* Photograph: top half on phones, the right side on larger screens. */}
      <div ref={stage} className="relative h-[42svh] shrink-0 overflow-hidden md:h-auto md:w-[56%]">
        {frames.map((frame) => {
          const image = COURSE_IMAGES[frame.course];
          return (
            <div key={frame.key} data-frame={frame.key} className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${COURSE_ZOOM[frame.course] ?? 1})`,
                    transformOrigin: `${(image.focus?.x ?? 0.5) * 100}% ${(image.focus?.y ?? 0.5) * 100}%`,
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 56vw, 100vw"
                    placeholder="blur"
                    className="object-cover"
                    style={{
                      objectPosition: `${(image.focus?.x ?? 0.5) * 100}% ${(image.focus?.y ?? 0.5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stage to-transparent md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-1/4 md:bg-gradient-to-r"
        />
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-stage">
        <div className="hidden md:block">
          <BackToRoom />
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 sm:px-10 md:pt-40">
          <h2 data-scene-focus tabIndex={-1} className="sr-only">
            The menu
          </h2>

          {/* Courses: a row of numerals that scrolls sideways on phones. */}
          <div
            role="tablist"
            aria-label="Courses"
            className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-2 sm:-mx-10 sm:px-10 [scrollbar-width:none]"
          >
            {COURSES.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={i === index}
                aria-controls="course-panel"
                onClick={() => choose(i)}
                className={`label shrink-0 whitespace-nowrap border-b py-2 transition-colors ${
                  i === index ? "border-bone text-bone" : "border-transparent text-bone/50 hover:text-bone"
                }`}
              >
                <span className="mr-2 font-serif text-sm normal-case tracking-normal">{item.numeral}</span>
                {item.title}
              </button>
            ))}
          </div>

          <div
            ref={list}
            id="course-panel"
            role="tabpanel"
            aria-label={course.title}
            className="min-h-0 flex-1 overflow-y-auto pb-28 pt-6 md:pb-12"
          >
            <p className="course-title font-serif text-[3.2rem] italic leading-none sm:text-[4.75rem]">{course.title}</p>
            <ul className="mt-6 max-w-xl">
              {course.dishes.map((dish) => (
                <MenuLine key={`${course.id}-${dish.name}`} {...dish} />
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {index < COURSES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => choose(index + 1)}
                  className="label group flex h-11 items-center gap-3 text-bone/80 hover:text-bone"
                >
                  Next: {COURSES[index + 1].title}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                <ContextCTA onClick={(event) => go("reserve", originOf(event.currentTarget))}>Reserve a table</ContextCTA>
              )}
              <div className="md:hidden">
                <BackToRoomInline />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackToRoomInline() {
  const { back } = useRestaurant();
  return (
    <button type="button" onClick={() => back()} className="label flex h-11 items-center text-bone/60 hover:text-bone">
      ← The dining room
    </button>
  );
}

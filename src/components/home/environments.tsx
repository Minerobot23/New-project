"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useRef } from "react";
import { prefersReducedMotion } from "@/experience";
import { VIA_HOME_KEY } from "@/experiences/restaurant/keys";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";
import house from "../../../public/images/industry-roofers.webp";
import wheel from "../../../public/demo/auto-brakes.webp";

type Environment = {
  id: string;
  name: string;
  line: string;
  image: StaticImageData;
  alt: string;
  focus: string;
  /** A live experience opens in place; one still in production links to the current concept instead. */
  experience?: string;
  concept?: { href: string; label: string };
};

const ENVIRONMENTS: Environment[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    line: "Walk in. Find a table. Plan the party.",
    image: mainRoom,
    alt: "A bistro dining room in warm evening light",
    focus: "52% 50%",
    experience: "/experiences/restaurant",
  },
  {
    id: "home",
    name: "Home",
    line: "The house becomes the interface.",
    image: house,
    alt: "A roofer stripping old shingles from a house roof",
    focus: "70% 40%",
    concept: { href: "/websites-for-hvac-companies#demo", label: "Experience in production" },
  },
  {
    id: "automotive",
    name: "Automotive",
    line: "The vehicle is the website.",
    image: wheel,
    alt: "A technician's gloved hands on a car wheel in a service bay",
    focus: "70% 50%",
    concept: { href: "/websites-for-auto-repair-shops#demo", label: "Experience in production" },
  },
];

export const CHOOSER_IMAGES = ENVIRONMENTS.map((environment) => ({
  src: environment.image,
  sizes: "(min-width: 768px) 50vw, 100vw",
}));

/**
 * "Build something people remember." Three environments as full-height panels. On larger screens the
 * panel under the pointer widens; choosing a live experience expands it to the whole screen and walks in.
 */
export function EnvironmentChooser() {
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const curtainImage = useRef<HTMLDivElement>(null);

  const open = (environment: Environment, panel: HTMLElement) => {
    if (!environment.experience) return;
    const href = environment.experience;
    try {
      window.sessionStorage.setItem(VIA_HOME_KEY, environment.id);
    } catch {}
    router.prefetch(href);
    if (prefersReducedMotion() || !curtain.current) {
      router.push(href);
      return;
    }
    // Grow a copy of the chosen panel from its own rectangle to the whole screen, then fade to black and go in.
    const box = panel.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const inset = `inset(${box.top}px ${W - box.right}px ${H - box.bottom}px ${box.left}px)`;
    gsap
      .timeline({ onComplete: () => router.push(href) })
      .set(curtain.current, { display: "block", clipPath: inset })
      .to(curtain.current, { clipPath: "inset(0px 0px 0px 0px)", duration: 1.1, ease: "power4.inOut" })
      .fromTo(curtainImage.current, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: "power3.out" }, 0)
      .to(curtainImage.current, { opacity: 0, duration: 0.7, ease: "power2.in" }, 1.0);
  };

  return (
    <section
      aria-labelledby="environments-title"
      data-tone="dark"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col bg-stage text-bone"
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-6 pt-8 sm:px-8 sm:pt-10">
        <h1 className="label text-bone/55">Fluxline Solutions: immersive websites for real-world businesses</h1>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2
            id="environments-title"
            tabIndex={-1}
            className="display max-w-[22ch] text-[2.1rem] uppercase outline-none sm:text-[clamp(2.5rem,4.4vw,4.2rem)]"
          >
            Build something people remember.
          </h2>
          <p className="label text-bone/55 md:pb-3">Choose an environment</p>
        </div>
      </div>

      <ul className="flex min-h-[70svh] flex-1 flex-col gap-px md:flex-row">
        {ENVIRONMENTS.map((environment) => {
          const live = Boolean(environment.experience);
          const body = (
            <>
              <div data-environment className="absolute inset-0">
                <Image
                  src={environment.image}
                  alt={environment.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder="blur"
                  className={`object-cover transition-[transform,filter] duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04] ${
                    live ? "" : "grayscale-[0.6] group-hover:grayscale-0"
                  }`}
                  style={{ objectPosition: environment.focus }}
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <div className="relative mt-auto p-5 sm:p-8">
                <p className="label text-bone/70">{live ? "Interactive concept" : environment.concept?.label}</p>
                <p className="display mt-3 text-[2rem] uppercase leading-none sm:text-[2.6rem]">{environment.name}</p>
                <p className="mt-3 max-w-[30ch] font-serif text-xl italic text-bone/80">{environment.line}</p>
                <p className="label mt-6 inline-flex items-center gap-3 text-bone">
                  {live ? "Enter the experience" : "See the current concept"}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </div>
            </>
          );
          return (
            <li
              key={environment.id}
              className="relative flex min-h-[30svh] flex-1 transition-[flex-grow] duration-[900ms] ease-[var(--ease-out-soft)] md:hover:flex-[1.6] md:focus-within:flex-[1.6]"
            >
              {live ? (
                <button
                  type="button"
                  onClick={(event) => open(environment, event.currentTarget)}
                  className="group relative flex flex-1 flex-col overflow-hidden text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
                >
                  {body}
                </button>
              ) : (
                <Link
                  href={environment.concept!.href}
                  className="group relative flex flex-1 flex-col overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* The chosen environment grows to fill the screen before the experience begins. */}
      <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[70] hidden overflow-hidden bg-stage">
        <div ref={curtainImage} className="absolute inset-0">
          <Image src={mainRoom} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

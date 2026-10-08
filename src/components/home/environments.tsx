import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";
import house from "../../../public/experiences/home/arrival/house-dusk.webp";
import garage from "../../../public/experiences/automotive/arrival/garage-door.webp";

type Demo = {
  id: string;
  /** The fictional business the demo is built around. */
  name: string;
  kind: string;
  line: string;
  image: StaticImageData;
  alt: string;
  focus: string;
  href: string;
};

const DEMOS: Demo[] = [
  {
    id: "restaurant",
    name: "Maison Arden",
    kind: "Restaurant",
    line: "Walk in, read the menu, plan a private dinner.",
    image: mainRoom,
    alt: "A bistro dining room in warm evening light",
    focus: "52% 50%",
    href: "/experiences/restaurant",
  },
  {
    id: "home",
    name: "Saltbox Home Co.",
    kind: "Home services",
    line: "Tap the roof, the siding, the kitchen. Ask for an estimate.",
    image: house,
    alt: "A two-story house at dusk with its windows lit",
    focus: "50% 45%",
    href: "/experiences/home",
  },
  {
    id: "automotive",
    name: "Halden Motor Works",
    kind: "Auto service",
    line: "Pull into the bay and choose what the car needs.",
    image: garage,
    alt: "A car under red tail light in front of an open garage door",
    focus: "55% 55%",
    href: "/experiences/automotive",
  },
];

/**
 * The opening of the homepage: the offer, the two actions, and the three demos, all visible
 * without a gate. Each demo is an ordinary link showing a still frame; a demo's large media only
 * loads once the visitor opens it.
 */
export function EnvironmentChooser() {
  return (
    <section aria-labelledby="hero-title" data-tone="dark" className="relative bg-stage text-bone">
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-8 pt-9 sm:px-8 sm:pb-9 sm:pt-11">
        <p className="label text-bone/60">Fluxline Solutions · Web design for local businesses</p>
        <h1
          id="hero-title"
          className="display mt-4 max-w-[24ch] text-balance text-[2.1rem] uppercase sm:text-[clamp(2.4rem,4vw,3.9rem)]"
        >
          Your business deserves a website people remember.
        </h1>
        <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-bone/80 sm:text-lg">
          We design and build cinematic websites for restaurants, home services, and local businesses across Long Island
          and Queens: strong imagery, useful interactions, and a clear next step for your customers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="#demos" variant="inverse" size="lg">
            Explore the demos
          </ButtonLink>
          <ButtonLink href="/request-a-call" variant="ghost-inverse" size="lg">
            Request a call
          </ButtonLink>
        </div>
      </div>

      <div id="demos" className="scroll-mt-16">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-2 px-5 pb-5 sm:px-8 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-[1.6rem] uppercase sm:text-[2.2rem]">Explore what your website could feel like.</h2>
          <p className="label text-bone/60 md:pb-1.5">Three interactive concepts · fictional businesses</p>
        </div>
        <ul className="flex flex-col gap-px lg:min-h-[52svh] lg:flex-row">
          {DEMOS.map((demo, index) => (
            <li
              key={demo.id}
              className="relative flex min-h-[42svh] min-w-0 flex-1 transition-[flex-grow] duration-[900ms] ease-[var(--ease-out-soft)] lg:min-h-0 lg:hover:flex-[1.5] lg:focus-within:flex-[1.5]"
            >
              <Link
                href={demo.href}
                className="group relative flex flex-1 flex-col overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
              >
                <div className="absolute inset-0">
                  <Image
                    src={demo.image}
                    alt={demo.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    placeholder="blur"
                    priority={index === 0}
                    className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    style={{ objectPosition: demo.focus }}
                  />
                </div>
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="relative mt-auto p-5 sm:p-8">
                  <p className="label text-bone/75">Interactive concept · {demo.kind}</p>
                  <p className="display mt-3 text-[2rem] uppercase leading-none sm:text-[2.4rem]">{demo.name}</p>
                  <p className="mt-3 max-w-[30ch] font-serif text-xl italic text-bone/85">{demo.line}</p>
                  <p className="label mt-6 inline-flex items-center gap-3 text-bone">
                    Open the demo
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

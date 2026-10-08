import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ClosingCta } from "@/components/shared/closing-cta";
import { TrackPageView } from "@/components/analytics/track-page-view";
import { pageMetadata } from "@/lib/seo";
import mainRoom from "../../../public/experiences/restaurant/interior/main-room.webp";
import house from "../../../public/experiences/home/arrival/house-dusk.webp";
import garage from "../../../public/experiences/automotive/arrival/garage-door.webp";

export const metadata = pageMetadata({
  title: "Experiences",
  description:
    "Immersive website experiences by Fluxline Solutions: walk into Maison Arden, a restaurant; light up Saltbox Home Co., a home remodeler; and pull into Halden Motor Works, an auto shop. All three are interactive concepts.",
  path: "/experiences",
});

type Entry = {
  name: string;
  kind: string;
  line: string;
  image: StaticImageData;
  alt: string;
  focus: string;
  status: string;
  href: string;
  action: string;
};

const ENTRIES: Entry[] = [
  {
    name: "Maison Arden",
    kind: "Restaurant",
    line: "Approach the door, walk into the dining room, sit at the bar, read the menu course by course, and plan a private dinner in the salon.",
    image: mainRoom,
    alt: "The Maison Arden dining room in warm evening light",
    focus: "52% 50%",
    status: "Fluxline Interactive Concept",
    href: "/experiences/restaurant",
    action: "Enter the experience",
  },
  {
    name: "Saltbox Home Co.",
    kind: "Home Services",
    line: "The lights come on in a house at dusk. Choose the roof, siding, windows, kitchen, bath, or backyard, browse the work, pick materials, and request an estimate.",
    image: house,
    alt: "A two-story house at dusk with its windows lit",
    focus: "50% 45%",
    status: "Fluxline Interactive Concept",
    href: "/experiences/home",
    action: "Enter the experience",
  },
  {
    name: "Halden Motor Works",
    kind: "Automotive",
    line: "The garage door lifts and the car pulls into the bay. Paint, wheels, brakes, interior, detailing, and maintenance start from the car itself, and drop-off is booked from there.",
    image: garage,
    alt: "A car under red tail light in front of an open garage door",
    focus: "55% 55%",
    status: "Fluxline Interactive Concept",
    href: "/experiences/automotive",
    action: "Enter the experience",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <TrackPageView event="portfolio_view" page="/experiences" />
      <div data-tone="dark" className="bg-stage text-bone">
        <header className="mx-auto max-w-[90rem] px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
          <p className="label text-bone/55">Experiences</p>
          <h1 className="display mt-6 max-w-[15ch] text-[2.6rem] uppercase sm:text-[clamp(3.25rem,6.6vw,6.4rem)]">
            Projects open as places, not portfolio cards.
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-bone/70">
            Concepts are labeled as concepts: fictional businesses built to show what we make. Client experiences will appear here
            as they launch, with each client&apos;s permission.
          </p>
        </header>

        <ul>
          {ENTRIES.map((entry, index) => (
            <li key={entry.name} className="border-t border-bone/15">
              <Link
                href={entry.href}
                className="group relative flex min-h-[78svh] flex-col overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
              >
                <Image
                  src={entry.image}
                  alt={entry.alt}
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  preload={index === 0}
                  className={`object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04] ${index === 0 ? "" : "grayscale-[0.5]"}`}
                  style={{ objectPosition: entry.focus }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="relative mx-auto mt-auto grid w-full max-w-[90rem] gap-6 px-5 pb-10 sm:px-8 sm:pb-14 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <p className="label text-bone/70">
                      {entry.kind} · {entry.status}
                    </p>
                    <h2 className="display mt-4 text-[2.4rem] uppercase leading-none sm:text-[clamp(3rem,6vw,5.6rem)]">
                      {entry.name}
                    </h2>
                  </div>
                  <div className="lg:col-span-4 lg:col-start-9">
                    <p className="font-serif text-xl italic leading-snug text-bone/85 sm:text-2xl">{entry.line}</p>
                    <p className="label mt-6 inline-flex items-center gap-3">
                      {entry.action}
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ClosingCta
        title="Your business could be the next experience here."
        body="Tell us about the place and what you want customers to do. We'll tell you what we'd capture and how we'd build it."
      />
    </>
  );
}

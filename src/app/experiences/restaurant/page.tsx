import Link from "next/link";
import { RestaurantExperience } from "@/experiences/restaurant/restaurant-experience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Maison Arden: Restaurant Experience (Interactive Concept)",
  description:
    "Walk into Maison Arden, a fictional bistro built by Fluxline Solutions as an interactive concept: an immersive restaurant website with a cinematic entrance, a menu told course by course, reservations, and private dining enquiries.",
  path: "/experiences/restaurant",
});

export default function RestaurantExperiencePage() {
  return (
    <>
      <RestaurantExperience />
      {/* Without JavaScript the experience can't run; say what it is and offer the way back. */}
      <noscript>
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-stage px-6 text-center text-bone">
          <p className="font-serif text-4xl">Maison Arden</p>
          <p className="max-w-md text-bone/75">
            This interactive restaurant concept by Fluxline Solutions needs JavaScript to run. Turn it on to walk through the
            entrance, the dining room, the menu, and private dining.
          </p>
          <Link href="/" className="label underline underline-offset-4">
            Back to Fluxline
          </Link>
        </div>
      </noscript>
    </>
  );
}

import Link from "next/link";
import { HomeExperience } from "@/experiences/home/home-experience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Saltbox Home Co.: Home Services Experience (Interactive Concept)",
  description:
    "Explore a house at dusk and choose what to transform: roof, siding, windows, kitchen, bathroom, or outdoor living. An immersive home services website concept by Fluxline Solutions, with project comparisons, materials, and an estimate request.",
  path: "/experiences/home",
});

export default function HomeServicesExperiencePage() {
  return (
    <>
      <HomeExperience />
      <noscript>
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-stage px-6 text-center text-bone">
          <p className="font-display text-3xl font-light uppercase">Saltbox Home Co.</p>
          <p className="max-w-md text-bone/75">
            This interactive home services concept by Fluxline Solutions needs JavaScript to run. Turn it on to explore the house
            and request an estimate.
          </p>
          <Link href="/" className="label underline underline-offset-4">
            Back to Fluxline
          </Link>
        </div>
      </noscript>
    </>
  );
}

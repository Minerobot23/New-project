import Link from "next/link";
import { AutoExperience } from "@/experiences/automotive/auto-experience";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Halden Motor Works: Automotive Experience (Interactive Concept)",
  description:
    "A garage door lifts, the car pulls into the bay, and the vehicle becomes the menu: paint, wheels, brakes, interior, detailing, and maintenance. An immersive auto service website concept by Fluxline Solutions, with service details and drop-off scheduling.",
  path: "/experiences/automotive",
});

export default function AutomotiveExperiencePage() {
  return (
    <>
      <AutoExperience />
      <noscript>
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-stage px-6 text-center text-bone">
          <p className="condensed text-4xl">Halden Motor Works</p>
          <p className="max-w-md text-bone/75">
            This interactive auto service concept by Fluxline Solutions needs JavaScript to run. Turn it on to walk into the bay
            and schedule service.
          </p>
          <Link href="/" className="label underline underline-offset-4">
            Back to Fluxline
          </Link>
        </div>
      </noscript>
    </>
  );
}

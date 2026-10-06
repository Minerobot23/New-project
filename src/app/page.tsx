import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ValueComparison } from "@/components/sections/value-comparison";
import { WhoWeHelp } from "@/components/sections/who-we-help";
import { WhyFluxline } from "@/components/sections/why-fluxline";
import { DataHandling } from "@/components/sections/data-handling";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";
import { ClosingCta } from "@/components/sections/closing-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <ValueComparison />
      <WhoWeHelp />
      <WhyFluxline />
      <DataHandling />
      <About />
      <Faq />
      <ClosingCta />
    </>
  );
}

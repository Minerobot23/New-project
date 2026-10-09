import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BASE, business, photos, primaryServices } from "./content";
import { EmergencyCallButton } from "./chrome";
import { Annotation } from "./presentation";

const FACTS = ["24/7 emergency service", "Works with your insurance company", "Free consultation"];

export function CsHero() {
  return (
    <section
      id="top"
      data-present="First impression"
      aria-labelledby="cs-hero-title"
      className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden bg-cs-night text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={photos.hero.src}
          alt=""
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          className="cs-push object-cover object-[70%_40%]"
        />
        {/* Left-weighted scrim keeps the headline readable over the brightest sky. */}
        <div className="absolute inset-0 bg-gradient-to-r from-cs-night via-cs-night/75 to-cs-night/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-cs-night via-transparent to-cs-night/40" />
      </div>

      <div className="mx-auto flex w-full max-w-[84rem] flex-1 flex-col px-5 pt-14 sm:px-8 sm:pt-20 lg:pt-24">
        <Annotation n={1} title="A stronger first impression" tone="dark">
          The first screen answers the three questions a homeowner has in an emergency: can you help, are you available now, and how do I reach
          you. The phone call is the primary action, not a contact form.
        </Annotation>

        <p className="intro-rise flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80" style={{ "--i": 0 } as CSSProperties}>
          <span aria-hidden="true" className="cs-live size-2 rounded-full bg-cs-alert" />
          24/7 Emergency Response<span className="hidden sm:inline"> · Oakdale, NY</span>
        </p>

        <h1 id="cs-hero-title" className="mt-6 max-w-[13ch] font-display text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[clamp(3.75rem,7vw,6.5rem)]" style={{ fontStretch: "106%" }}>
          <span className="line-mask keep-lines">
            <span style={{ "--i": 0 } as CSSProperties}>When Disaster</span>
          </span>
          <span className="line-mask keep-lines">
            <span style={{ "--i": 1 } as CSSProperties}>
              Strikes, <span className="text-cs-sky">We&apos;re</span>
            </span>
          </span>
          <span className="line-mask keep-lines">
            <span style={{ "--i": 2 } as CSSProperties} className="text-cs-sky">
              Ready.
            </span>
          </span>
        </h1>

        <p className="intro-rise mt-7 max-w-[40ch] text-lg leading-relaxed text-white/80 sm:text-xl" style={{ "--i": 3 } as CSSProperties}>
          24/7 Water, Fire &amp; Mold Damage Restoration Across Long Island and the Tri-State Area.
        </p>

        <div className="intro-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--i": 4 } as CSSProperties}>
          <EmergencyCallButton size="lg" className="w-full sm:w-auto" />
          <Link
            href="#assessment"
            className="group inline-flex h-14 w-full items-center justify-center gap-3 px-7 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.55)] transition-colors hover:bg-white hover:text-cs-ink sm:w-auto"
          >
            Request an Assessment
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <p className="intro-rise mt-4 text-sm text-white/60" style={{ "--i": 5 } as CSSProperties}>
          Speak to someone now:{" "}
          <a href={business.phoneHref} className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
            {business.phoneDisplay}
          </a>
        </p>

        <ul className="intro-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75" style={{ "--i": 6 } as CSSProperties}>
          {FACTS.map((fact) => (
            <li key={fact} className="flex items-center gap-2">
              <Check aria-hidden="true" className="size-4 text-cs-sky" strokeWidth={2.5} />
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-14">
          <ul className="grid border-t border-white/15 sm:grid-cols-3">
            {primaryServices.map((service, index) => (
              <li key={service.slug} className={`border-white/15 ${index > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}>
                <Link
                  href={`${BASE}/${service.slug}`}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors sm:px-6 sm:first:pl-0 hover:text-cs-sky"
                >
                  <span>
                    <span className="block font-mono text-[11px] text-white/45">0{index + 1}</span>
                    <span className="mt-1 block text-lg font-semibold">{service.name}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.14em] text-white/35">Illustrative photo</p>
    </section>
  );
}

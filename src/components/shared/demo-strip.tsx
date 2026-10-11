import Image from "next/image";
import Link from "next/link";
import { DEMOS } from "@/components/home/environments";

/** The three interactive concepts as a compact strip of still frames, for inner pages. */
export function DemoStrip({ title = "See what your website could feel like." }: { title?: string }) {
  return (
    <section aria-labelledby="demo-strip-title" data-tone="dark" className="bg-stage text-bone" data-track-location="demo-strip">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-5 pb-6 pt-20 sm:px-8 sm:pt-24 md:flex-row md:items-end md:justify-between">
        <h2 id="demo-strip-title" className="display max-w-[22ch] text-balance text-[1.9rem] uppercase sm:text-[2.6rem]">
          {title}
        </h2>
        <p className="label text-bone/60 md:pb-2">Interactive concepts · fictional businesses</p>
      </div>
      <ul className="grid gap-px md:grid-cols-3">
        {DEMOS.map((demo) => (
          <li key={demo.id} className="relative min-h-[46svh] md:min-h-[58svh]">
            <Link href={demo.href} className="group absolute inset-0 flex flex-col overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone">
              <Image
                src={demo.image}
                alt={demo.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                placeholder="blur"
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                style={{ objectPosition: demo.focus }}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="relative mt-auto p-5 sm:p-7">
                <p className="label text-bone/75">Interactive concept · {demo.kind}</p>
                <p className="display mt-3 text-[1.8rem] uppercase leading-none sm:text-[2.1rem]">{demo.name}</p>
                <p className="mt-3 max-w-[30ch] font-serif text-lg italic text-bone/85">{demo.line}</p>
                <p className="label mt-5 inline-flex items-center gap-3 text-bone">
                  Open the demo <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

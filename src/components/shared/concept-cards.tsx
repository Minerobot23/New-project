import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONCEPT_PROJECTS } from "@/content/work";
import { SHOWCASE } from "@/lib/images";

/** Cards for the interactive concept projects, each with a screenshot of its redesigned homepage. */
export function ConceptCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {CONCEPT_PROJECTS.map((project) => {
        const shots = SHOWCASE[project.industry];
        return (
          <li key={project.name} className="reveal">
            <Link
              href={project.href}
              className="bezel group flex h-full flex-col transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1"
            >
              <div className="grain relative overflow-hidden rounded-b-none bg-night px-6 pt-6 sm:px-8 sm:pt-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_0%,rgba(47,124,255,0.3),transparent_70%)]"
                />
                <div className="relative aspect-[1400/760] overflow-hidden rounded-t-lg shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
                  <Image
                    src={shots.desktop}
                    alt={`Redesigned homepage concept for ${project.name}, a fictional ${project.kind}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    placeholder="blur"
                    className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute bottom-0 right-5 w-[19%] translate-y-[38%] overflow-hidden rounded-[14px] border-[3px] border-[#0a0f16] shadow-[0_16px_30px_-12px_rgba(0,0,0,0.8)] sm:right-7">
                  <div className="relative aspect-[640/1282]">
                    <Image src={shots.mobile} alt="" fill sizes="120px" placeholder="blur" className="object-cover object-top" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col rounded-t-none bg-surface p-6 sm:p-7">
                <span className="w-fit rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">Concept Project</span>
                <Heading className="mt-4 text-xl font-semibold tracking-tight text-ink">{project.name}</Heading>
                <span className="text-sm text-muted">Fictional {project.kind}</span>
                <span className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{project.focus}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Explore the Before &amp; After{" "}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

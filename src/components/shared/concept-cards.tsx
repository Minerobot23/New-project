import Image from "next/image";
import Link from "next/link";
import { CONCEPT_PROJECTS } from "@/content/work";
import { SHOWCASE } from "@/lib/images";

/**
 * The interactive concept projects. The first is set large; the rest follow in a row,
 * each with its redesigned desktop homepage and a phone overlapping the corner.
 */
export function ConceptCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {CONCEPT_PROJECTS.map((project, index) => {
        const shots = SHOWCASE[project.industry];
        const lead = index === 0;
        return (
          <li key={project.name} className={lead ? "md:col-span-2 lg:col-span-3" : ""}>
            <Link href={project.href} className={`group grid gap-6 ${lead ? "lg:grid-cols-12 lg:gap-8" : ""}`}>
              <div className={`relative pb-[7%] pr-[6%] ${lead ? "lg:col-span-8" : ""}`}>
                <div className="relative aspect-[1400/888] overflow-hidden border border-ink bg-white">
                  <Image
                    src={shots.desktop}
                    alt={`Redesigned homepage concept for ${project.name}, a fictional ${project.kind}`}
                    fill
                    sizes={lead ? "(min-width: 1024px) 60vw, 90vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"}
                    placeholder="blur"
                    className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.025]"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[22%] rounded-[16%/8%] bg-ink p-[3px] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
                  <div className="relative aspect-[640/1282] overflow-hidden rounded-[14%/7%] bg-white">
                    <Image src={shots.mobile} alt="" fill sizes="160px" placeholder="blur" className="object-cover object-top" />
                  </div>
                </div>
              </div>

              <div className={lead ? "lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:pb-[7%]" : ""}>
                <p className="text-sm text-muted">Concept Project, fictional {project.kind}</p>
                <Heading className={`display-tight mt-2 text-ink transition-colors group-hover:text-accent ${lead ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  {project.name}
                </Heading>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">{project.focus}</p>
                <span className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-sm font-medium text-ink">
                  Explore the Before &amp; After
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

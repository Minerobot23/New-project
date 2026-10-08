import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRY_IMAGES } from "@/lib/images";
import { industryLinks } from "@/lib/site";

export function IndustriesGrid({ exclude }: { exclude?: string }) {
  const links = industryLinks.filter((link) => link.href !== exclude);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {links.map((link) => {
        const image = INDUSTRY_IMAGES[link.href];
        return (
          <li key={link.href} className="reveal">
            <Link
              href={link.href}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-night p-4 text-white sm:aspect-[4/4.4] sm:p-5"
            >
              {image && (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0b1420] via-[#0b1420]/55 to-transparent"
              />
              <span className="relative flex items-end justify-between gap-2">
                <span className="text-[15px] font-semibold leading-snug sm:text-base">Websites for {link.label}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-ink">
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

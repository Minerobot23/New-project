import Image from "next/image";
import Link from "next/link";
import { INDUSTRY_IMAGES } from "@/lib/images";
import { industryLinks } from "@/lib/site";

/** Typeset index of industries: a ruled two-column list with a small photo per row. */
export function IndustriesGrid({ exclude }: { exclude?: string }) {
  const links = industryLinks.filter((link) => link.href !== exclude);
  return (
    <ul className="grid gap-x-12 border-b border-ink md:grid-cols-2">
      {links.map((link) => {
        const image = INDUSTRY_IMAGES[link.href];
        return (
          <li key={link.href} className="border-t border-ink">
            <Link href={link.href} className="group flex items-center gap-5 py-4 sm:py-5">
              {image && (
                <span className="relative h-14 w-20 shrink-0 overflow-hidden bg-sunken sm:h-16 sm:w-24">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="96px"
                    placeholder="blur"
                    className="object-cover grayscale transition-[filter,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </span>
              )}
              <span className="flex-1">
                <span className="block text-xs text-muted">Websites for</span>
                <span className="display-tight mt-0.5 block text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">
                  {link.label}
                </span>
              </span>
              <span aria-hidden="true" className="text-xl text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

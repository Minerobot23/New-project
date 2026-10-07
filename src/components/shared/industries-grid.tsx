import Link from "next/link";
import { ArrowUpRight, Car, Droplets, Hammer, House, Scissors, Store, ThermometerSnowflake, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { industryLinks } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = {
  "/websites-for-contractors": Hammer,
  "/websites-for-hvac-companies": ThermometerSnowflake,
  "/websites-for-plumbers": Droplets,
  "/websites-for-roofers": House,
  "/websites-for-restaurants": UtensilsCrossed,
  "/websites-for-salons": Scissors,
  "/websites-for-auto-repair-shops": Car,
  "/websites-for-local-businesses": Store,
};

export function IndustriesGrid({ exclude }: { exclude?: string }) {
  const links = industryLinks.filter((link) => link.href !== exclude);
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {links.map((link) => {
        const Icon = ICONS[link.href] ?? Store;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink/30 sm:p-5"
            >
              <span className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </span>
              <span className="text-[15px] font-medium leading-snug text-ink">Websites for {link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

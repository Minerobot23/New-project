"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type NavItem = {
  id: string;
  label: string;
  onSelect: () => void;
  active?: boolean;
};

type Props = {
  /** The client's name or mark, top left. */
  brand: ReactNode;
  /** Discreet label naming the work (e.g. "Fluxline Interactive Concept"). */
  credit?: ReactNode;
  /** Where "Exit" leads (back to the Fluxline site). */
  exitHref?: string;
  exitLabel?: string;
  /** The experience's own sections, shown along the bottom edge on larger screens. */
  items?: NavItem[];
  /** Persistent action at the bottom right (Reserve, Book, Get estimate). */
  action?: ReactNode;
  hidden?: boolean;
};

/**
 * Experience chrome kept to the edges of the frame so the photograph owns the screen:
 * brand and credit along the top, the place's own sections along the bottom.
 */
export function ExperienceNavigation({ brand, credit, exitHref, exitLabel = "Exit", items = [], action, hidden = false }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 text-bone transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
      aria-hidden={hidden}
      inert={hidden}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/65 to-transparent" />

      <header className="pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7">
        <div>{brand}</div>
        <div className="flex items-center gap-5">
          {credit && <div className="hidden text-right sm:block">{credit}</div>}
          {exitHref && (
            <Link
              href={exitHref}
              className="label flex h-11 items-center border-b border-transparent text-bone/95 hover:border-bone hover:text-bone"
            >
              {exitLabel}
            </Link>
          )}
        </div>
      </header>

      {(items.length > 0 || action) && (
        <nav
          aria-label="Experience"
          className="pointer-events-auto absolute inset-x-0 bottom-0 hidden items-end justify-between gap-6 px-8 pb-7 md:flex"
        >
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={item.onSelect}
                  aria-current={item.active ? "true" : undefined}
                  className={`label relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-bone after:transition-transform after:duration-500 ${
                    item.active
                      ? "text-bone after:scale-x-100"
                      : "text-bone/90 after:scale-x-0 hover:text-bone hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          {action}
        </nav>
      )}
    </div>
  );
}

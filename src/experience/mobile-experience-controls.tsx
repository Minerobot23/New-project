"use client";

import { useState } from "react";

type Action = { id: string; label: string; onSelect: () => void };

type Props = {
  /** Up to three primary actions shown as large touch targets. */
  primary: Action[];
  /** Everything else, in a sheet behind "More". */
  more?: Action[];
  /** The one action that should always be one thumb away (Reserve, Book, Estimate). */
  sticky?: Action;
  hidden?: boolean;
};

/**
 * Phone controls: a thumb-height rail instead of a hamburger. The experience stays full-screen;
 * the rail is the only chrome, and "More" opens a sheet over the bottom of the scene.
 */
export function MobileExperienceControls({ primary, more = [], sticky, hidden = false }: Props) {
  const [open, setOpen] = useState(false);
  const run = (action: Action) => {
    setOpen(false);
    action.onSelect();
  };

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-30 text-bone transition-opacity duration-700 md:hidden ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
      aria-hidden={hidden}
      inert={hidden}
    >
      {open && more.length > 0 && (
        <div id="experience-more" className="border-t border-bone/15 bg-stage/95 px-5 pb-2 pt-3 backdrop-blur-md">
          <ul>
            {more.map((action) => (
              <li key={action.id}>
                <button type="button" onClick={() => run(action)} className="font-serif block w-full py-3 text-left text-2xl">
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <nav
        aria-label="Experience"
        className="flex items-stretch gap-px bg-bone/10 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      >
        {primary.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => run(action)}
            className="label flex min-h-14 flex-1 items-center justify-center bg-stage/70 px-2 active:bg-stage"
          >
            {action.label}
          </button>
        ))}
        {more.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls="experience-more"
            onClick={() => setOpen((value) => !value)}
            className="label flex min-h-14 flex-1 items-center justify-center bg-stage/70 px-2"
          >
            {open ? "Close" : "More"}
          </button>
        )}
        {sticky && (
          <button
            type="button"
            onClick={() => run(sticky)}
            className="label flex min-h-14 flex-[1.3] items-center justify-center bg-bone px-3 text-stage"
          >
            {sticky.label}
          </button>
        )}
      </nav>
    </div>
  );
}

"use client";

import { CinematicImage, ContextCTA, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { COCKTAILS } from "../content";
import { useRestaurant } from "../context";
import { BackToRoom, Grade, MenuLine, SceneTitle } from "../parts";

/** The bar: the camera has walked to the counter; the drinks list surfaces beside the glass. */
export function Bar() {
  const { go } = useRestaurant();
  return (
    <>
      <CinematicImage image={ASSETS.wineGlass} grade={<Grade side="right" strength={0.82} />} />
      <BackToRoom />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="ml-auto flex min-h-full max-w-xl flex-col justify-end px-5 pb-28 pt-40 text-bone sm:px-10 md:justify-center md:pb-28">
          <SceneTitle kicker="Open from five" className="arrive-in">
            The Bar
          </SceneTitle>
          <p className="arrive-in mt-5 max-w-sm font-serif text-xl italic text-bone/80 [animation-delay:1000ms]">
            Eight seats, a short list of classics, and wine that changes with the week.
          </p>
          <ul className="stagger mt-8">
            {COCKTAILS.map((drink) => (
              <MenuLine key={drink.name} {...drink} />
            ))}
          </ul>
          <div className="arrive-in mt-10 flex flex-wrap gap-3 [animation-delay:1500ms]">
            <ContextCTA onClick={(event) => go("reserve", originOf(event.currentTarget))}>Reserve at the bar</ContextCTA>
            <ContextCTA tone="outline" onClick={(event) => go("menu", originOf(event.currentTarget))}>
              Full menu
            </ContextCTA>
          </div>
        </div>
      </div>
    </>
  );
}

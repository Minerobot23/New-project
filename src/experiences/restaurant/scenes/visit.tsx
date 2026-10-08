"use client";

import { CinematicImage, ContextCTA } from "@/experience";
import { ASSETS, reframe } from "../assets";
import { RESTAURANT } from "../content";
import { useRestaurant } from "../context";
import { BackToRoom, Grade, SceneTitle } from "../parts";

const WINDOW = reframe(
  ASSETS.mainRoom,
  { x: 0.94, y: 0.3 },
  "exterior/street-window",
  "The front windows and awning, looking out to the street",
);

/** Find us: the camera turns to the front windows; hours, address, and the two actions people come for. */
export function Visit() {
  const { note } = useRestaurant();
  return (
    <>
      <div className="absolute inset-0 origin-[90%_30%] scale-[1.35]">
        <CinematicImage image={WINDOW} grade={<Grade side="left" strength={0.9} />} />
      </div>
      <BackToRoom />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full max-w-xl flex-col justify-end px-5 pb-28 pt-40 text-bone sm:px-10 md:justify-center md:pb-28">
          <SceneTitle kicker="Hours and directions" className="arrive-in">
            Find us
          </SceneTitle>
          <address className="arrive-in mt-6 font-serif text-2xl not-italic leading-snug text-bone/85 [animation-delay:1000ms]">
            {RESTAURANT.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <dl className="stagger mt-8 max-w-sm">
            {RESTAURANT.hours.map(([days, hours]) => (
              <div key={days} className="flex justify-between gap-6 border-b border-bone/15 py-3">
                <dt className="text-[15px] text-bone/70">{days}</dt>
                <dd className="font-serif text-xl">{hours}</dd>
              </div>
            ))}
          </dl>
          <div className="arrive-in mt-10 flex flex-wrap gap-3 [animation-delay:1500ms]">
            <ContextCTA onClick={() => note("On a real site this opens turn-by-turn directions in Maps.")}>
              Get directions
            </ContextCTA>
            <ContextCTA
              tone="outline"
              onClick={() => note(`On a real site this calls the restaurant: ${RESTAURANT.phoneDisplay}.`)}
            >
              Call {RESTAURANT.phoneDisplay}
            </ContextCTA>
          </div>
        </div>
      </div>
    </>
  );
}

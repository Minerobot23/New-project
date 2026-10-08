"use client";

import Image from "next/image";
import { ContextCTA, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { useRestaurant } from "../context";
import { BackToRoom, Grade, SceneTitle } from "../parts";

/** Dish presentation: the plate from above, turning slowly under the camera. */
export function Dish() {
  const { go } = useRestaurant();
  const dish = ASSETS.pastaOverhead;
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="plate-turn absolute -inset-[8%]" style={{ transformOrigin: `${(dish.focus.x * 100).toFixed(0)}% 55%` }}>
          <Image
            src={dish.src}
            alt={dish.alt}
            fill
            sizes="120vw"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: "30% 55%" }}
          />
        </div>
        <Grade side="right" strength={0.85} />
      </div>
      <BackToRoom />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="ml-auto flex min-h-full max-w-lg flex-col justify-end px-5 pb-28 pt-40 text-bone sm:px-10 md:justify-center md:pb-28">
          <SceneTitle kicker="Tonight, from the kitchen" className="arrive-in">
            Tagliatelle
          </SceneTitle>
          <p className="arrive-in mt-5 font-serif text-2xl italic text-bone/85 [animation-delay:1050ms]">
            Littleneck clams, white wine, chili, and parsley.
          </p>
          <p className="arrive-in mt-4 max-w-sm text-[15px] leading-relaxed text-bone/70 [animation-delay:1150ms]">
            Pasta is rolled by hand each afternoon. The clams come in that morning; when they run out, the dish comes off the
            board.
          </p>
          <p className="arrive-in mt-6 font-serif text-2xl tabular-nums [animation-delay:1250ms]">28</p>
          <div className="arrive-in mt-10 flex flex-wrap gap-3 [animation-delay:1400ms]">
            <ContextCTA onClick={(event) => go("reserve", originOf(event.currentTarget))}>Reserve a table</ContextCTA>
            <ContextCTA tone="outline" onClick={(event) => go("menu", originOf(event.currentTarget))}>
              See the menu
            </ContextCTA>
          </div>
        </div>
      </div>
    </>
  );
}

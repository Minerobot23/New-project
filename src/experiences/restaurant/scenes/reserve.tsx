"use client";

import { useMemo, useState } from "react";
import { CinematicImage, ContextCTA } from "@/experience";
import { ASSETS } from "../assets";
import { useRestaurant } from "../context";
import { BackToRoom, Grade, SceneTitle } from "../parts";

const SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const TIMES = ["5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"];

function nextDays(count: number) {
  const format = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: date.toDateString(),
      label: i === 0 ? "Tonight" : i === 1 ? "Tomorrow" : format.format(date),
      long: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    };
  });
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 min-w-11 shrink-0 px-3 font-serif text-xl transition-colors ${
        selected
          ? "bg-bone text-stage"
          : "text-bone/80 shadow-[inset_0_0_0_1px_rgba(239,234,226,0.25)] hover:text-bone hover:shadow-[inset_0_0_0_1px_rgba(239,234,226,0.7)]"
      }`}
    >
      {children}
    </button>
  );
}

/** Reserve: the camera has sat down at the table; the booking is three choices and one button. */
export function Reserve() {
  const { note } = useRestaurant();
  const days = useMemo(() => nextDays(7), []);
  const [size, setSize] = useState(2);
  const [day, setDay] = useState(days[0].id);
  const [time, setTime] = useState("7:30");
  const [confirmed, setConfirmed] = useState(false);
  const chosenDay = days.find((d) => d.id === day) ?? days[0];

  return (
    <>
      <CinematicImage image={ASSETS.tableService} grade={<Grade side="left" strength={0.88} />} />
      <BackToRoom />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full max-w-xl flex-col justify-end px-5 pb-28 pt-40 text-bone sm:px-10 md:justify-center md:pb-28">
          {!confirmed ? (
            <>
              <SceneTitle kicker="Reservations" className="arrive-in">
                A table for you
              </SceneTitle>
              <div className="stagger mt-8 space-y-7">
                <fieldset>
                  <legend className="label text-bone/60">Guests</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SIZES.map((n) => (
                      <Choice key={n} selected={size === n} onClick={() => setSize(n)}>
                        {n}
                      </Choice>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="label text-bone/60">Date</legend>
                  <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none]">
                    {days.map((d) => (
                      <Choice key={d.id} selected={day === d.id} onClick={() => setDay(d.id)}>
                        <span className="text-lg">{d.label}</span>
                      </Choice>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="label text-bone/60">Time</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <Choice key={t} selected={time === t} onClick={() => setTime(t)}>
                        {t}
                      </Choice>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <ContextCTA onClick={() => setConfirmed(true)}>Find a table</ContextCTA>
                </div>
              </div>
            </>
          ) : (
            <div aria-live="polite">
              <p className="label text-bone/80">Reservation preview</p>
              <p
                data-scene-focus
                tabIndex={-1}
                className="mt-4 font-serif text-[2.75rem] leading-[1.02] outline-none sm:text-6xl"
              >
                {size === 1 ? "A table for one" : `A table for ${size}`}, {chosenDay.long}, at {time}.
              </p>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-bone/70">
                In this concept nothing is booked. On a real site this step connects to the restaurant&apos;s own reservation
                system and sends the confirmation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContextCTA tone="outline" onClick={() => setConfirmed(false)}>
                  Change
                </ContextCTA>
                <ContextCTA onClick={() => note("On a real site, this adds the reservation to your calendar.")}>
                  Add to calendar
                </ContextCTA>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

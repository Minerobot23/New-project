"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ContextCTA, CoverStage, coverBox, prefersReducedMotion } from "@/experience";
import { ASSETS } from "../assets";
import { EVENT_TYPES } from "../content";
import { useRestaurant } from "../context";
import { BackToRoom, Grade, SceneTitle } from "../parts";

type Errors = Partial<Record<"name" | "email" | "phone" | "date" | "guests", string>>;

/**
 * Private dining: one room, three ways to use it. Each event type re-frames the camera on the part of
 * the salon that sells it (the windows, the table, the whole room), then "Plan your event" opens the enquiry.
 */
export function PrivateDining() {
  const { setChromeHidden } = useRestaurant();
  const [type, setType] = useState(EVENT_TYPES[1].id);
  const [planning, setPlanning] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const camera = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const current = EVENT_TYPES.find((event) => event.id === type) ?? EVENT_TYPES[0];

  // Re-frame: convert the subject's position in the photo to a point on screen, then push in around it.
  useLayoutEffect(() => {
    const element = camera.current;
    if (!element) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const image = ASSETS.sala;
    const box = coverBox(W, H, image.src.width / image.src.height, image.focus);
    const x = ((box.left + current.focus.x * box.width) / W) * 100;
    const y = ((box.top + current.focus.y * box.height) / H) * 100;
    const tween = gsap.to(element, {
      scale: current.zoom,
      transformOrigin: `${x}% ${y}%`,
      duration: prefersReducedMotion() ? 0 : 1.8,
      ease: "power3.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [current]);

  // The enquiry gets the whole frame: experience chrome steps back while it is open.
  useLayoutEffect(() => {
    setChromeHidden(planning);
    return () => setChromeHidden(false);
  }, [planning, setChromeHidden]);

  useLayoutEffect(() => {
    if (!planning || !panel.current) return;
    const tween = gsap.fromTo(
      panel.current,
      { xPercent: 100 },
      {
        xPercent: 0,
        duration: prefersReducedMotion() ? 0 : 0.9,
        ease: "power3.out",
      },
    );
    panel.current.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
    return () => {
      tween.kill();
    };
  }, [planning]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const next: Errors = {};
    if (!value("name")) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) next.email = "Please enter a valid email address.";
    if (value("phone").replace(/\D/g, "").length < 10) next.phone = "Please enter a phone number we can call.";
    if (!value("date")) next.date = "Please choose a date.";
    const guests = Number(value("guests"));
    if (!guests || guests < 2) next.guests = "Private events start at 2 guests.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(value("name").split(" ")[0]);
  };

  return (
    <>
      <div ref={camera} className="absolute inset-0 will-change-transform">
        <CoverStage image={ASSETS.sala} grade={<Grade side="left" strength={0.8} />} />
      </div>
      <BackToRoom />

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full max-w-xl flex-col justify-end px-5 pb-28 pt-40 text-bone sm:px-10 md:justify-center md:pb-28">
          <SceneTitle kicker="Private dining" className="arrive-in">
            The Salon
          </SceneTitle>
          <div role="radiogroup" aria-label="Event type" className="stagger mt-8 flex flex-col items-start">
            {EVENT_TYPES.map((event) => (
              <button
                key={event.id}
                type="button"
                role="radio"
                aria-checked={type === event.id}
                onClick={() => setType(event.id)}
                className={`group flex min-h-12 items-center gap-4 font-serif text-[1.9rem] leading-tight transition-colors sm:text-4xl ${
                  type === event.id ? "text-bone" : "text-bone/45 hover:text-bone/80"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-px bg-bone transition-all duration-700 ease-[var(--ease-out-soft)] ${type === event.id ? "w-10" : "w-0"}`}
                />
                {event.label}
              </button>
            ))}
          </div>
          <div key={current.id} className="arrive-in mt-6 max-w-sm [animation-delay:0ms]">
            <p className="label text-bone/60">{current.capacity}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-bone/80">{current.line}</p>
          </div>
          <div className="arrive-in mt-9 [animation-delay:1300ms]">
            <ContextCTA onClick={() => setPlanning(true)} aria-expanded={planning} aria-controls="plan-event">
              Plan your event
            </ContextCTA>
          </div>
        </div>
      </div>

      {planning && (
        <div
          ref={panel}
          id="plan-event"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-event-title"
          onKeyDown={(event) => event.key === "Escape" && setPlanning(false)}
          className="absolute inset-y-0 right-0 z-40 w-full overflow-y-auto bg-stage text-bone sm:max-w-md"
        >
          <div className="px-6 pb-16 pt-8 sm:px-10">
            <div className="flex items-center justify-between">
              <p className="label text-bone/60">The Salon</p>
              <button type="button" onClick={() => setPlanning(false)} className="label h-11 text-bone/70 hover:text-bone">
                Close
              </button>
            </div>
            {sent ? (
              <div aria-live="polite" className="mt-16">
                <p className="label mb-4 text-bone/80">Enquiry preview</p>
                <p id="plan-event-title" className="font-serif text-5xl leading-none">
                  Thank you, {sent}.
                </p>
                <p className="mt-6 text-[15px] leading-relaxed text-bone/75">
                  In this concept nothing is sent. On a real site, your enquiry goes straight to the events team with the date,
                  guest count, and event type already filled in, and you get a confirmation by email.
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="mt-10 space-y-6">
                <h3 id="plan-event-title" className="font-serif text-5xl leading-none">
                  Plan your event
                </h3>
                <Field name="name" label="Name" autoComplete="name" error={errors.name} />
                <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
                <Field name="phone" label="Phone" type="tel" autoComplete="tel" error={errors.phone} />
                <div className="grid grid-cols-2 gap-4">
                  <Field name="date" label="Event date" type="date" error={errors.date} />
                  <Field name="guests" label="Guests" type="number" min={2} max={60} inputMode="numeric" error={errors.guests} />
                </div>
                <div>
                  <label htmlFor="event-type" className="label text-bone/60">
                    Event type
                  </label>
                  <select
                    id="event-type"
                    name="type"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="mt-2 h-12 w-full border-b border-bone/30 bg-transparent font-serif text-xl text-bone outline-none focus:border-bone"
                  >
                    {EVENT_TYPES.map((event) => (
                      <option key={event.id} value={event.id} className="bg-stage">
                        {event.label}
                      </option>
                    ))}
                  </select>
                </div>
                <ContextCTA type="submit" className="w-full">
                  Send enquiry
                </ContextCTA>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  name,
  label,
  error,
  ...props
}: {
  name: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `event-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label text-bone/60">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 h-12 w-full border-b border-bone/30 bg-transparent font-serif text-xl text-bone outline-none [color-scheme:dark] placeholder:text-bone/30 focus:border-bone aria-[invalid=true]:border-[#e8a08f]"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#f0b4a6]">
          {error}
        </p>
      )}
    </div>
  );
}

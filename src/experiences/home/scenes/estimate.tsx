"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CinematicImage, ContextCTA, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { AREAS, COMPANY, type AreaId } from "../content";
import { useHome } from "../context";

type Errors = Partial<Record<"name" | "phone" | "email" | "town" | "areas", string>>;

/** The estimate: everything the visitor explored arrives already filled in. */
export function Estimate() {
  const { back, visited, selections } = useHome();
  const [areas, setAreas] = useState<AreaId[]>(visited.length ? visited : []);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const toggle = (id: AreaId) =>
    setAreas((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const next: Errors = {};
    if (!value("name")) next.name = "Please enter your name.";
    if (value("phone").replace(/\D/g, "").length < 10) next.phone = "Please enter a phone number we can call.";
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) next.email = "Please enter a valid email address.";
    if (!value("town")) next.town = "Which town is the house in?";
    if (areas.length === 0) next.areas = "Choose at least one part of the house.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(value("name").split(" ")[0]);
  };

  return (
    <>
      <CinematicImage image={{ ...ASSETS.house, focus: { x: 0.62, y: 0.55 } }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#060b17]/80 md:bg-[linear-gradient(to_right,rgba(6,11,23,0.95)_0%,rgba(6,11,23,0.85)_45%,rgba(6,11,23,0.35)_100%)]"
      />
      <button
        type="button"
        onClick={(event) => back(originOf(event.currentTarget))}
        className="label group absolute left-5 top-20 z-20 flex h-11 items-center gap-3 text-bone/85 hover:text-bone sm:left-8 sm:top-24"
      >
        <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1">
          ←
        </span>
        Back
      </button>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="max-w-xl px-5 pb-28 pt-36 text-bone sm:px-8 md:pt-40">
          {sent ? (
            <div aria-live="polite">
              <p className="label text-[#f2b45c]">Request received</p>
              <p
                data-scene-focus
                tabIndex={-1}
                className="mt-4 font-display text-[2.6rem] font-light uppercase leading-[0.95] outline-none sm:text-6xl"
              >
                Thank you, {sent}.
              </p>
              <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-bone/75">
                In this concept nothing is sent. On a real site your request reaches {COMPANY.name}&apos;s estimator with the
                areas and materials you chose, and they call to book a visit.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <p className="label text-[#f2b45c]">{COMPANY.name}</p>
              <h2
                data-scene-focus
                tabIndex={-1}
                className="mt-3 font-display text-[2.6rem] font-light uppercase leading-[0.95] outline-none sm:text-6xl"
              >
                Get my estimate
              </h2>
              <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-bone/75">
                Tell us about the house. We&apos;ll call to set up a visit and give you a written estimate.
              </p>

              <fieldset className="mt-8">
                <legend className="label text-bone/60">What are we transforming?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {AREAS.map((area) => {
                    const on = areas.includes(area.id);
                    return (
                      <button
                        key={area.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(area.id)}
                        className={`min-h-11 px-4 text-sm transition-colors ${
                          on
                            ? "bg-bone text-[#0b1220]"
                            : "text-bone/80 shadow-[inset_0_0_0_1px_rgba(239,234,226,0.3)] hover:text-bone"
                        }`}
                      >
                        {area.title}
                        {on && selections[area.id] ? (
                          <span className="ml-2 text-[#0b1220]/60">· {selections[area.id]}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                {errors.areas && <p className="mt-2 text-sm text-[#f0b4a6]">{errors.areas}</p>}
              </fieldset>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Name" autoComplete="name" error={errors.name} />
                <Field name="phone" label="Phone" type="tel" autoComplete="tel" error={errors.phone} />
                <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
                <Field name="town" label="Town" autoComplete="address-level2" error={errors.town} />
              </div>
              <div className="mt-6">
                <label htmlFor="home-timeline" className="label text-bone/60">
                  When would you like to start?
                </label>
                <select
                  id="home-timeline"
                  name="timeline"
                  defaultValue="season"
                  className="mt-2 h-12 w-full border-b border-bone/30 bg-transparent text-lg text-bone outline-none focus:border-bone"
                >
                  <option value="asap" className="bg-[#0b1220]">
                    As soon as possible
                  </option>
                  <option value="season" className="bg-[#0b1220]">
                    In the next few months
                  </option>
                  <option value="planning" className="bg-[#0b1220]">
                    Just planning for now
                  </option>
                </select>
              </div>
              <ContextCTA type="submit" className="mt-9 w-full sm:w-auto">
                Request my estimate
              </ContextCTA>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  error,
  ...props
}: { name: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = `home-${name}`;
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
        className="mt-2 h-12 w-full border-b border-bone/30 bg-transparent text-lg text-bone outline-none [color-scheme:dark] focus:border-bone aria-[invalid=true]:border-[#e8a08f]"
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

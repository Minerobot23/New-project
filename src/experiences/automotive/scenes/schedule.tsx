"use client";

import { useMemo, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { CinematicImage, ContextCTA, originOf } from "@/experience";
import { ASSETS } from "../assets";
import { SERVICES, SHOP, type ServiceId } from "../content";
import { useAuto } from "../context";

const MAKES = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lexus",
  "Mercedes-Benz",
  "Nissan",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Other",
];
const YEARS = Array.from({ length: 27 }, (_, i) => String(2026 - i));
const TIMES = ["7:30", "8:00", "9:00", "10:00", "12:00", "2:00"];

type Errors = Partial<Record<"make" | "name" | "phone" | "services", string>>;

/** Book the car in: vehicle, services, a drop-off slot, and a number to text when it's ready. */
export function Schedule() {
  const { back, note, visited } = useAuto();
  const days = useMemo(() => {
    const list: { id: string; label: string; long: string }[] = [];
    const date = new Date();
    while (list.length < 6) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() === 0) continue;
      list.push({
        id: date.toDateString(),
        label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        long: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      });
    }
    return list;
  }, []);
  const [services, setServices] = useState<ServiceId[]>(visited);
  const [day, setDay] = useState(days[0].id);
  const [time, setTime] = useState("8:00");
  const [errors, setErrors] = useState<Errors>({});
  const [booked, setBooked] = useState<string | null>(null);

  const toggle = (id: ServiceId) =>
    setServices((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const next: Errors = {};
    if (!value("make")) next.make = "Choose the make.";
    if (!value("name")) next.name = "Please enter your name.";
    if (value("phone").replace(/\D/g, "").length < 10) next.phone = "Please enter a phone number we can text.";
    if (services.length === 0) next.services = "Choose at least one service.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      const car = [value("year"), value("make"), value("model")].filter(Boolean).join(" ");
      setBooked(`${car}, ${days.find((d) => d.id === day)?.long} at ${time}`);
    }
  };

  return (
    <>
      <CinematicImage image={ASSETS.serviceBay} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#040507]/80 md:bg-[linear-gradient(to_right,rgba(4,5,7,0.96)_0%,rgba(4,5,7,0.85)_48%,rgba(4,5,7,0.3)_100%)]"
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
          {booked ? (
            <div aria-live="polite">
              <p className="label text-[#ff4b3a]">Booking preview</p>
              <p data-scene-focus tabIndex={-1} className="condensed mt-4 text-[3.2rem] outline-none sm:text-[4.5rem]">
                {booked}.
              </p>
              <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-bone/75">
                In this concept nothing is booked. On a real site the shop confirms by text and sends photos of anything it finds
                before doing the work.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContextCTA tone="outline" onClick={() => note("On a real site this opens directions to the shop in Maps.")}>
                  Get directions
                </ContextCTA>
                <ContextCTA tone="outline" onClick={() => note(`On a real site this calls ${SHOP.name}: ${SHOP.phoneDisplay}.`)}>
                  Call the shop
                </ContextCTA>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <p className="label text-[#ff4b3a]">{SHOP.name}</p>
              <h2 data-scene-focus tabIndex={-1} className="condensed mt-3 text-[3.6rem] outline-none sm:text-[5rem]">
                Schedule service
              </h2>

              <fieldset className="mt-7">
                <legend className="label text-bone/60">Vehicle</legend>
                <div className="mt-3 grid grid-cols-[6rem_1fr] gap-4 sm:grid-cols-[6rem_1fr_1fr]">
                  <Select name="year" label="Year">
                    {YEARS.map((year) => (
                      <option key={year} className="bg-[#0b0c0e]">
                        {year}
                      </option>
                    ))}
                  </Select>
                  <Select name="make" label="Make" error={errors.make}>
                    <option value="" className="bg-[#0b0c0e]">
                      Choose
                    </option>
                    {MAKES.map((make) => (
                      <option key={make} className="bg-[#0b0c0e]">
                        {make}
                      </option>
                    ))}
                  </Select>
                  <div className="col-span-2 sm:col-span-1">
                    <Field name="model" label="Model" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="mt-7">
                <legend className="label text-bone/60">Services</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SERVICES.map((service) => (
                    <Chip key={service.id} on={services.includes(service.id)} onClick={() => toggle(service.id)}>
                      {service.title}
                    </Chip>
                  ))}
                </div>
                {errors.services && <p className="mt-2 text-sm text-[#f0b4a6]">{errors.services}</p>}
              </fieldset>

              <fieldset className="mt-7">
                <legend className="label text-bone/60">Drop-off</legend>
                <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none]">
                  {days.map((d) => (
                    <Chip key={d.id} on={day === d.id} onClick={() => setDay(d.id)}>
                      {d.label}
                    </Chip>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TIMES.map((t) => (
                    <Chip key={t} on={time === t} onClick={() => setTime(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Field name="name" label="Name" autoComplete="name" error={errors.name} />
                <Field name="phone" label="Mobile (for updates)" type="tel" autoComplete="tel" error={errors.phone} />
              </div>
              <ContextCTA type="submit" className="mt-9 w-full sm:w-auto">
                Book my drop-off
              </ContextCTA>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 shrink-0 px-4 text-sm transition-colors ${
        on ? "bg-[#ff4b3a] text-[#0b0c0e]" : "text-bone/80 shadow-[inset_0_0_0_1px_rgba(239,234,226,0.28)] hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

const inputClass =
  "mt-2 h-12 w-full border-b border-bone/30 bg-transparent text-lg text-bone outline-none [color-scheme:dark] focus:border-bone aria-[invalid=true]:border-[#e8a08f]";

function Field({
  name,
  label,
  error,
  ...props
}: { name: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = `auto-${name}`;
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
        className={inputClass}
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

function Select({ name, label, error, children }: { name: string; label: string; error?: string; children: ReactNode }) {
  const id = `auto-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label text-bone/60">
        {label}
      </label>
      <select
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#f0b4a6]">
          {error}
        </p>
      )}
    </div>
  );
}

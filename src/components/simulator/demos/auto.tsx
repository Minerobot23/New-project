"use client";

import { useState } from "react";
import { Award, Car, Clock, Disc3, Gauge, MapPin, Navigation, Phone, ShieldCheck, Thermometer, Wrench } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive, Stars } from "./shared";
import { DatedPhoto, GarageScene } from "./scenes";

const PHONE = "(631) 555-0177";

export default function AutoDemo(props: DemoProps) {
  return props.variant === "before" ? <Before {...props} /> : <After {...props} />;
}

const OLD_SERVICES = [
  "Oil Changes", "Brakes", "Rotors", "Tires", "Alignments", "Batteries", "Starters", "Alternators", "Check Engine Light",
  "Diagnostics", "Tune Ups", "Timing Belts", "Water Pumps", "Radiators", "A/C Service", "Exhaust", "Mufflers", "Shocks",
  "Struts", "Suspension", "Transmission Service", "NYS Inspections", "Fleet Service",
];

function Before({ mobile, onAction }: DemoProps) {
  return (
    <NonResponsive mobile={mobile}>
      <div className="min-h-full bg-[#e8e8e8] pb-6 text-[13px] text-[#222]" style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}>
        <div className="mx-auto w-[980px] bg-white">
          <div className="flex items-center justify-between bg-[#b3121b] px-6 py-4 text-white">
            <p className="text-[30px] font-black uppercase italic tracking-tight" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>
              Ridgeway Auto
            </p>
            <DemoButton action={`start a phone call to ${PHONE}, the only way to get in touch`} onAction={onAction} className="text-[18px] font-bold text-[#ffe14d]">
              CALL 631-555-0177
            </DemoButton>
          </div>
          <div className="grid grid-cols-[300px_1fr] gap-6 px-6 py-6">
            <DatedPhoto>
              <GarageScene className="block h-auto w-full" />
            </DatedPhoto>
            <div>
              <p className="text-[20px] font-bold text-[#b3121b]">Complete Auto Repair For All Makes &amp; Models!!</p>
              <p className="mt-2 leading-[1.5]">
                Ridgeway Auto has the experience to handle all your automotive needs. We use quality parts and our prices are fair.
                Foreign and domestic. Call us today to schedule your appointment!
              </p>
              <p className="mt-4 font-bold">Services We Offer:</p>
              <ul className="mt-1 columns-3 text-[12px] leading-[1.6]">
                {OLD_SERVICES.map((service) => (
                  <li key={service}>» {service}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-[#333] px-6 py-3 text-center text-[11px] text-[#d4d4d4]">
            Ridgeway Auto · We Accept Cash, Visa, MasterCard · Call For Directions
          </div>
        </div>
      </div>
    </NonResponsive>
  );
}

const SERVICES = [
  { icon: Gauge, title: "Diagnostics", body: "Check-engine light? We find the cause and explain it before any repair." },
  { icon: Disc3, title: "Brakes & Tires", body: "Pads, rotors, alignments, and tire installs done right." },
  { icon: Wrench, title: "Maintenance", body: "Oil changes and factory-schedule service that protects your warranty." },
  { icon: Thermometer, title: "A/C & Heating", body: "Recharge, leak detection, and repairs for year-round comfort." },
];

const SERVICE_TYPES = ["Oil change", "Brakes", "Check engine light", "Inspection", "Something else"];

function After({ mobile: m, onAction }: DemoProps) {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const pad = m ? "px-5" : "px-12";
  const schedule = "open a service request with the vehicle and service already filled in";
  const call = `start a phone call to ${PHONE}`;
  const directions = "open turn-by-turn directions in the visitor's maps app";

  return (
    <div className="relative min-h-full bg-white text-[#111821]" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <header className={`sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111821]/95 py-3.5 text-white backdrop-blur ${pad}`}>
        <p className="flex items-center gap-2 text-[16px] font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-md bg-[#f2b705] text-[#111821]">
            <Car aria-hidden="true" className="size-4.5" />
          </span>
          Ridgeway Auto Care
        </p>
        <div className="flex items-center gap-5 text-[14px] font-medium">
          {!m &&
            ["Services", "Reviews", "Hours & Location"].map((item) => (
              <DemoButton key={item} action={`scroll to ${item}`} onAction={onAction} className="text-white/80">
                {item}
              </DemoButton>
            ))}
          <DemoButton action={schedule} onAction={onAction} className="rounded-md bg-[#f2b705] px-3.5 py-2 text-[13px] font-semibold text-[#111821]">
            Schedule{m ? "" : " Service"}
          </DemoButton>
        </div>
      </header>

      <section className={`relative bg-[#111821] text-white ${pad} ${m ? "pb-8 pt-6" : "py-14"}`}>
        <div className={`grid items-center gap-8 ${m ? "" : "grid-cols-[1.1fr_1fr]"}`}>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f2b705]">Independent auto repair</p>
            <p className={`mt-3 font-bold leading-[1.07] tracking-tight ${m ? "text-[30px]" : "text-[46px]"}`}>
              Honest repairs. Clear quotes. Your car back on schedule.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              We explain what your car needs, what can wait, and what it costs before we pick up a wrench.
            </p>
            <div className={`mt-6 grid gap-2.5 ${m ? "" : "grid-cols-3"}`}>
              <DemoButton action={schedule} onAction={onAction} className="rounded-lg bg-[#f2b705] py-3.5 text-[15px] font-semibold text-[#111821]">
                Schedule Service
              </DemoButton>
              <DemoButton action={call} onAction={onAction} className="flex items-center justify-center gap-2 rounded-lg border border-white/20 py-3.5 text-[15px] font-semibold">
                <Phone aria-hidden="true" className="size-4" /> Call Now
              </DemoButton>
              <DemoButton action={directions} onAction={onAction} className="flex items-center justify-center gap-2 rounded-lg border border-white/20 py-3.5 text-[15px] font-semibold">
                <Navigation aria-hidden="true" className="size-4" /> Directions
              </DemoButton>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <GarageScene className="block h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={`${pad} -mt-px border-b border-[#e7ebf0] bg-[#f7f8fa] py-4`}>
        <ul className={`grid gap-3 text-[13px] font-medium ${m ? "grid-cols-1" : "grid-cols-3"}`}>
          <li className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 text-[#b78a00]" /> Mon–Fri 7:30–6 · Sat 8–2
          </li>
          <li className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 text-[#b78a00]" /> 2210 Ridgeway Ave · loaner cars available
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 text-[#b78a00]" /> 12-month / 12,000-mile parts &amp; labor warranty
          </li>
        </ul>
      </section>

      <section className={`grid gap-8 ${pad} py-12 ${m ? "" : "grid-cols-[1.3fr_1fr]"}`}>
        <div>
          <p className={`font-bold tracking-tight ${m ? "text-[24px]" : "text-[30px]"}`}>Services</p>
          <div className={`mt-5 grid gap-3 ${m ? "" : "grid-cols-2"}`}>
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-[#e7ebf0] p-5">
                <Icon aria-hidden="true" className="size-5 text-[#b78a00]" />
                <p className="mt-3 text-[15px] font-semibold">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5a6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#e7ebf0] bg-[#f7f8fa] p-6">
          <p className="text-[18px] font-semibold">Request service</p>
          <p className="mt-1 text-[13px] text-[#5a6573]">Tell us about your vehicle. We&apos;ll confirm a time by text.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Year", "Make", "Model"].map((field) => (
              <div key={field} className="rounded-md border border-[#d7dde4] bg-white px-3 py-2.5 text-[13px] text-[#687380]">
                {field}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#5a6573]">What do you need?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={serviceType === type}
                onClick={() => setServiceType(type)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  serviceType === type ? "border-[#111821] bg-[#111821] text-white" : "border-[#d7dde4] bg-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <DemoButton action={`send a service request for: ${serviceType.toLowerCase()}`} onAction={onAction} className="mt-5 w-full rounded-lg bg-[#f2b705] py-3 text-[14px] font-semibold text-[#111821]">
            Request {serviceType}
          </DemoButton>
        </div>
      </section>

      <section className={`grid gap-4 ${pad} pb-12 ${m ? "" : "grid-cols-3"}`}>
        {[
          ["They called with photos of the worn parts and a quote before doing anything. Refreshing.", "Chris L."],
          ["Booked online at night, dropped the car at 8, picked it up at 4. Easy.", "Natalie R."],
        ].map(([quote, name]) => (
          <figure key={name} className="rounded-xl border border-[#e7ebf0] p-5 text-[13px] leading-relaxed">
            <Stars />
            <blockquote className="mt-2">&ldquo;{quote}&rdquo;</blockquote>
            <figcaption className="mt-2 text-[12px] font-semibold">{name}</figcaption>
          </figure>
        ))}
        <div className="flex flex-col justify-center gap-3 rounded-xl bg-[#111821] p-5 text-white">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <Award aria-hidden="true" className="size-5 text-[#f2b705]" /> Certified technicians
          </p>
          <p className="text-[11px] text-white/60">Certification badges would appear here (demo placeholder).</p>
        </div>
      </section>

      <footer className={`bg-[#111821] ${pad} py-6 text-[12px] text-white/60 ${m ? "pb-24" : ""}`}>Ridgeway Auto Care · Fictional business for demonstration</footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-3 gap-2 border-t border-[#e7ebf0] bg-white/95 p-3 backdrop-blur">
          <DemoButton action={call} onAction={onAction} className="rounded-lg border border-[#d7dde4] py-3 text-[13px] font-semibold">
            Call
          </DemoButton>
          <DemoButton action={directions} onAction={onAction} className="rounded-lg border border-[#d7dde4] py-3 text-[13px] font-semibold">
            Directions
          </DemoButton>
          <DemoButton action={schedule} onAction={onAction} className="rounded-lg bg-[#f2b705] py-3 text-[13px] font-semibold text-[#111821]">
            Schedule
          </DemoButton>
        </div>
      )}
    </div>
  );
}

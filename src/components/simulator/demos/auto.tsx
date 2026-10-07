"use client";

import { useState } from "react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive } from "./shared";
import { DemoPhoto } from "./photo";
import { autoDisplay, autoMono } from "./fonts";
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
  ["Check engine light diagnostics", "from $95"],
  ["Brake pads & rotors", "from $189 / axle"],
  ["Oil change, synthetic", "from $69"],
  ["NYS inspection", "$21 / $37"],
  ["A/C recharge & leak test", "from $149"],
  ["Suspension & alignment", "quoted"],
  ["Timing belts & water pumps", "quoted"],
  ["Batteries & starting", "from $159"],
] as const;

const SERVICE_TYPES = ["Oil change", "Brakes", "Check engine", "Inspection", "Other"];

const YELLOW = "#ffc21a";
const BLACK = "#121212";
const STRIPES = `repeating-linear-gradient(-45deg, ${YELLOW} 0 14px, ${BLACK} 14px 28px)`;

function After({ mobile: m, onAction }: DemoProps) {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const pad = m ? "px-5" : "px-14";
  const schedule = "open a service request with the vehicle and service already filled in";
  const call = `start a phone call to ${PHONE}`;
  const directions = "open turn-by-turn directions in the visitor's maps app";
  const display = autoDisplay.className;
  const mono = autoMono.className;
  const condensed = { fontStretch: "75%" } as const;

  return (
    <div className={`relative min-h-full bg-[#f2f2ef] text-[#121212] ${display}`}>
      <div aria-hidden="true" className="h-2" style={{ background: STRIPES }} />
      <header className={`sticky top-0 z-10 flex items-center justify-between text-white ${pad} ${m ? "py-3" : "py-4"}`} style={{ background: BLACK }}>
        <div className="leading-none">
          <p className="text-[26px] font-black uppercase" style={condensed}>
            Ridgeway
          </p>
          <p className={`${mono} mt-1 text-[10px] uppercase tracking-[0.3em] text-white/70`}>Auto care · est. 1991</p>
        </div>
        <div className="flex items-center gap-6">
          {!m && (
            <>
              {["Services", "How we work", "Visit"].map((item) => (
                <DemoButton key={item} action={`scroll to ${item.toLowerCase()}`} onAction={onAction} className="text-[14px] font-semibold text-white/80 hover:text-white">
                  {item}
                </DemoButton>
              ))}
              <DemoButton action={call} onAction={onAction} className={`${mono} text-[14px]`}>
                {PHONE}
              </DemoButton>
            </>
          )}
          <DemoButton action={schedule} onAction={onAction} className="px-4 py-2.5 text-[14px] font-bold uppercase text-black" style={{ background: YELLOW }}>
            {m ? "Book" : "Schedule service"}
          </DemoButton>
        </div>
      </header>

      <section className="relative">
        <DemoPhoto
          photo="auto-hero"
          alt="Mechanic working under a car on a lift"
          sizes="1200px"
          className={m ? "h-[320px]" : "h-[480px]"}
          fallback={<GarageScene cover className="block h-full w-full" />}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10" />
        <div className={`absolute inset-0 flex flex-col justify-end text-white ${pad} ${m ? "pb-6" : "pb-14"}`}>
          <h1 className={`max-w-[640px] font-black uppercase leading-[0.92] ${m ? "text-[44px]" : "text-[82px]"}`} style={condensed}>
            Honest repairs. No surprises on the bill.
          </h1>
          <p className={`mt-3 max-w-[480px] text-white/80 ${m ? "text-[15px]" : "text-[18px]"}`}>
            We text you photos and a price before any work starts. Domestic, Asian &amp; European.
          </p>
          {!m && (
            <div className="mt-7 flex gap-3">
              <DemoButton action={schedule} onAction={onAction} className="px-6 py-4 text-[16px] font-bold uppercase text-black" style={{ background: YELLOW }}>
                Schedule service
              </DemoButton>
              <DemoButton action={call} onAction={onAction} className="border-2 border-white px-6 py-[14px] text-[16px] font-bold uppercase">
                Call now
              </DemoButton>
              <DemoButton action={directions} onAction={onAction} className="border-2 border-white/50 px-6 py-[14px] text-[16px] font-bold uppercase text-white/90">
                Directions
              </DemoButton>
            </div>
          )}
        </div>
      </section>

      <section className={`${mono} grid text-[12px] uppercase tracking-wide text-white ${m ? "grid-cols-1 gap-1.5 px-5 py-4" : "grid-cols-3 px-14 py-4"}`} style={{ background: BLACK }}>
        <p>
          <span style={{ color: YELLOW }}>● Open now</span> · Mon–Fri 7:30–6 · Sat 8–2
        </p>
        <p>2210 Ridgeway Ave · loaner cars</p>
        <p>12 mo / 12,000 mi parts &amp; labor warranty</p>
      </section>

      <section className={`${pad} ${m ? "py-10" : "py-16"}`}>
        <h2 className={`font-black uppercase leading-none ${m ? "text-[34px]" : "text-[48px]"}`} style={condensed}>
          How we work
        </h2>
        <ol className={`mt-8 grid gap-6 ${m ? "" : "grid-cols-3"}`}>
          {[
            ["Diagnose", "A technician finds the actual cause. No guessing, no parts-cannon."],
            ["Approve", "You get a text with photos of the problem and an itemized price. Nothing starts until you say yes."],
            ["Repair", "Done right, with the old parts saved for you to see. Backed by our 12-month warranty."],
          ].map(([title, body], index) => (
            <li key={title} className="border-t-4 pt-4" style={{ borderColor: BLACK }}>
              <p className={`${mono} text-[13px] text-[#6a6a6a]`}>0{index + 1}</p>
              <p className="mt-1 text-[22px] font-extrabold uppercase" style={condensed}>
                {title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#3d3d3d]">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`grid gap-10 bg-white ${pad} ${m ? "py-10" : "grid-cols-[1.2fr_1fr] py-16"}`}>
        <div>
          <h2 className={`font-black uppercase leading-none ${m ? "text-[34px]" : "text-[48px]"}`} style={condensed}>
            Services &amp; prices
          </h2>
          <ul className="mt-6">
            {SERVICES.map(([name, price]) => (
              <li key={name} className="flex items-baseline justify-between gap-4 border-b border-[#dcdcd6] py-3">
                <span className="text-[16px] font-semibold">{name}</span>
                <span className={`${mono} shrink-0 text-[13px] text-[#555]`}>{price}</span>
              </li>
            ))}
          </ul>
          <p className={`${mono} mt-3 text-[11px] uppercase text-[#6a6a6a]`}>Prices are starting points · exact quote before work</p>
        </div>
        <div className="flex flex-col gap-4">
          <DemoPhoto photo="auto-brakes" alt="Technician replacing a brake rotor" sizes="460px" className={m ? "h-[200px]" : "h-[230px]"} fallback={<GarageScene cover className="block h-full w-full" />} />
          <div className="border-2 border-black bg-[#fffdf5] p-5">
            <div className="flex items-baseline justify-between border-b-2 border-dashed border-black pb-2">
              <p className="text-[20px] font-extrabold uppercase" style={condensed}>
                Service request
              </p>
              <p className={`${mono} text-[11px] text-[#6a6a6a]`}>WO # NEW</p>
            </div>
            <div className={`${mono} mt-4 grid grid-cols-3 gap-2 text-[12px] uppercase text-[#6a6a6a]`}>
              {["Year", "Make", "Model"].map((field) => (
                <div key={field} className="border-b border-black/40 pb-1">
                  {field}
                </div>
              ))}
            </div>
            <p className={`${mono} mt-4 text-[11px] uppercase text-[#6a6a6a]`}>Service needed</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={serviceType === type}
                  onClick={() => setServiceType(type)}
                  className="border-2 border-black px-2.5 py-1 text-[12px] font-bold uppercase"
                  style={{ background: serviceType === type ? YELLOW : "transparent" }}
                >
                  {type}
                </button>
              ))}
            </div>
            <DemoButton action={`send a service request for: ${serviceType.toLowerCase()}`} onAction={onAction} className="mt-5 w-full py-3 text-[14px] font-bold uppercase text-white" style={{ background: BLACK }}>
              Request {serviceType}
            </DemoButton>
            <p className={`${mono} mt-2 text-[11px] text-[#6a6a6a]`}>We confirm a drop-off time by text.</p>
          </div>
        </div>
      </section>

      <section className={`${pad} ${m ? "py-10" : "py-14"}`}>
        <div className={`grid gap-8 ${m ? "" : "grid-cols-[1fr_1fr_0.9fr]"}`}>
          {[
            ["They texted photos of the worn pads and a price before touching anything. That's why I keep coming back.", "Chris L., Ford F-150"],
            ["Booked online at 10pm, dropped the car at 8, picked it up at 4. Fair price, clear invoice.", "Natalie R., Honda CR-V"],
          ].map(([quote, name]) => (
            <figure key={name}>
              <p className="text-[15px] tracking-[2px]" style={{ color: "#b38600" }}>
                ★★★★★
              </p>
              <blockquote className="mt-2 text-[16px] leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className={`${mono} mt-3 text-[12px] uppercase text-[#6a6a6a]`}>{name}</figcaption>
            </figure>
          ))}
          <div className="p-5 text-white" style={{ background: BLACK }}>
            <p className="text-[20px] font-extrabold uppercase" style={condensed}>
              Makes we work on
            </p>
            <p className={`${mono} mt-3 text-[12px] uppercase leading-relaxed text-white/75`}>
              Ford · Chevy · GM · Toyota · Honda · Nissan · Subaru · Hyundai · Kia · VW · BMW · Audi · Mercedes
            </p>
            <p className="mt-3 text-[11px] text-white/50">Technician certification badges would appear here (demo placeholder).</p>
          </div>
        </div>
      </section>

      <footer className={`text-[12px] text-white/60 ${pad} py-6 ${m ? "pb-24" : ""}`} style={{ background: BLACK }}>
        <div aria-hidden="true" className="-mx-14 -mt-6 mb-6 h-1.5" style={{ background: STRIPES }} />
        Ridgeway Auto Care · 2210 Ridgeway Ave · Fictional business for demonstration
      </footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-3 text-[13px] font-bold uppercase" style={{ background: BLACK }}>
          <DemoButton action={call} onAction={onAction} className="py-4 text-white">
            Call
          </DemoButton>
          <DemoButton action={directions} onAction={onAction} className="border-x border-white/15 py-4 text-white">
            Directions
          </DemoButton>
          <DemoButton action={schedule} onAction={onAction} className="py-4 text-black" style={{ background: YELLOW }}>
            Book
          </DemoButton>
        </div>
      )}
    </div>
  );
}

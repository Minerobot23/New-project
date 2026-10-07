"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, CalendarClock, CreditCard, Flame, MapPin, Menu, Phone, ShieldCheck, Snowflake, Wind, Wrench, X } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive, Stars } from "./shared";
import { DatedPhoto, HvacScene } from "./scenes";

const PHONE = "(516) 555-0142";

export default function HomeServiceDemo(props: DemoProps) {
  return props.variant === "before" ? <Before {...props} /> : <After {...props} />;
}

function Before({ mobile, onAction }: DemoProps) {
  return (
    <NonResponsive mobile={mobile}>
      <div className="min-h-full bg-[#f4f4f4] pb-8 text-[13px] text-[#333]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div className="mx-auto w-[980px] bg-white">
          <div className="flex items-end justify-between px-6 pb-2 pt-5">
            <div>
              <p className="text-[26px] font-bold text-[#1a4f9c]" style={{ fontFamily: "'Times New Roman', serif" }}>
                North Shore Heating &amp; Cooling Inc.
              </p>
              <p className="text-[12px] italic text-[#5f5f5f]">Quality Service You Can Trust</p>
            </div>
            <p className="text-[11px] text-[#5f5f5f]">Call: 516-555-0142</p>
          </div>
          <nav className="flex gap-1 border-y border-[#999] bg-[#dcdcdc] px-4 py-1.5 text-[12px]">
            {["Home", "About Us", "Services", "Coupons", "Contact Us"].map((item) => (
              <DemoButton key={item} action="open another page of the old site" onAction={onAction} className="px-2 text-[#1a4f9c] underline">
                {item}
              </DemoButton>
            ))}
          </nav>
          <div className="grid grid-cols-[1fr_260px] gap-6 px-6 py-6">
            <div>
              <p className="text-[20px] font-bold text-[#222]">Welcome to North Shore Heating &amp; Cooling!</p>
              <p className="mt-3 leading-[1.5]">
                North Shore Heating &amp; Cooling Inc. is a family owned and operated company that has been providing heating and air
                conditioning services to residential and commercial customers. We pride ourselves on our commitment to quality
                workmanship and customer satisfaction. Our technicians are trained to service all makes and models of equipment and we
                always strive to exceed our customers expectations on every job no matter how big or small.
              </p>
              <p className="mt-3 leading-[1.5]">
                We offer a full range of services including air conditioning repair, air conditioning installation, furnace repair,
                furnace installation, boiler service, heat pumps, ductless mini splits, duct cleaning, thermostats, indoor air quality,
                humidifiers, preventative maintenance and much more. Please see our services page for more information about the
                services we provide.
              </p>
              <p className="mt-3 leading-[1.5]">
                We service many towns on the North Shore. Financing may be available, ask for details. Please contact us today for more
                information or to schedule an appointment.{" "}
                <DemoButton action="open a separate contact page with a long form" onAction={onAction} className="text-[#1a4f9c] underline">
                  Click here
                </DemoButton>
              </p>
            </div>
            <div>
              <DatedPhoto>
                <HvacScene className="block h-auto w-full" />
              </DatedPhoto>
              <div className="mt-4 border border-[#ccc] bg-[#fafafa] p-3 text-[12px]">
                <p className="font-bold">Spring Special!!</p>
                <p className="mt-1">$20 off AC tune up. Mention this website. Some restrictions apply.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#ccc] px-6 py-4 text-center text-[10px] text-[#666]">
            North Shore Heating &amp; Cooling Inc. | Long Island, NY | All Rights Reserved
            <br />
            <span className="text-[#1a4f9c] underline">Facebook</span> | <span className="text-[#1a4f9c] underline">Privacy</span>
          </div>
        </div>
      </div>
    </NonResponsive>
  );
}

const services = [
  { icon: Snowflake, title: "AC Repair & Installation", body: "Fast diagnosis, honest options, and installs sized for your home." },
  { icon: Flame, title: "Heating & Furnaces", body: "Furnace and boiler repair, replacement, and seasonal tune-ups." },
  { icon: Wind, title: "Heat Pumps & Ductless", body: "Efficient year-round comfort, including room-by-room ductless systems." },
  { icon: Wrench, title: "Maintenance Plans", body: "Priority scheduling and two seasonal visits to prevent breakdowns." },
];

const areas = ["Huntington", "Northport", "Port Washington", "Manhasset", "Oyster Bay", "Glen Cove", "Syosset", "Roslyn"];

function After({ mobile: m, onAction }: DemoProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const estimate = "open a short estimate request form (name, phone, and what's going on)";
  const call = `start a phone call to ${PHONE}`;
  const pad = m ? "px-5" : "px-12";

  return (
    <div className="relative min-h-full bg-white text-[#14243a]" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <div className={`flex items-center justify-between bg-[#0f2742] py-2 text-[12px] text-white/90 ${pad}`}>
        <span className="flex items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5 text-[#ff8a3d]" />
          24/7 emergency service
        </span>
        {!m && (
          <DemoButton action={call} onAction={onAction} className="font-semibold">
            Call {PHONE}
          </DemoButton>
        )}
      </div>

      <header className={`sticky top-0 z-10 flex items-center justify-between border-b border-[#e6ebf1] bg-white/95 py-3.5 backdrop-blur ${pad}`}>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#0f2742] text-white">
            <Snowflake aria-hidden="true" className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-bold tracking-tight">North Shore</p>
            <p className="text-[11px] font-medium text-[#5b6b80]">Heating &amp; Cooling</p>
          </div>
        </div>
        {m ? (
          <div className="flex items-center gap-2">
            <DemoButton action={call} onAction={onAction} label="Call" className="flex size-10 items-center justify-center rounded-full bg-[#fff1e8] text-[#e2601a]">
              <Phone aria-hidden="true" className="size-[18px]" />
            </DemoButton>
            <button type="button" aria-label={menuOpen ? "Close demo menu" : "Open demo menu"} onClick={() => setMenuOpen((v) => !v)} className="flex size-10 items-center justify-center rounded-full bg-[#f1f4f8]">
              {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-7 text-[14px] font-medium text-[#33465e]">
            {["Services", "Financing", "Service Areas", "Reviews"].map((item) => (
              <DemoButton key={item} action={`scroll to the ${item} section`} onAction={onAction} className="hover:text-[#0f2742]">
                {item}
              </DemoButton>
            ))}
            <DemoButton action={estimate} onAction={onAction} className="rounded-lg bg-[#e2601a] px-4 py-2.5 font-semibold text-white">
              Request an Estimate
            </DemoButton>
          </div>
        )}
      </header>
      {m && menuOpen && (
        <div className="border-b border-[#e6ebf1] bg-white px-5 py-2">
          {["Services", "Financing", "Service Areas", "Reviews"].map((item) => (
            <DemoButton key={item} action={`scroll to the ${item} section`} onAction={onAction} className="block w-full border-b border-[#f0f2f5] py-3 text-left text-[16px] font-medium last:border-0">
              {item}
            </DemoButton>
          ))}
        </div>
      )}

      <section className={`grid items-center gap-8 bg-gradient-to-b from-[#f5f8fc] to-white ${pad} ${m ? "py-8" : "grid-cols-[1.1fr_1fr] py-14"}`}>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e2601a]">Heating &amp; cooling · Long Island North Shore</p>
          <p className={`mt-3 font-bold leading-[1.08] tracking-tight ${m ? "text-[30px]" : "text-[46px]"}`}>
            Comfort restored. Fast, honest HVAC service.
          </p>
          <p className={`mt-4 leading-relaxed text-[#4a5b70] ${m ? "text-[15px]" : "text-[17px]"}`}>
            Repairs, replacements, and maintenance from licensed technicians, with upfront pricing before any work begins.
          </p>
          <div className={`mt-6 flex gap-3 ${m ? "flex-col" : ""}`}>
            <DemoButton action={estimate} onAction={onAction} className="flex items-center justify-center gap-2 rounded-lg bg-[#e2601a] px-5 py-3.5 text-[15px] font-semibold text-white">
              <CalendarClock aria-hidden="true" className="size-4" /> Request an Estimate
            </DemoButton>
            <DemoButton action={call} onAction={onAction} className="flex items-center justify-center gap-2 rounded-lg border border-[#cdd6e1] bg-white px-5 py-3.5 text-[15px] font-semibold">
              <Phone aria-hidden="true" className="size-4" /> {PHONE}
            </DemoButton>
          </div>
          <ul className={`mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-[#33465e]`}>
            {["Licensed & insured", "Upfront pricing", "Same-day appointments"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <BadgeCheck aria-hidden="true" className="size-4 text-[#1f8a5b]" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-[0_20px_40px_-20px_rgba(15,39,66,0.45)]">
            <HvacScene className="block h-auto w-full" />
          </div>
          <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-lg">
            <Stars />
            <span className="text-[12px] font-semibold">4.9 · 380+ reviews</span>
          </div>
        </div>
      </section>

      <section className={`${pad} ${m ? "pt-8" : "pt-6"}`}>
        <div className={`flex items-center justify-between gap-4 rounded-xl bg-[#0f2742] p-5 text-white ${m ? "flex-col items-start" : ""}`}>
          <div>
            <p className="text-[16px] font-semibold">No heat or no AC right now?</p>
            <p className="text-[13px] text-white/75">Emergency service is available 24/7, including weekends and holidays.</p>
          </div>
          <DemoButton action={call} onAction={onAction} className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-[#0f2742]">
            <Phone aria-hidden="true" className="size-4" /> Call now
          </DemoButton>
        </div>
      </section>

      <section className={`${pad} py-12`}>
        <p className={`font-bold tracking-tight ${m ? "text-[24px]" : "text-[30px]"}`}>What can we help with?</p>
        <div className={`mt-6 grid gap-4 ${m ? "" : "grid-cols-4"}`}>
          {services.map(({ icon: Icon, title, body }) => (
            <DemoButton key={title} action={`open the ${title} service page`} onAction={onAction} className="group rounded-xl border border-[#e6ebf1] p-5 text-left transition-shadow hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#fff1e8] text-[#e2601a]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <p className="mt-4 text-[15px] font-semibold">{title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5b6b80]">{body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#e2601a]">
                Request service <ArrowRight aria-hidden="true" className="size-3.5" />
              </span>
            </DemoButton>
          ))}
        </div>
      </section>

      <section className={`grid gap-4 ${pad} pb-12 ${m ? "" : "grid-cols-[1fr_1.4fr]"}`}>
        <div className="rounded-xl border border-[#e6ebf1] bg-[#f7f9fc] p-6">
          <CreditCard aria-hidden="true" className="size-6 text-[#0f2742]" />
          <p className="mt-3 text-[17px] font-semibold">Flexible financing on new systems</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#5b6b80]">Monthly payment options are available on approved credit, so a replacement doesn&apos;t have to wait.</p>
          <DemoButton action="open financing details and a pre-qualification link" onAction={onAction} className="mt-4 text-[13px] font-semibold text-[#e2601a]">
            See financing options →
          </DemoButton>
        </div>
        <div className="rounded-xl border border-[#e6ebf1] p-6">
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-semibold">What homeowners say</p>
            <Stars />
          </div>
          <div className={`mt-4 grid gap-4 ${m ? "" : "grid-cols-2"}`}>
            {[
              ["Showed up the same afternoon our AC died, explained the options, and had it running by dinner.", "Maria T., Huntington"],
              ["Clear quote, no pressure, and the install crew left the basement cleaner than they found it.", "Dev P., Northport"],
            ].map(([quote, name]) => (
              <figure key={name} className="text-[13px] leading-relaxed text-[#33465e]">
                <blockquote>&ldquo;{quote}&rdquo;</blockquote>
                <figcaption className="mt-2 text-[12px] font-semibold text-[#14243a]">{name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={`border-t border-[#e6ebf1] ${pad} py-10`}>
        <p className="flex items-center gap-2 text-[17px] font-semibold">
          <MapPin aria-hidden="true" className="size-5 text-[#e2601a]" /> Proudly serving the North Shore
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {areas.map((area) => (
            <li key={area} className="rounded-full border border-[#e6ebf1] bg-[#f7f9fc] px-3 py-1.5 text-[13px] font-medium">
              {area}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} pb-14`}>
        <div className={`rounded-2xl bg-[#0f2742] p-7 text-white ${m ? "" : "flex items-center justify-between"}`}>
          <div>
            <p className={`font-bold tracking-tight ${m ? "text-[22px]" : "text-[28px]"}`}>Get a free estimate</p>
            <p className="mt-1 text-[14px] text-white/75">Tell us what&apos;s going on. We usually reply within the hour during business hours.</p>
          </div>
          <DemoButton action={estimate} onAction={onAction} className={`rounded-lg bg-[#e2601a] px-5 py-3.5 text-[15px] font-semibold ${m ? "mt-5 w-full" : ""}`}>
            Request an Estimate
          </DemoButton>
        </div>
      </section>

      <footer className={`bg-[#0b1d31] ${pad} py-6 text-[12px] text-white/60`}>North Shore Heating &amp; Cooling · Fictional business for demonstration</footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-[#e6ebf1] bg-white/95 p-3 backdrop-blur">
          <DemoButton action={call} onAction={onAction} className="flex items-center justify-center gap-1.5 rounded-lg border border-[#cdd6e1] py-3 text-[14px] font-semibold">
            <Phone aria-hidden="true" className="size-4" /> Call
          </DemoButton>
          <DemoButton action={estimate} onAction={onAction} className="rounded-lg bg-[#e2601a] py-3 text-[14px] font-semibold text-white">
            Free Estimate
          </DemoButton>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive } from "./shared";
import { DemoPhoto } from "./photo";
import { hvacBody, hvacDisplay } from "./fonts";
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

const SERVICES = [
  ["AC repair", "Same-day diagnosis on most calls. Upfront price before we start.", "Service call $89"],
  ["Furnace & boiler repair", "Gas, oil, and electric. Most parts on the truck.", "Service call $89"],
  ["New AC & heating systems", "Sized for your house with a load calculation, not a guess.", "Free in-home estimate"],
  ["Heat pumps & ductless", "Whole-home or room-by-room. Rebate paperwork handled.", "Free in-home estimate"],
  ["Maintenance plan", "Spring AC + fall heating tune-up, priority scheduling.", "$19 / month"],
] as const;

const AREAS = ["Huntington", "Northport", "Port Washington", "Manhasset", "Oyster Bay", "Glen Cove", "Syosset", "Roslyn", "Cold Spring Harbor", "Greenlawn"];

const NAVY = "#12284a";
const ORANGE = "#e2571b";

function After({ mobile: m, onAction }: DemoProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const estimate = "open a short estimate request form (name, phone, and what's going on)";
  const call = `start a phone call to ${PHONE}`;
  const pad = m ? "px-5" : "px-14";
  const display = hvacDisplay.className;

  return (
    <div className={`relative min-h-full bg-white text-[#1d2939] ${hvacBody.className}`}>
      <div className={`flex items-center justify-between py-2 text-[13px] text-white ${pad}`} style={{ background: ORANGE }}>
        <span className="font-semibold">No heat or no AC? We&apos;re answering 24/7.</span>
        {!m && <span className="opacity-90">Serving the North Shore since 2004</span>}
      </div>

      <header className={`sticky top-0 z-10 flex items-center justify-between border-b border-[#e3e7ee] bg-white ${pad} ${m ? "py-3" : "py-4"}`}>
        <div className="leading-none">
          <p className={`${display} text-[24px] font-extrabold uppercase tracking-tight`} style={{ color: NAVY }}>
            North Shore
          </p>
          <p className={`${display} mt-0.5 text-[13px] font-semibold uppercase tracking-[0.18em]`} style={{ color: ORANGE }}>
            Heating &amp; Cooling
          </p>
        </div>
        {m ? (
          <div className="flex items-center gap-1">
            <DemoButton action={call} onAction={onAction} className="flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-[14px] font-bold text-white" style={{ background: ORANGE }}>
              <Phone aria-hidden="true" className="size-4" /> Call
            </DemoButton>
            <button type="button" aria-label={menuOpen ? "Close demo menu" : "Open demo menu"} onClick={() => setMenuOpen((v) => !v)} className="flex size-10 items-center justify-center">
              {menuOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <nav className="flex gap-6 text-[15px] font-medium">
              {["Cooling", "Heating", "Maintenance", "Financing", "About"].map((item) => (
                <DemoButton key={item} action={`open the ${item} page`} onAction={onAction} className="hover:underline">
                  {item}
                </DemoButton>
              ))}
            </nav>
            <DemoButton action={call} onAction={onAction} className="text-right leading-tight">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-[#5d6b80]">Call or text</span>
              <span className={`${display} block text-[24px] font-bold`} style={{ color: NAVY }}>
                {PHONE}
              </span>
            </DemoButton>
          </div>
        )}
      </header>
      {m && menuOpen && (
        <nav className="border-b border-[#e3e7ee] bg-white px-5">
          {["Cooling", "Heating", "Maintenance", "Financing", "About"].map((item) => (
            <DemoButton key={item} action={`open the ${item} page`} onAction={onAction} className="block w-full border-b border-[#eef1f5] py-3.5 text-left text-[17px] font-medium last:border-0">
              {item}
            </DemoButton>
          ))}
        </nav>
      )}

      <section className="relative">
        <DemoPhoto
          photo="hvac-hero"
          alt="HVAC technician servicing an outdoor air conditioning unit"
          sizes="1200px"
          position="60% 40%"
          className={m ? "h-[300px]" : "h-[470px]"}
          fallback={<HvacScene cover className="block h-full w-full" />}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${NAVY}f2 0%, ${NAVY}cc ${m ? "100%" : "45%"}, transparent ${m ? "100%" : "75%"})` }} />
        <div className={`absolute inset-0 flex flex-col justify-center text-white ${pad}`}>
          <h1 className={`${display} max-w-[560px] font-extrabold uppercase leading-[0.95] ${m ? "text-[40px]" : "text-[68px]"}`}>
            Heating &amp; AC repair, done right the first time.
          </h1>
          <p className={`mt-4 max-w-[460px] text-white/85 ${m ? "text-[15px]" : "text-[18px]"}`}>
            Licensed technicians in Huntington, Northport &amp; the North Shore. You get the price before we pick up a tool.
          </p>
          {!m && (
            <div className="mt-7 flex gap-3">
              <DemoButton action={estimate} onAction={onAction} className="rounded-sm px-6 py-4 text-[16px] font-bold text-white" style={{ background: ORANGE }}>
                Get a free estimate
              </DemoButton>
              <DemoButton action={call} onAction={onAction} className="rounded-sm border-2 border-white/80 px-6 py-[14px] text-[16px] font-bold">
                Call {PHONE}
              </DemoButton>
            </div>
          )}
        </div>
      </section>

      {m && (
        <div className="grid grid-cols-2 gap-2 px-5 py-4">
          <DemoButton action={call} onAction={onAction} className="rounded-sm border-2 py-3 text-[15px] font-bold" style={{ borderColor: NAVY, color: NAVY }}>
            Call now
          </DemoButton>
          <DemoButton action={estimate} onAction={onAction} className="rounded-sm py-3 text-[15px] font-bold text-white" style={{ background: ORANGE }}>
            Free estimate
          </DemoButton>
        </div>
      )}

      <section className={`grid border-b border-[#e3e7ee] ${m ? "grid-cols-2 gap-y-3 px-5 py-5" : "grid-cols-4 px-14 py-6"}`}>
        {[
          ["4.9", "Google rating · 380 reviews"],
          ["Same day", "on most repair calls"],
          ["Upfront", "flat-rate pricing"],
          ["NYS licensed", "& fully insured"],
        ].map(([big, small]) => (
          <div key={big} className={m ? "" : "border-l border-[#e3e7ee] pl-5 first:border-0 first:pl-0"}>
            <p className={`${display} text-[24px] font-bold leading-none`} style={{ color: NAVY }}>
              {big}
            </p>
            <p className="mt-1 text-[13px] text-[#5d6b80]">{small}</p>
          </div>
        ))}
      </section>

      <section className={`grid gap-10 ${pad} ${m ? "py-10" : "grid-cols-[1fr_1.2fr] py-16"}`}>
        <div>
          <h2 className={`${display} font-bold uppercase leading-none ${m ? "text-[32px]" : "text-[44px]"}`} style={{ color: NAVY }}>
            What we fix &amp; install
          </h2>
          <p className="mt-4 max-w-[420px] text-[16px] leading-relaxed text-[#46546a]">
            We work on every major brand. If it can be repaired for a fair price, we&apos;ll tell you before we talk about replacing
            it.
          </p>
          <DemoPhoto
            photo="hvac-tech"
            alt="Technician checking refrigerant pressure on a condenser"
            sizes="500px"
            className={`mt-6 rounded-sm ${m ? "h-[200px]" : "h-[260px]"}`}
            fallback={<HvacScene cover className="block h-full w-full" />}
          />
        </div>
        <ul className="divide-y divide-[#e3e7ee] border-y border-[#e3e7ee]">
          {SERVICES.map(([name, body, price]) => (
            <li key={name}>
              <DemoButton action={`open the ${name} page`} onAction={onAction} className="flex w-full items-start justify-between gap-4 py-5 text-left">
                <span>
                  <span className="block text-[18px] font-semibold" style={{ color: NAVY }}>
                    {name}
                  </span>
                  <span className="mt-1 block text-[14px] text-[#5d6b80]">{body}</span>
                </span>
                <span className="shrink-0 pt-1 text-[13px] font-semibold" style={{ color: ORANGE }}>
                  {price} →
                </span>
              </DemoButton>
            </li>
          ))}
        </ul>
      </section>

      <section className={pad}>
        <div className={`border-2 border-dashed p-6 ${m ? "" : "flex items-center justify-between"}`} style={{ borderColor: ORANGE, background: "#fff6f1" }}>
          <div>
            <p className={`${display} text-[28px] font-bold uppercase leading-none`} style={{ color: NAVY }}>
              New system? Pay monthly.
            </p>
            <p className="mt-2 text-[15px] text-[#46546a]">Financing on approved credit, with options from 12 to 84 months.</p>
          </div>
          <DemoButton action="open financing details and a 2-minute pre-qualification" onAction={onAction} className={`text-[15px] font-bold underline underline-offset-4 ${m ? "mt-4" : ""}`} style={{ color: ORANGE }}>
            See if you pre-qualify
          </DemoButton>
        </div>
      </section>

      <section className={`${pad} ${m ? "py-10" : "py-16"}`}>
        <div className={`grid gap-8 ${m ? "" : "grid-cols-3"}`}>
          {[
            ["Our AC quit on the hottest day of July. They were here by 3 and it was running by dinner. Explained everything, no upsell.", "Maria T.", "Huntington"],
            ["Got three quotes for a new furnace. North Shore's was clear, not the cheapest, but the install was spotless.", "Dev P.", "Northport"],
            ["The maintenance plan pays for itself. They found a cracked heat exchanger before it became a problem.", "Linda K.", "Syosset"],
          ].map(([quote, name, town]) => (
            <figure key={name}>
              <p className="text-[15px] tracking-[2px]" style={{ color: ORANGE }}>
                ★★★★★
              </p>
              <blockquote className="mt-2 text-[16px] leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className="mt-3 text-[13px] font-semibold text-[#5d6b80]">
                {name}, {town}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`text-white ${pad} ${m ? "py-10" : "py-14"}`} style={{ background: NAVY }}>
        <div className={`grid gap-10 ${m ? "" : "grid-cols-2"}`}>
          <div>
            <h2 className={`${display} font-bold uppercase leading-none ${m ? "text-[30px]" : "text-[40px]"}`}>Towns we serve</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">{AREAS.join(" · ")}</p>
            <p className="mt-4 text-[13px] text-white/60">Not on the list? Call us. We probably cover you.</p>
          </div>
          <div className="bg-white p-6 text-[#1d2939]">
            <p className={`${display} text-[26px] font-bold uppercase leading-none`} style={{ color: NAVY }}>
              Request a free estimate
            </p>
            <div className="mt-4 grid gap-2.5">
              {["Your name", "Phone number", "What's going on? (e.g. AC not cooling)"].map((field) => (
                <div key={field} className="border border-[#cfd6e0] px-3 py-3 text-[14px] text-[#6b778a]">
                  {field}
                </div>
              ))}
            </div>
            <DemoButton action={estimate} onAction={onAction} className="mt-4 w-full py-3.5 text-[16px] font-bold text-white" style={{ background: ORANGE }}>
              Send request
            </DemoButton>
            <p className="mt-2 text-[12px] text-[#6b778a]">We reply within an hour, 7am–7pm.</p>
          </div>
        </div>
      </section>

      <footer className={`bg-[#0c1b33] text-[12px] text-white/55 ${pad} py-6 ${m ? "pb-24" : ""}`}>
        North Shore Heating &amp; Cooling · Fictional business for demonstration · NYS Lic. #DEMO-0000
      </footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-2 border-t border-[#e3e7ee] bg-white">
          <DemoButton action={call} onAction={onAction} className="flex items-center justify-center gap-1.5 py-4 text-[15px] font-bold" style={{ color: NAVY }}>
            <Phone aria-hidden="true" className="size-4" /> Call
          </DemoButton>
          <DemoButton action={estimate} onAction={onAction} className="py-4 text-[15px] font-bold text-white" style={{ background: ORANGE }}>
            Free estimate
          </DemoButton>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive } from "./shared";
import { DemoPhoto } from "./photo";
import { verBody, verDisplay } from "./fonts";
import { DatedPhoto, PlatesScene } from "./scenes";

export default function RestaurantDemo(props: DemoProps) {
  return props.variant === "before" ? <Before {...props} /> : <After {...props} />;
}

function Before({ mobile, onAction }: DemoProps) {
  return (
    <NonResponsive mobile={mobile}>
      <div className="min-h-full bg-[#2b1a12] pb-6 text-[13px] text-[#e9dccb]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <div className="mx-auto w-[980px]">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-[30px] italic text-[#f3c77a]" style={{ fontFamily: "'Brush Script MT', cursive" }}>
              Casa Verona
            </p>
            <div className="flex gap-2">
              {[
                ["f", "#3b5998"],
                ["IG", "#c13584"],
                ["X", "#000"],
                ["Yelp", "#d32323"],
                ["TA", "#0b6e4c"],
              ].map(([label, color]) => (
                <DemoButton key={label} action="leave the site for a social media page" onAction={onAction} className="flex size-11 items-center justify-center rounded text-[13px] font-bold text-white" label={`${label} (social link)`}>
                  <span className="flex size-11 items-center justify-center rounded" style={{ background: color }}>
                    {label}
                  </span>
                </DemoButton>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-6 border-y border-[#5a4030] py-2 text-[13px] uppercase tracking-wide">
            {["Home", "About", "Gallery", "Events", "Press", "Contact"].map((item) => (
              <DemoButton key={item} action="open another page of the old site" onAction={onAction} className="text-[#f3c77a]">
                {item}
              </DemoButton>
            ))}
          </div>
          <div className="px-6 py-6">
            <DatedPhoto className="mx-auto w-[620px]">
              <PlatesScene className="block h-auto w-full" />
            </DatedPhoto>
            <p className="mt-6 text-center text-[24px] text-[#f3c77a]">~ Welcome to Casa Verona ~</p>
            <p className="mx-auto mt-3 max-w-[700px] text-center leading-[1.7]">
              Casa Verona brings the authentic flavors of Northern Italy to your table. Our chef prepares every dish with love using
              traditional family recipes and the freshest ingredients. Come join us for lunch or dinner and experience true Italian
              hospitality in a warm and inviting atmosphere. Reservations are recommended on weekends,{" "}
              <DemoButton action="open a third-party reservation page in a new tab" onAction={onAction} className="text-[11px] text-[#9fc1ff] underline">
                click here to reserve
              </DemoButton>
              .
            </p>
            <p className="mt-4 text-center">
              <DemoButton action="download casa-verona-menu-FINAL-v3.pdf (8.4 MB), which is hard to read on a phone" onAction={onAction} className="text-[15px] font-bold text-[#9fc1ff] underline">
                View Our Menu (PDF)
              </DemoButton>
            </p>
          </div>
          <div className="mt-6 border-t border-[#5a4030] px-6 pt-4 text-center text-[10px] text-[#cbb79f]">
            Casa Verona Ristorante · Open Tue-Sun · Kitchen hours vary, please call · © All rights reserved
          </div>
        </div>
      </div>
    </NonResponsive>
  );
}

const MENU = {
  Antipasti: [
    ["Burrata", "heirloom tomatoes, basil oil, grilled sourdough", "16"],
    ["Fritto misto", "calamari, shrimp, lemon, aioli", "19"],
    ["Arancini", "saffron risotto, fontina, pomodoro", "13"],
    ["Vitello tonnato", "thin veal, tuna sauce, capers", "18"],
  ],
  Pasta: [
    ["Tagliatelle al ragù", "slow-cooked beef and pork, parmigiano", "26"],
    ["Cacio e pepe", "tonnarelli, pecorino romano, black pepper", "22"],
    ["Ravioli di zucca", "butternut squash, brown butter, sage, amaretti", "24"],
    ["Linguine alle vongole", "littleneck clams, garlic, white wine, chili", "29"],
  ],
  Secondi: [
    ["Pollo al mattone", "brick-pressed half chicken, salsa verde", "29"],
    ["Branzino", "whole roasted, lemon, capers, olives", "36"],
    ["Bistecca", "dry-aged strip, rosemary potatoes", "44"],
  ],
  Dolci: [
    ["Tiramisù", "espresso, mascarpone, cocoa", "11"],
    ["Panna cotta", "vanilla bean, seasonal fruit", "10"],
    ["Affogato", "fior di latte gelato, espresso", "9"],
  ],
} as const;

type Course = keyof typeof MENU;

const WINE = "#7c1d2a";
const INK = "#2a211c";
const CREAM = "#f7f1e7";

function After({ mobile: m, onAction }: DemoProps) {
  const [course, setCourse] = useState<Course>("Pasta");
  const pad = m ? "px-5" : "px-16";
  const reserve = "check availability and confirm the table without leaving the site";
  const order = "open online ordering for pickup or delivery";
  const display = verDisplay.className;

  const select = (label: string, value: string) => (
    <DemoButton action={`open the ${label.toLowerCase()} picker`} onAction={onAction} className="flex flex-1 flex-col items-start border-r border-[#d9cdb9] px-4 py-2.5 text-left last:border-r-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a7a68]">{label}</span>
      <span className="mt-0.5 flex w-full items-center justify-between text-[15px]">
        {value} <ChevronDown aria-hidden="true" className="size-3.5 text-[#8a7a68]" />
      </span>
    </DemoButton>
  );

  return (
    <div className={`relative min-h-full ${verBody.className}`} style={{ background: CREAM, color: INK }}>
      <header className={`sticky top-0 z-10 border-b border-[#e3d8c6] ${pad} ${m ? "py-3" : "py-5"}`} style={{ background: CREAM }}>
        {m ? (
          <div className="flex items-center justify-between">
            <Menu aria-hidden="true" className="size-6" />
            <p className={`${display} text-[28px] font-semibold italic leading-none`}>Casa Verona</p>
            <DemoButton action={reserve} onAction={onAction} className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: WINE }}>
              Book
            </DemoButton>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <nav className="flex gap-7 text-[13px] font-bold uppercase tracking-[0.14em]">
              {["Menu", "Wine", "Private dining", "Visit"].map((item) => (
                <DemoButton key={item} action={`scroll to ${item.toLowerCase()}`} onAction={onAction}>
                  {item}
                </DemoButton>
              ))}
            </nav>
            <p className={`${display} text-[40px] font-semibold italic leading-none`}>Casa Verona</p>
            <div className="flex items-center justify-end gap-6 text-[13px] font-bold uppercase tracking-[0.14em]">
              <DemoButton action={order} onAction={onAction}>Order pickup</DemoButton>
              <DemoButton action={reserve} onAction={onAction} className="px-5 py-3 text-white" style={{ background: WINE }}>
                Reserve
              </DemoButton>
            </div>
          </div>
        )}
      </header>

      <DemoPhoto
        photo="verona-hero"
        alt="Plates of fresh pasta and antipasti on a wooden trattoria table"
        sizes="1200px"
        className={m ? "h-[260px]" : "h-[440px]"}
        fallback={<PlatesScene cover className="block h-full w-full" />}
      />

      <section className={`text-center ${pad} ${m ? "pt-8" : "pt-14"}`}>
        <p className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: WINE }}>
          Trattoria &amp; wine bar · 142 Main Street
        </p>
        <h1 className={`${display} mx-auto mt-3 max-w-[760px] font-medium leading-[1.02] ${m ? "text-[40px]" : "text-[64px]"}`}>
          Pasta made by hand every morning. Dinner six nights a week.
        </h1>
      </section>

      <section className={`${pad} ${m ? "py-7" : "py-10"}`}>
        <div className={`mx-auto max-w-[820px] border border-[#d9cdb9] bg-[#fffdf8] ${m ? "" : "flex"}`}>
          <div className={`flex ${m ? "border-b border-[#d9cdb9]" : "flex-1"}`}>
            {select("Party", "2 guests")}
            {select("Date", "Tonight")}
            {select("Time", "7:30 pm")}
          </div>
          <DemoButton action={reserve} onAction={onAction} className={`px-8 text-[14px] font-bold uppercase tracking-[0.14em] text-white ${m ? "w-full py-4" : ""}`} style={{ background: WINE }}>
            Find a table
          </DemoButton>
        </div>
        <p className="mt-4 text-center text-[15px]">
          Eating at home tonight?{" "}
          <DemoButton action={order} onAction={onAction} className="font-bold underline underline-offset-4" style={{ color: WINE }}>
            Order pickup or delivery
          </DemoButton>
        </p>
      </section>

      <section className={`border-y border-[#e3d8c6] ${pad} ${m ? "py-7" : "py-10"}`}>
        <div className={`mx-auto grid max-w-[920px] gap-8 ${m ? "" : "grid-cols-3"}`}>
          <div>
            <p className={`${display} text-[24px] italic`}>Hours</p>
            <table className="mt-2 w-full text-[14px]">
              <tbody>
                {[
                  ["Tue – Thu", "5 – 10 pm"],
                  ["Fri – Sat", "5 – 11 pm"],
                  ["Sunday", "4 – 9 pm"],
                  ["Monday", "Closed"],
                ].map(([day, time]) => (
                  <tr key={day}>
                    <td className="py-0.5 pr-4">{day}</td>
                    <td className="py-0.5 text-right">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className={`${display} text-[24px] italic`}>Find us</p>
            <p className="mt-2 text-[14px] leading-relaxed">
              142 Main Street
              <br />
              Free parking in the lot behind the building
            </p>
            <DemoButton action="open turn-by-turn directions in the visitor's maps app" onAction={onAction} className="mt-2 text-[14px] font-bold underline underline-offset-4" style={{ color: WINE }}>
              Get directions
            </DemoButton>
          </div>
          <div>
            <p className={`${display} text-[24px] italic`}>Call</p>
            <DemoButton action="call the restaurant" onAction={onAction} className="mt-2 text-[18px] font-bold">
              (516) 555-0163
            </DemoButton>
            <p className="mt-1 text-[14px] text-[#6f6155]">Parties of 8+ please call ahead.</p>
          </div>
        </div>
      </section>

      <section className={`${pad} ${m ? "py-10" : "py-16"}`}>
        <div className="mx-auto max-w-[820px]">
          <div className="text-center">
            <p className={`${display} font-medium ${m ? "text-[40px]" : "text-[56px]"}`}>Menu</p>
            <p className="text-[14px] italic text-[#6f6155]">Dinner · changes with the season</p>
          </div>
          <div role="tablist" aria-label="Menu courses" className="mt-6 flex justify-center gap-5 overflow-x-auto">
            {(Object.keys(MENU) as Course[]).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={course === name}
                onClick={() => setCourse(name)}
                className={`${display} shrink-0 border-b-2 pb-1 text-[22px] italic transition-colors`}
                style={{ borderColor: course === name ? WINE : "transparent", color: course === name ? WINE : "#7a6b5d" }}
              >
                {name}
              </button>
            ))}
          </div>
          <ul role="tabpanel" aria-label={course} className={`mt-8 grid gap-x-14 gap-y-6 ${m ? "" : "grid-cols-2"}`}>
            {MENU[course].map(([dish, description, price]) => (
              <li key={dish}>
                <p className="flex items-baseline gap-2 text-[17px] font-bold">
                  <span>{dish}</span>
                  <span aria-hidden="true" className="flex-1 translate-y-[-4px] border-b border-dotted border-[#b9a98f]" />
                  <span>{price}</span>
                </p>
                <p className="mt-0.5 text-[14px] italic text-[#6f6155]">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`grid gap-3 ${pad} ${m ? "grid-cols-2" : "grid-cols-3"}`}>
        <DemoPhoto photo="verona-pasta" alt="Tagliatelle with ragù" sizes="400px" className={`${m ? "h-[160px]" : "h-[280px]"}`} fallback={<PlatesScene cover className="block h-full w-full" />} />
        <DemoPhoto photo="verona-wine" alt="Glasses of red wine at the bar" sizes="400px" className={`${m ? "h-[160px]" : "h-[280px]"}`} fallback={<PlatesScene cover className="block h-full w-full" />} />
        {!m && <DemoPhoto photo="verona-room" alt="Candlelit dining room" sizes="400px" className="h-[280px]" fallback={<PlatesScene cover className="block h-full w-full" />} />}
      </section>

      <section className={`${pad} ${m ? "py-10" : "py-16"}`}>
        <div className={`mx-auto grid max-w-[980px] items-center gap-8 ${m ? "" : "grid-cols-2"}`}>
          <DemoPhoto photo="verona-room" alt="Private dining room set for a dinner party" sizes="500px" className={m ? "h-[200px]" : "h-[320px]"} fallback={<PlatesScene cover className="block h-full w-full" />} />
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: WINE }}>
              Private dining &amp; catering
            </p>
            <p className={`${display} mt-2 font-medium leading-none ${m ? "text-[34px]" : "text-[44px]"}`}>La Sala, for up to 40 guests</p>
            <p className="mt-4 text-[15px] leading-relaxed">
              Birthdays, rehearsal dinners, and work dinners, with family-style or set menus. We also cater trays of our most-loved
              dishes for pickup.
            </p>
            <DemoButton action="open the private dining inquiry form" onAction={onAction} className="mt-5 border px-5 py-3 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: INK }}>
              Plan an event
            </DemoButton>
          </div>
        </div>
      </section>

      <footer className={`text-[13px] text-[#e9dfcf] ${pad} py-8 ${m ? "pb-24" : ""}`} style={{ background: INK }}>
        <p className={`${display} text-[26px] italic text-white`}>Casa Verona</p>
        <p className="mt-2">142 Main Street · (516) 555-0163 · Instagram @casaverona</p>
        <p className="mt-1 text-[#b9ab97]">Fictional restaurant for demonstration</p>
      </footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-2 border-t border-[#d9cdb9]" style={{ background: CREAM }}>
          <DemoButton action={order} onAction={onAction} className="py-4 text-[13px] font-bold uppercase tracking-[0.12em]">
            Order pickup
          </DemoButton>
          <DemoButton action={reserve} onAction={onAction} className="py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-white" style={{ background: WINE }}>
            Reserve
          </DemoButton>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin, Navigation, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, NonResponsive } from "./shared";
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
    ["Burrata", "Heirloom tomato, basil oil, grilled bread", "16"],
    ["Fritto Misto", "Calamari, shrimp, lemon aioli", "19"],
    ["Arancini", "Saffron risotto, fontina, pomodoro", "13"],
  ],
  Pasta: [
    ["Tagliatelle Bolognese", "Slow-cooked beef and pork ragù", "26"],
    ["Cacio e Pepe", "Tonnarelli, pecorino, black pepper", "22"],
    ["Ravioli di Zucca", "Butternut squash, brown butter, sage", "24"],
  ],
  Secondi: [
    ["Pollo al Mattone", "Brick-pressed chicken, salsa verde", "29"],
    ["Branzino", "Whole roasted, lemon, capers", "36"],
    ["Bistecca", "Dry-aged strip, rosemary potatoes", "44"],
  ],
  Dolci: [
    ["Tiramisù", "Espresso, mascarpone, cocoa", "11"],
    ["Panna Cotta", "Vanilla bean, seasonal fruit", "10"],
  ],
} as const;

type Course = keyof typeof MENU;

function After({ mobile: m, onAction }: DemoProps) {
  const [course, setCourse] = useState<Course>("Pasta");
  const pad = m ? "px-5" : "px-12";
  const reserve = "open a reservation picker (party size, date, time) without leaving the site";
  const order = "open online ordering for pickup or delivery";
  const serif = { fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" };

  return (
    <div className="relative min-h-full bg-[#fbf7f0] text-[#2a2420]" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <header className={`sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfce] bg-[#fbf7f0]/95 py-3.5 backdrop-blur ${pad}`}>
        <p className="text-[22px] tracking-tight" style={serif}>
          Casa Verona
        </p>
        {m ? (
          <DemoButton action={reserve} onAction={onAction} className="rounded-full bg-[#7a1f2b] px-4 py-2 text-[13px] font-semibold text-white">
            Reserve
          </DemoButton>
        ) : (
          <div className="flex items-center gap-7 text-[14px] font-medium">
            {["Menu", "Private Dining", "Catering", "Visit"].map((item) => (
              <DemoButton key={item} action={`scroll to ${item}`} onAction={onAction}>
                {item}
              </DemoButton>
            ))}
            <DemoButton action={order} onAction={onAction} className="rounded-full border border-[#2a2420]/20 px-4 py-2">
              Order Online
            </DemoButton>
            <DemoButton action={reserve} onAction={onAction} className="rounded-full bg-[#7a1f2b] px-4 py-2 font-semibold text-white">
              Reserve a Table
            </DemoButton>
          </div>
        )}
      </header>

      <section className="relative">
        <PlatesScene cover className={`block w-full ${m ? "h-[260px]" : "h-[420px]"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c120c]/85 via-[#1c120c]/35 to-transparent" />
        <div className={`absolute inset-x-0 bottom-0 ${pad} ${m ? "pb-6" : "pb-12"} text-white`}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#f3d8a6]">Northern Italian kitchen &amp; wine bar</p>
          <p className={`mt-2 leading-[1.05] ${m ? "text-[32px]" : "text-[54px]"}`} style={serif}>
            Handmade pasta.
            <br />
            Long tables. Good company.
          </p>
        </div>
      </section>

      <section className={`${pad} ${m ? "py-5" : "py-6"}`}>
        <div className={`grid gap-2.5 ${m ? "grid-cols-1" : "grid-cols-3"}`}>
          <DemoButton action={reserve} onAction={onAction} className="flex items-center justify-center gap-2 rounded-xl bg-[#7a1f2b] py-3.5 text-[15px] font-semibold text-white">
            <CalendarDays aria-hidden="true" className="size-4" /> Reserve a Table
          </DemoButton>
          <DemoButton action="jump to the menu below" onAction={onAction} className="flex items-center justify-center gap-2 rounded-xl border border-[#2a2420]/15 bg-white py-3.5 text-[15px] font-semibold">
            <UtensilsCrossed aria-hidden="true" className="size-4" /> View Menu
          </DemoButton>
          <DemoButton action={order} onAction={onAction} className="flex items-center justify-center gap-2 rounded-xl border border-[#2a2420]/15 bg-white py-3.5 text-[15px] font-semibold">
            <ShoppingBag aria-hidden="true" className="size-4" /> Order Online
          </DemoButton>
        </div>
        <div className={`mt-4 grid gap-3 rounded-xl border border-[#eadfce] bg-white p-4 text-[13px] ${m ? "" : "grid-cols-3"}`}>
          <p className="flex items-start gap-2">
            <Clock aria-hidden="true" className="mt-0.5 size-4 text-[#7a1f2b]" />
            <span>
              <strong className="block">Open today</strong>
              Lunch 12–3 · Dinner 5–10
            </span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 text-[#7a1f2b]" />
            <span>
              <strong className="block">142 Main Street</strong>
              Free parking behind the building
            </span>
          </p>
          <DemoButton action="open turn-by-turn directions in the visitor's maps app" onAction={onAction} className="flex items-center gap-2 text-left font-semibold text-[#7a1f2b]">
            <Navigation aria-hidden="true" className="size-4" /> Get directions
          </DemoButton>
        </div>
      </section>

      <section className={`${pad} py-8`}>
        <p className={`${m ? "text-[26px]" : "text-[34px]"}`} style={serif}>
          The menu
        </p>
        <div role="tablist" aria-label="Menu courses" className="mt-4 flex gap-1 overflow-x-auto border-b border-[#eadfce]">
          {(Object.keys(MENU) as Course[]).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={course === name}
              onClick={() => setCourse(name)}
              className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-[14px] font-medium transition-colors ${
                course === name ? "border-[#7a1f2b] text-[#7a1f2b]" : "border-transparent text-[#6f6155]"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <ul role="tabpanel" aria-label={course} className={`mt-2 grid ${m ? "" : "grid-cols-2 gap-x-10"}`}>
          {MENU[course].map(([dish, description, price]) => (
            <li key={dish} className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#eadfce] py-3.5">
              <span>
                <span className="block text-[15px] font-semibold">{dish}</span>
                <span className="block text-[13px] text-[#6f6155]">{description}</span>
              </span>
              <span className="text-[15px] font-semibold">${price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`grid gap-4 ${pad} pb-10 ${m ? "" : "grid-cols-2"}`}>
        {[
          ["Private Dining", "A private room for up to 40 guests, with set menus for birthdays, rehearsal dinners, and work events.", "open the private dining inquiry form"],
          ["Catering & Events", "Trays of our most-loved dishes for offices, parties, and holidays, ready for pickup or delivery.", "open the catering menu and order form"],
        ].map(([title, body, action]) => (
          <div key={title} className="rounded-xl bg-[#2a2420] p-6 text-[#f6efe4]">
            <p className="text-[20px]" style={serif}>
              {title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#d8ccbb]">{body}</p>
            <DemoButton action={action} onAction={onAction} className="mt-4 text-[13px] font-semibold text-[#f3d8a6]">
              Inquire →
            </DemoButton>
          </div>
        ))}
      </section>

      <footer className={`flex items-center justify-between border-t border-[#eadfce] ${pad} py-6 text-[12px] text-[#6f6155] ${m ? "pb-24" : ""}`}>
        <span>Casa Verona · Fictional restaurant for demonstration</span>
        <span className="flex items-center gap-3">
          <DemoButton action="call the restaurant" onAction={onAction} label="Call the restaurant">
            <Phone aria-hidden="true" className="size-4" />
          </DemoButton>
          <DemoButton action="open Instagram" onAction={onAction}>
            Instagram
          </DemoButton>
        </span>
      </footer>

      {m && (
        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-[#eadfce] bg-[#fbf7f0]/95 p-3 backdrop-blur">
          <DemoButton action={order} onAction={onAction} className="rounded-lg border border-[#2a2420]/20 py-3 text-[14px] font-semibold">
            Order Online
          </DemoButton>
          <DemoButton action={reserve} onAction={onAction} className="rounded-lg bg-[#7a1f2b] py-3 text-[14px] font-semibold text-white">
            Reserve a Table
          </DemoButton>
        </div>
      )}
    </div>
  );
}

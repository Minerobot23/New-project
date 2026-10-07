"use client";

import { CalendarHeart, Clock, MapPin, Sparkles } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton, Stars } from "./shared";
import { DatedPhoto, SalonScene } from "./scenes";

export default function SalonDemo(props: DemoProps) {
  return props.variant === "before" ? <Before {...props} /> : <After {...props} />;
}

/** A generic responsive template: it technically works on phones, but nothing is organized around booking. */
function Before({ mobile: m, onAction }: DemoProps) {
  return (
    <div className="min-h-full bg-white text-[#555]" style={{ fontFamily: "Verdana, Geneva, sans-serif" }}>
      <div className={`flex items-center justify-between bg-[#8e44ad] text-white ${m ? "px-2 py-2" : "px-8 py-4"}`}>
        <p className={m ? "text-[15px]" : "text-[22px]"}>Lumen Salon</p>
        <span className={m ? "text-[18px]" : "text-[13px]"}>{m ? "☰" : "Home  ·  About  ·  Services  ·  Gallery  ·  Contact"}</span>
      </div>
      <div className={m ? "" : "px-8 pt-6"}>
        <DatedPhoto className={m ? "border-0" : "mx-auto max-w-[760px]"}>
          <SalonScene className="block h-auto w-full" />
        </DatedPhoto>
      </div>
      <div className={m ? "px-2 py-3 text-[11px] leading-[1.45]" : "mx-auto max-w-[760px] px-8 py-6 text-[13px] leading-[1.6]"}>
        <p className={`text-[#8e44ad] ${m ? "text-[15px]" : "text-[22px]"}`}>Welcome To Our Salon</p>
        <p className="mt-2">
          We are a full service salon offering a variety of services for all of your beauty needs. Our talented team is dedicated to
          making you look and feel your best. We use only the best products. Walk-ins welcome when available.
        </p>
        <p className={`mt-3 font-bold ${m ? "text-[12px]" : "text-[14px]"}`}>Our Services</p>
        <p className="mt-1">
          Haircuts, Blowouts, Color, Highlights, Balayage, Keratin, Facials, Peels, Waxing, Brows, Lashes, Bridal, Updos and more.
          Prices vary by stylist and hair length. Please call for pricing.
        </p>
        <p className={`mt-3 font-bold ${m ? "text-[12px]" : "text-[14px]"}`}>Follow Us!</p>
        <p className="mt-1 text-[#8e44ad] underline">Instagram · Facebook · Pinterest</p>
        <p className="mt-5 border-t border-[#ddd] pt-3 text-[10px] text-[#6e6e6e]">
          Lumen Salon · Tues–Sat · Call for hours ·{" "}
          <DemoButton action="open a generic third-party booking page with no studio branding" onAction={onAction} className="text-[#8e44ad] underline">
            book online
          </DemoButton>
        </p>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    group: "Hair",
    items: [
      ["Cut & Style", "Consultation, wash, precision cut, and blowout", "65"],
      ["Single-Process Color", "Root touch-up or all-over color", "110"],
      ["Balayage", "Hand-painted, lived-in dimension", "220"],
    ],
  },
  {
    group: "Skin",
    items: [
      ["Signature Facial", "Cleanse, exfoliation, extractions, and mask", "95"],
      ["Hydrating Facial", "Deep hydration for dull or dry skin", "140"],
    ],
  },
  {
    group: "Brows & Lashes",
    items: [
      ["Brow Shaping", "Wax or thread with tint option", "30"],
      ["Lash Lift & Tint", "Natural lift that lasts weeks", "85"],
    ],
  },
] as const;

const TEAM = [
  ["AR", "Ana R.", "Color specialist"],
  ["JM", "Jules M.", "Cuts & styling"],
  ["SK", "Sofia K.", "Licensed esthetician"],
];

const GALLERY = ["#d9b8a6", "#b98f7e", "#e8d3c6", "#a4796a", "#cfae9c", "#8f6a5d"];

function After({ mobile: m, onAction }: DemoProps) {
  const pad = m ? "px-5" : "px-12";
  const book = "open online booking: pick a service, a team member, and an open time";
  const serif = { fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" };

  return (
    <div className="relative min-h-full bg-[#fbf8f5] text-[#2e2623]" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <header className={`sticky top-0 z-10 flex items-center justify-between border-b border-[#efe6df] bg-[#fbf8f5]/95 py-3.5 backdrop-blur ${pad}`}>
        <p className="text-[22px] tracking-tight" style={serif}>
          Lumen <span className="text-[13px] tracking-[0.2em] text-[#85624f]">HAIR &amp; SKIN</span>
        </p>
        <div className="flex items-center gap-6 text-[14px] font-medium">
          {!m &&
            ["Services", "Gallery", "Team", "Visit"].map((item) => (
              <DemoButton key={item} action={`scroll to ${item}`} onAction={onAction}>
                {item}
              </DemoButton>
            ))}
          <DemoButton action={book} onAction={onAction} className="rounded-full bg-[#2e2623] px-4 py-2 text-[13px] font-semibold text-white">
            Book{m ? "" : " Appointment"}
          </DemoButton>
        </div>
      </header>

      <section className={`grid items-center gap-8 ${pad} ${m ? "py-8" : "grid-cols-[1fr_1fr] py-14"}`}>
        <div>
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#85624f]">
            <Sparkles aria-hidden="true" className="size-3.5" /> Hair, color &amp; skin studio
          </p>
          <p className={`mt-3 leading-[1.05] ${m ? "text-[34px]" : "text-[52px]"}`} style={serif}>
            Thoughtful color. Healthy skin. Unhurried appointments.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#6b5a52]">
            Every visit starts with a real consultation, so you leave with something that suits you and is easy to live with.
          </p>
          <DemoButton action={book} onAction={onAction} className={`mt-6 flex items-center justify-center gap-2 rounded-full bg-[#2e2623] px-6 py-3.5 text-[15px] font-semibold text-white ${m ? "w-full" : ""}`}>
            <CalendarHeart aria-hidden="true" className="size-4" /> Book Appointment
          </DemoButton>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-[#6b5a52]">
            <Stars color="#b07a5f" /> Loved by regulars · 210+ reviews
          </p>
        </div>
        <div className="overflow-hidden rounded-[28px]">
          <SalonScene className="block h-auto w-full" />
        </div>
      </section>

      <section className={`${pad} py-10`}>
        <p className={`${m ? "text-[26px]" : "text-[34px]"}`} style={serif}>
          Services &amp; starting prices
        </p>
        <div className={`mt-6 grid gap-6 ${m ? "" : "grid-cols-3"}`}>
          {SERVICES.map(({ group, items }) => (
            <div key={group} className="rounded-2xl border border-[#efe6df] bg-white p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#85624f]">{group}</p>
              <ul className="mt-3 divide-y divide-[#f3ece6]">
                {items.map(([name, description, price]) => (
                  <li key={name} className="flex items-baseline justify-between gap-3 py-3">
                    <span>
                      <span className="block text-[14px] font-semibold">{name}</span>
                      <span className="block text-[12px] text-[#73635b]">{description}</span>
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold">from ${price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={`${pad} pb-10`}>
        <p className={`${m ? "text-[24px]" : "text-[30px]"}`} style={serif}>
          Recent work
        </p>
        <div className={`mt-5 grid gap-2 ${m ? "grid-cols-3" : "grid-cols-6"}`}>
          {GALLERY.map((color, index) => (
            <div
              key={color}
              role="img"
              aria-label={`Gallery photo ${index + 1} (illustrative)`}
              className="aspect-[4/5] rounded-xl"
              style={{ background: `linear-gradient(160deg, ${color}, #f3e7de)` }}
            />
          ))}
        </div>
      </section>

      <section className={`grid gap-6 ${pad} pb-12 ${m ? "" : "grid-cols-[1.2fr_1fr]"}`}>
        <div>
          <p className={`${m ? "text-[24px]" : "text-[30px]"}`} style={serif}>
            Meet the team
          </p>
          <ul className="mt-5 grid grid-cols-3 gap-3">
            {TEAM.map(([initials, name, role]) => (
              <li key={name} className="text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e8d3c6] text-[16px] font-semibold text-[#6b4a3c]">{initials}</span>
                <p className="mt-2 text-[13px] font-semibold">{name}</p>
                <p className="text-[11px] text-[#73635b]">{role}</p>
              </li>
            ))}
          </ul>
          <figure className="mt-6 rounded-2xl bg-white p-5 text-[13px] leading-relaxed">
            <Stars color="#b07a5f" />
            <blockquote className="mt-2">&ldquo;Ana listened, explained what my hair could realistically do, and the color is exactly what I wanted.&rdquo;</blockquote>
            <figcaption className="mt-2 text-[12px] font-semibold">Priya S.</figcaption>
          </figure>
        </div>
        <div className="rounded-2xl bg-[#2e2623] p-6 text-[#f3e7de]">
          <p className="text-[20px]" style={serif}>
            Visit the studio
          </p>
          <p className="mt-4 flex items-start gap-2 text-[13px]">
            <MapPin aria-hidden="true" className="mt-0.5 size-4" /> 18 Harbor Lane, second floor · street parking out front
          </p>
          <p className="mt-3 flex items-start gap-2 text-[13px]">
            <Clock aria-hidden="true" className="mt-0.5 size-4" /> Tue–Fri 10–7 · Sat 9–5 · Sun–Mon closed
          </p>
          <DemoButton action={book} onAction={onAction} className="mt-6 w-full rounded-full bg-[#f3e7de] py-3 text-[14px] font-semibold text-[#2e2623]">
            Book Appointment
          </DemoButton>
        </div>
      </section>

      <footer className={`border-t border-[#efe6df] ${pad} py-6 text-[12px] text-[#73635b]`}>Lumen Hair &amp; Skin Studio · Fictional business for demonstration</footer>
    </div>
  );
}

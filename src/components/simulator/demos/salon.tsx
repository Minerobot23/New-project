"use client";

import { ArrowRight } from "lucide-react";
import type { DemoProps } from "../types";
import { DemoButton } from "./shared";
import { DemoPhoto } from "./photo";
import { lumenBody, lumenDisplay } from "./fonts";
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
      ["Cut & finish", "60 min", "65"],
      ["Single-process color", "90 min", "110"],
      ["Balayage", "3 hr", "220"],
      ["Gloss / toner", "45 min", "55"],
    ],
  },
  {
    group: "Skin",
    items: [
      ["Signature facial", "60 min", "95"],
      ["Hydrating facial", "75 min", "140"],
    ],
  },
  {
    group: "Brows & lashes",
    items: [
      ["Brow shaping & tint", "30 min", "45"],
      ["Lash lift & tint", "60 min", "85"],
    ],
  },
] as const;

const TEAM = [
  ["Ana Ruiz", "Color & balayage"],
  ["Jules Marin", "Precision cuts, curly hair"],
  ["Sofia Kane", "Licensed esthetician"],
];

const CHARCOAL = "#26211f";
const CLAY = "#8a5a45";
const BONE = "#faf7f3";

function After({ mobile: m, onAction }: DemoProps) {
  const pad = m ? "px-6" : "px-16";
  const book = "open online booking: choose a service, a person, and an open time";
  const display = lumenDisplay.className;

  return (
    <div className={`relative min-h-full ${lumenBody.className}`} style={{ background: BONE, color: CHARCOAL }}>
      <header className={`sticky top-0 z-10 flex items-center justify-between ${pad} ${m ? "py-4" : "py-6"}`} style={{ background: `${BONE}f2` }}>
        <p className={`${display} text-[28px] font-light lowercase tracking-tight`}>lumen</p>
        {!m && (
          <nav className="flex gap-9 text-[14px] lowercase text-[#5c514c]">
            {["Services", "Work", "Team", "Visit"].map((item) => (
              <DemoButton key={item} action={`scroll to ${item.toLowerCase()}`} onAction={onAction} className="hover:text-black">
                {item}
              </DemoButton>
            ))}
          </nav>
        )}
        <DemoButton action={book} onAction={onAction} className="rounded-full border px-5 py-2 text-[14px] lowercase" style={{ borderColor: CHARCOAL }}>
          book
        </DemoButton>
      </header>

      <section className={`grid items-end gap-10 ${pad} ${m ? "pb-10 pt-2" : "grid-cols-[1.1fr_1fr] pb-20 pt-10"}`}>
        {m && (
          <DemoPhoto photo="lumen-hero" alt="Stylist finishing a client's hair in a bright studio" sizes="390px" position="50% 30%" className="h-[380px]" fallback={<SalonScene cover className="block h-full w-full" />} />
        )}
        <div className={m ? "" : "pb-6"}>
          <h1 className={`${display} font-light leading-[1.02] tracking-[-0.02em] ${m ? "text-[42px]" : "text-[76px]"}`}>
            Color, cuts &amp; skin care, with time to do it properly.
          </h1>
          <p className={`mt-6 max-w-[420px] leading-relaxed text-[#5c514c] ${m ? "text-[15px]" : "text-[17px]"}`}>
            A small studio on Harbor Lane. Every first visit starts with a real consultation, so you leave with something that suits
            you and is easy to live with.
          </p>
          <DemoButton action={book} onAction={onAction} className="group mt-8 inline-flex items-center gap-3 text-[16px]">
            <span className="border-b pb-0.5" style={{ borderColor: CHARCOAL }}>
              Book an appointment
            </span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </DemoButton>
        </div>
        {!m && (
          <div className="relative h-[560px]">
            <DemoPhoto photo="lumen-hero" alt="Stylist finishing a client's hair in a bright studio" sizes="420px" position="50% 30%" className="absolute right-0 top-0 h-[480px] w-[78%]" fallback={<SalonScene cover className="block h-full w-full" />} />
            <DemoPhoto photo="lumen-color" alt="Close-up of a soft balayage color" sizes="260px" className="absolute bottom-0 left-0 h-[240px] w-[44%] border-[10px] border-[#faf7f3]" fallback={<SalonScene cover className="block h-full w-full" />} />
          </div>
        )}
      </section>

      <section className={pad}>
        <p className="border-y border-[#e6ddd5] py-5 text-center text-[15px] text-[#5c514c]">
          New to Lumen? Your first appointment includes a free 15-minute consultation.
        </p>
      </section>

      <section className={`${pad} ${m ? "py-12" : "py-20"}`}>
        <div className={`grid gap-12 ${m ? "" : "grid-cols-[0.8fr_2fr]"}`}>
          <div>
            <h2 className={`${display} font-light leading-none ${m ? "text-[36px]" : "text-[48px]"}`}>Services</h2>
            <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-[#6b5f59]">
              Prices are starting points. Your stylist confirms the price at your consultation, before anything begins.
            </p>
          </div>
          <div className={`grid gap-10 ${m ? "" : "grid-cols-2"}`}>
            {SERVICES.map(({ group, items }) => (
              <div key={group}>
                <p className={`${display} text-[22px] italic`} style={{ color: CLAY }}>
                  {group}
                </p>
                <ul className="mt-3">
                  {items.map(([name, duration, price]) => (
                    <li key={name}>
                      <DemoButton action={`start booking a ${name.toLowerCase()}`} onAction={onAction} className="flex w-full items-baseline justify-between gap-3 border-b border-[#e6ddd5] py-3.5 text-left">
                        <span className="text-[15px]">{name}</span>
                        <span className="shrink-0 text-[13px] text-[#6b5f59]">
                          {duration} · from ${price}
                        </span>
                      </DemoButton>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pad} pb-16`}>
        <div className={`grid gap-4 ${m ? "grid-cols-2" : "grid-cols-[1.3fr_1fr_1fr]"}`}>
          <DemoPhoto photo="lumen-color" alt="Lived-in blonde balayage" sizes="420px" className={m ? "col-span-2 h-[260px]" : "row-span-2 h-[520px]"} fallback={<SalonScene cover className="block h-full w-full" />} />
          <DemoPhoto photo="lumen-skin" alt="Esthetician applying a facial treatment" sizes="300px" className={m ? "h-[180px]" : "h-[252px]"} fallback={<SalonScene cover className="block h-full w-full" />} />
          <DemoPhoto photo="lumen-interior" alt="The studio's styling stations with natural light" sizes="300px" className={m ? "h-[180px]" : "h-[252px]"} fallback={<SalonScene cover className="block h-full w-full" />} />
          {!m && (
            <div className="col-span-2 flex flex-col justify-end p-2">
              <p className={`${display} text-[30px] font-light italic leading-snug`}>
                &ldquo;Ana told me honestly what my hair could do, and the color is exactly what I wanted.&rdquo;
              </p>
              <p className="mt-3 text-[13px] text-[#6b5f59]">Priya S., client since 2023</p>
            </div>
          )}
        </div>
        {m && (
          <div className="mt-8">
            <p className={`${display} text-[24px] font-light italic leading-snug`}>
              &ldquo;Ana told me honestly what my hair could do, and the color is exactly what I wanted.&rdquo;
            </p>
            <p className="mt-3 text-[13px] text-[#6b5f59]">Priya S., client since 2023</p>
          </div>
        )}
      </section>

      <section className={`border-t border-[#e6ddd5] ${pad} ${m ? "py-12" : "py-16"}`}>
        <div className={`grid gap-12 ${m ? "" : "grid-cols-2"}`}>
          <div>
            <h2 className={`${display} font-light leading-none ${m ? "text-[34px]" : "text-[44px]"}`}>The team</h2>
            <ul className="mt-6">
              {TEAM.map(([name, role]) => (
                <li key={name} className="flex items-baseline justify-between border-b border-[#e6ddd5] py-4">
                  <span>
                    <span className="block text-[16px]">{name}</span>
                    <span className="block text-[13px] text-[#6b5f59]">{role}</span>
                  </span>
                  <DemoButton action={`book directly with ${name.split(" ")[0]}`} onAction={onAction} className="text-[13px] underline underline-offset-4" style={{ color: CLAY }}>
                    book with {name.split(" ")[0]}
                  </DemoButton>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={`${display} font-light leading-none ${m ? "text-[34px]" : "text-[44px]"}`}>Visit</h2>
            <p className="mt-6 text-[15px] leading-relaxed">
              18 Harbor Lane, second floor
              <br />
              Street parking out front
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#5c514c]">
              Tue–Fri 10–7 · Sat 9–5
              <br />
              Sun &amp; Mon closed
            </p>
            <DemoButton action="open directions in the visitor's maps app" onAction={onAction} className="mt-4 text-[14px] underline underline-offset-4">
              Get directions
            </DemoButton>
          </div>
        </div>
      </section>

      <footer className={`border-t border-[#e6ddd5] text-[12px] text-[#6b5f59] ${pad} py-6 pb-20`}>Lumen Hair &amp; Skin Studio · Fictional business for demonstration</footer>

      <div className={`pointer-events-none sticky bottom-0 z-10 flex ${m ? "justify-center pb-4" : "justify-end px-8 pb-6"}`}>
        <DemoButton action={book} onAction={onAction} className="pointer-events-auto rounded-full px-7 py-3.5 text-[15px] text-white shadow-lg" style={{ background: CHARCOAL }}>
          Book an appointment
        </DemoButton>
      </div>
    </div>
  );
}

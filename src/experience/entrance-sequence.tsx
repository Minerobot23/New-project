"use client";

import { gsap } from "gsap";
import { useCallback, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { CoverStage, coverBox } from "./cover-stage";
import { prefersReducedMotion } from "./use-reduced-motion";
import type { ExperienceImage } from "./types";

type Door = { cx: number; cy: number; w: number; h: number; r: number };

type Props = {
  /** The room seen through the doorway; the sequence ends on exactly this photo, full screen. */
  interior: ExperienceImage;
  /**
   * Optional real exterior photograph, with the doorway's rectangle inside it (photo fractions).
   * Without it, the doorway stands in a dark facade lit from inside.
   */
  exterior?: {
    image: ExperienceImage;
    door: { x: number; y: number; width: number; height: number };
  };
  /** Signage and copy around the door (name, kicker, ENTER button). Receives the enter trigger. */
  Copy: ComponentType<{ enter: () => void; entering: boolean }>;
  /** Called when the camera has passed through the door and the interior fills the screen. */
  onEntered: () => void;
};

/**
 * Approach and enter a place. Three beats on one timeline:
 * the copy clears, the camera walks toward the door (the door grows faster than the room inside it: depth),
 * then the doorway opens past the edges of the screen and the room becomes the scene.
 */
export function EntranceSequence({ interior, exterior, Copy, onEntered }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const facade = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const door = useRef<Door | null>(null);
  const [entering, setEntering] = useState(false);

  // The doorway's resting geometry: from the exterior photo when there is one, otherwise a proportioned arch.
  const restingDoor = useCallback((): Door => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (exterior) {
      const ratio = exterior.image.src.width / exterior.image.src.height;
      const box = coverBox(W, H, ratio, exterior.image.focus ?? { x: 0.5, y: 0.5 });
      const w = exterior.door.width * box.width;
      const h = exterior.door.height * box.height;
      return {
        cx: box.left + (exterior.door.x + exterior.door.width / 2) * box.width,
        cy: box.top + (exterior.door.y + exterior.door.height / 2) * box.height,
        w,
        h,
        r: 0,
      };
    }
    // Leave the top ~27% of the screen for signage and the bottom ~20% for the way in.
    const portrait = H > W;
    const w = portrait ? Math.min(W * 0.56, 290) : Math.min(Math.max(W * 0.17, 210), 320);
    const h = Math.min(H * (portrait ? 0.44 : 0.46), w * 1.7);
    return { cx: W / 2, cy: H * 0.555, w, h, r: w / 2 };
  }, [exterior]);

  const paint = useCallback((d: Door) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const top = d.cy - d.h / 2;
    const left = d.cx - d.w / 2;
    if (mask.current) {
      mask.current.style.clipPath = `inset(${top}px ${W - left - d.w}px ${H - top - d.h}px ${left}px round ${d.r}px ${d.r}px 0px 0px)`;
    }
    if (frame.current) {
      const pad = 10;
      Object.assign(frame.current.style, {
        left: `${left - pad}px`,
        top: `${top - pad}px`,
        width: `${d.w + pad * 2}px`,
        height: `${d.h + pad}px`,
        borderTopLeftRadius: `${d.r + pad}px`,
        borderTopRightRadius: `${d.r + pad}px`,
      });
    }
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      if (entering) return;
      door.current = restingDoor();
      paint(door.current);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [restingDoor, paint, entering]);

  const enter = useCallback(() => {
    if (entering || !door.current) return;
    setEntering(true);
    const d = door.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Reduced motion: open the doorway at once; the experience crossfades into the room.
    if (prefersReducedMotion()) {
      paint({ cx: W / 2, cy: H / 2, w: W, h: H, r: 0 });
      onEntered();
      return;
    }

    const approach = 1.55;
    const tl = gsap.timeline({
      onComplete: onEntered,
      defaults: { ease: "power2.inOut" },
    });

    // Beat 1: the copy clears.
    tl.to(copy.current, { opacity: 0, y: -18, duration: 0.6, ease: "power2.in" }, 0);

    // Beat 2: walk toward the door. The facade and door scale around the door's centre; the room inside scales less.
    tl.set(facade.current, { transformOrigin: `${d.cx}px ${d.cy}px` }, 0)
      .to(facade.current, { scale: approach, duration: 1.5 }, 0.15)
      .to(
        d,
        {
          w: d.w * approach,
          h: d.h * approach,
          r: d.r * approach,
          duration: 1.5,
          onUpdate: () => paint(d),
        },
        0.15,
      )
      .fromTo(room.current, { scale: 1.32 }, { scale: 1.2, duration: 1.5 }, 0.15);

    // Beat 3: through the doorway. The opening passes the screen edges; the room settles to its resting frame.
    tl.to(
      d,
      {
        cx: W / 2,
        cy: H / 2,
        w: W,
        h: H,
        r: 0,
        duration: 1.35,
        ease: "power3.inOut",
        onUpdate: () => paint(d),
      },
      1.45,
    )
      .to(frame.current, { opacity: 0, duration: 0.5 }, 1.45)
      .to(facade.current, { opacity: 0, scale: approach * 1.4, duration: 1.2, ease: "power2.in" }, 1.45)
      // Ends at 1.06: the first frame of the interior scene's drift, so the hand-over is invisible.
      .to(room.current, { scale: 1.06, duration: 1.5, ease: "power3.out" }, 1.45);
  }, [entering, onEntered, paint]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden bg-stage">
      <div ref={facade} className="absolute inset-0">
        {exterior ? (
          <CoverStage image={exterior.image} preload grade={<div className="absolute inset-0 bg-black/35" />} />
        ) : (
          // Constructed facade: night, a lit doorway, and light spilling onto the pavement.
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0b09_0%,#120f0c_55%,#0a0908_100%)]" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(28%_22%_at_50%_80%,rgba(255,196,120,0.16),transparent_100%)]"
            />
          </>
        )}
        <div className="film-grain" />
      </div>

      <div ref={frame} aria-hidden="true" className="absolute border-x border-t border-bone/25" />

      <div ref={mask} className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(50% 50% 50% 50%)" }}>
        <div ref={room} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.32)" }}>
          <CoverStage image={interior} preload />
        </div>
      </div>

      <div ref={copy} className="absolute inset-0">
        <Copy enter={enter} entering={entering} />
      </div>
    </div>
  );
}

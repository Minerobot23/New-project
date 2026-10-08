"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "./use-reduced-motion";

type Props = {
  /** Film files, served from /public. Only the one that fits the screen is requested. */
  sources: { landscape: string; portrait: string };
  /** First frame of the film, shown at once while the film loads. */
  poster: { landscape: string; portrait: string };
  /** Where the subject sits (fractions), so cropping matches the still scene the film hands over to. */
  focus?: { x: number; y: number };
  /** Accessible description of what the film shows. */
  label: string;
  /** Text on the control that leaves the film early. */
  skipLabel?: string;
  /**
   * Called once: the film ended, was skipped, could not play, or motion is reduced.
   * `held` is true only when the landscape cut played to its last frame, which is the frame the
   * next scene opens on, so the handover can be a plain cut.
   */
  onFinished: (result: { held: boolean }) => void;
  /** Copy drawn over the film. `progress` runs 0 to 1 so text can arrive on a beat. */
  children?: (state: { progress: number; playing: boolean }) => ReactNode;
};

/** Phones and upright tablets get the portrait cut. */
const PORTRAIT = "(max-width: 767px), (orientation: portrait) and (max-width: 1099px)";
/** If the film has not started this long after mounting, stop waiting for it. */
const START_LIMIT_MS = 9000;

/**
 * An arrival film that plays once, muted and inline, over its own poster.
 *
 * The film is decoration and never owns access: there is always a skip control, a failed or
 * refused playback falls back to the poster, reduced motion skips it, and a timer moves on if it
 * never starts. Everything here is driven by media events and timers, not animation frames.
 */
export function HeroFilm({ sources, poster, focus = { x: 0.5, y: 0.5 }, label, skipLabel = "Skip intro", onFinished, children }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });
  const [portrait, setPortrait] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const finish = useCallback((held = false) => {
    if (finished.current) return;
    finished.current = true;
    video.current?.pause();
    onFinishedRef.current({ held });
  }, []);

  // Pick the cut for this screen once, on the client, so only one file is ever requested.
  useEffect(() => {
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the viewport, which only exists on the client
    setPortrait(window.matchMedia(PORTRAIT).matches);
  }, [finish]);

  const start = useCallback(() => {
    const element = video.current;
    if (!element) return;
    element.play().then(
      () => setBlocked(false),
      (error: unknown) => {
        // Autoplay refused (data saver, low power mode): keep the poster and offer a Play button.
        if (error instanceof DOMException && error.name === "NotAllowedError") setBlocked(true);
      },
    );
  }, []);

  useEffect(() => {
    if (portrait === null) return;
    start();
    const guard = window.setTimeout(() => {
      if (!video.current || video.current.currentTime === 0) finish();
    }, START_LIMIT_MS);
    return () => window.clearTimeout(guard);
  }, [portrait, start, finish]);

  // Leaving by another route (a navigation control) must not fire a late "finished".
  useEffect(
    () => () => {
      finished.current = true;
    },
    [],
  );

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) start();
    else element.pause();
  };

  const position = `${focus.x * 100}% ${focus.y * 100}%`;
  const cut = portrait ? "portrait" : "landscape";

  return (
    <div className="absolute inset-0 overflow-hidden bg-stage">
      <picture>
        <source media={PORTRAIT} srcSet={poster.portrait} />
        {/* A plain image: the poster must paint before the film or any script is ready. */}
        <img
          src={poster.landscape}
          alt=""
          className="film-frame absolute inset-0 size-full object-cover"
          style={{ objectPosition: position }}
          fetchPriority="high"
        />
      </picture>
      {portrait !== null && (
        <video
          ref={video}
          src={sources[cut]}
          muted
          playsInline
          preload="auto"
          aria-label={label}
          tabIndex={-1}
          onPlaying={() => {
            setVisible(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => {
            const element = event.currentTarget;
            if (element.duration) setProgress(element.currentTime / element.duration);
          }}
          onEnded={() => finish(!portrait)}
          onError={() => finish()}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: position }}
        />
      )}

      {children?.({ progress, playing })}

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-3 px-5 pb-[11vh] md:justify-end md:px-8 md:pb-[13vh]">
        <button
          type="button"
          onClick={toggle}
          className="label inline-flex min-h-11 items-center gap-3 bg-stage/70 px-5 text-bone shadow-[inset_0_0_0_1px_rgba(239,234,226,0.45)] backdrop-blur-sm hover:bg-stage"
        >
          {blocked ? "Play film" : playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => finish()}
          className="label inline-flex min-h-11 items-center gap-3 bg-bone px-5 text-stage hover:bg-white"
        >
          {skipLabel} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

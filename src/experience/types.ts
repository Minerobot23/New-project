import type { StaticImageData } from "next/image";

/** A point inside a photograph, as fractions of its width and height (0 to 1). */
export type FocalPoint = { x: number; y: number };

/**
 * One photograph slot in an experience. `slot` is the stable path the capture guide refers to
 * (e.g. "interior/main-room"); replacing the file at that path swaps the photo without code changes.
 */
export type ExperienceImage = {
  slot: string;
  src: StaticImageData;
  alt: string;
  /** Where the subject sits; cover-cropping keeps this point in frame on any screen shape. */
  focus?: FocalPoint;
};

/**
 * How one scene hands over to the next.
 * - travel: the camera pushes into `origin` on the outgoing photo, and the next scene settles out of it.
 * - retreat: the reverse, used for "back" so returning feels like stepping out.
 * - fade: a held crossfade through the stage colour.
 * - cut: no animation (used when the outgoing frame already matches the incoming one).
 */
export type SceneTransition =
  | { kind: "travel"; origin: FocalPoint }
  | { kind: "retreat"; origin?: FocalPoint }
  | { kind: "fade" }
  | { kind: "cut" };

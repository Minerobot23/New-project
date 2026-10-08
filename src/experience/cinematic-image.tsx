"use client";

import type { ComponentProps } from "react";
import { CoverStage } from "./cover-stage";

type StageProps = ComponentProps<typeof CoverStage>;

/** Full-bleed photograph with a slow camera drift (Ken Burns). */
export function CinematicImage(props: StageProps) {
  return <CoverStage drift {...props} />;
}

/** Full-bleed photograph that shifts against the pointer for depth (desktop only; static on touch). */
export function ParallaxImage(props: StageProps) {
  return <CoverStage parallax {...props} />;
}

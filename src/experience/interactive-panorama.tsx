"use client";

import type { ReactNode } from "react";
import { CoverStage } from "./cover-stage";
import type { ExperienceImage } from "./types";

/**
 * A wide photograph (a stitched pano or a 21:9 frame) the visitor can drag to look around.
 * Hotspots passed as children stay pinned to the photo. True 360 equirectangular panoramas can
 * be added behind the same interface later with a WebGL viewer; this version needs no WebGL.
 */
export function InteractivePanorama({
  image,
  children,
  hint = "Drag to look around",
}: {
  image: ExperienceImage;
  children?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="absolute inset-0">
      <CoverStage image={image} pan sweepOnArrival>
        {children}
      </CoverStage>
      <p className="label pointer-events-none absolute inset-x-0 bottom-24 text-center text-bone/70 md:hidden">{hint}</p>
    </div>
  );
}

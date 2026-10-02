import React from "react";
import Crest from "../../assets/img/campus/crest.webp";
import Culture from "../../assets/img/campus/culture.webp";
import Gate from "../../assets/img/campus/gate.webp";
import Lab from "../../assets/img/campus/lab.webp";
import Students from "../../assets/img/campus/students.webp";

// AKATSICO campus photos (from the akaweb site's media) used as blended
// backdrops on the portal's dark brand surfaces.
export const CAMPUS = { students: Students, gate: Gate, culture: Culture, lab: Lab };
export type CampusPhoto = keyof typeof CAMPUS;

type PhotoProps = {
  photo: CampusPhoto;
  className?: string;
  // Fade the photo out toward one side so text on the other side stays on
  // a clean brand gradient.
  fade?: "left" | "right" | "bottom" | "none";
};

const FADES = {
  left: "[mask-image:linear-gradient(to_left,black_25%,transparent_90%)]",
  right: "[mask-image:linear-gradient(to_right,black_25%,transparent_90%)]",
  bottom: "[mask-image:linear-gradient(to_bottom,black_15%,transparent_85%)]",
  none: "",
};

// Photo rendered in the luminosity blend mode: it takes on the brand
// gradient's hue underneath, so any photo reads as on-brand navy.
export function AISPPhotoBlend({ photo, className = "opacity-40", fade = "left" }: PhotoProps) {
  return (
    <img
      src={CAMPUS[photo]}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none select-none absolute inset-0 h-full w-full object-cover mix-blend-luminosity ${FADES[fade]} ${className}`}
    />
  );
}

// Crest watermark.
export function AISPCrest({ className = "" }: { className?: string }) {
  return (
    <img
      src={Crest}
      alt=""
      aria-hidden
      decoding="async"
      className={`pointer-events-none select-none absolute ${className}`}
    />
  );
}

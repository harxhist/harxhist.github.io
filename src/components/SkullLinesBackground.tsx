"use client";

import Image from "next/image";

const SKULL_IMAGE = "/images/skull.jpg";
const SKULL_OPACITY = 0.25;

export function SkullLinesBackground() {
  return (
    <div
      className="skull-lines-bg"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Image
        src={SKULL_IMAGE}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        priority
        style={{
          objectFit: "contain",
          objectPosition: "center",
          opacity: SKULL_OPACITY,
        }}
      />
    </div>
  );
}
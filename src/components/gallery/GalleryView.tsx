"use client";

import { MasonryGrid } from "@once-ui-system/core";
import { OptimizedMedia } from "@/components";
import { gallery } from "@/resources";

export default function GalleryView() {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {gallery.images.map((image, index) => (
        <OptimizedMedia
          key={index}
          priority={index < 2}
          sizes="(max-width: 560px) 100vw, 50vw"
          radius="var(--radius-m, 8px)"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </MasonryGrid>
  );
}

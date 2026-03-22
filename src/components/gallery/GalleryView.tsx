"use client";

import { MasonryGrid } from "@once-ui-system/core";
import { OptimizedMedia } from "@/components";
import type { GalleryImageItem } from "@/lib/gallery-images";

type Props = {
  images: GalleryImageItem[];
};

export default function GalleryView({ images }: Props) {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {images.map((image, index) => (
        <OptimizedMedia
          key={image.src}
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

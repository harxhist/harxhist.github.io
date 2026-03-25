"use client";

import { MasonryGrid } from "@once-ui-system/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { OptimizedMedia } from "@/components";
import type { GalleryImageItem } from "@/lib/gallery-images";

type Props = {
  images: GalleryImageItem[];
};

export default function GalleryView({ images }: Props) {
  const INITIAL_COUNT = 12;
  const LOAD_BATCH = 10;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_COUNT, images.length),
  );

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_COUNT, images.length));
  }, [images.length]);

  useEffect(() => {
    if (!loadMoreRef.current || visibleCount >= images.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_BATCH, images.length));
        }
      },
      { rootMargin: "1200px 0px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [images.length, visibleCount]);

  const visibleImages = useMemo(
    () => images.slice(0, visibleCount),
    [images, visibleCount],
  );

  return (
    <>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {visibleImages.map((image, index) => (
        <OptimizedMedia
          key={image.src}
          priority={index < 1}
          sizes="(max-width: 560px) 100vw, 50vw"
          quality={72}
          radius="var(--radius-m, 8px)"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
        ))}
      </MasonryGrid>
      {visibleCount < images.length ? (
        <div ref={loadMoreRef} aria-hidden style={{ height: 1, width: "100%" }} />
      ) : null}
    </>
  );
}

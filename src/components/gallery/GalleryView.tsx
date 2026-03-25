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
  const initialBatchSize = useMemo(
    () => Math.min(INITIAL_COUNT, images.length),
    [images.length],
  );
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const [isInitialLoading, setIsInitialLoading] = useState(initialBatchSize > 0);
  const initialLoadedRef = useRef(0);
  const loaderTimeoutRef = useRef<number | null>(null);
  const postHideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setVisibleCount(initialBatchSize);
    initialLoadedRef.current = 0;
    setIsInitialLoading(initialBatchSize > 0);
    if (loaderTimeoutRef.current) {
      window.clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }
    if (postHideTimeoutRef.current) {
      window.clearTimeout(postHideTimeoutRef.current);
      postHideTimeoutRef.current = null;
    }
    if (initialBatchSize > 0) {
      // Hide the overlay even if some images are still streaming to avoid blocking UX.
      loaderTimeoutRef.current = window.setTimeout(() => {
        setIsInitialLoading(false);
      }, 4000);
    }
  }, [initialBatchSize]);

  useEffect(() => {
    return () => {
      if (loaderTimeoutRef.current) {
        window.clearTimeout(loaderTimeoutRef.current);
        loaderTimeoutRef.current = null;
      }
      if (postHideTimeoutRef.current) {
        window.clearTimeout(postHideTimeoutRef.current);
        postHideTimeoutRef.current = null;
      }
    };
  }, []);

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
      {isInitialLoading ? (
        <div className="gallery-initial-loader-overlay" aria-hidden>
          <div className="gallery-initial-loader" />
        </div>
      ) : null}
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
            onLoadingComplete={() => {
              if (index >= initialBatchSize) return;

              initialLoadedRef.current += 1;
              if (initialLoadedRef.current < initialBatchSize) return;

              if (loaderTimeoutRef.current) {
                window.clearTimeout(loaderTimeoutRef.current);
                loaderTimeoutRef.current = null;
              }
              if (postHideTimeoutRef.current) {
                window.clearTimeout(postHideTimeoutRef.current);
                postHideTimeoutRef.current = null;
              }

              // Let Masonry + browser layout settle so we don't show "wrong-sized" first paint.
              postHideTimeoutRef.current = window.setTimeout(() => {
                setIsInitialLoading(false);
              }, 220);
            }}
            onError={() => {
              if (index >= initialBatchSize) return;

              initialLoadedRef.current += 1;
              if (initialLoadedRef.current < initialBatchSize) return;

              if (loaderTimeoutRef.current) {
                window.clearTimeout(loaderTimeoutRef.current);
                loaderTimeoutRef.current = null;
              }
              if (postHideTimeoutRef.current) {
                window.clearTimeout(postHideTimeoutRef.current);
                postHideTimeoutRef.current = null;
              }

              postHideTimeoutRef.current = window.setTimeout(() => {
                setIsInitialLoading(false);
              }, 220);
            }}
          />
        ))}
      </MasonryGrid>
      {visibleCount < images.length ? (
        <div ref={loadMoreRef} aria-hidden style={{ height: 1, width: "100%" }} />
      ) : null}
    </>
  );
}

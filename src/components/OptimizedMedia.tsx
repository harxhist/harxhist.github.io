"use client";

import Image from "next/image";

const VIDEO_EXT = /\.(mp4|webm|ogg)(\?|$)/i;

function isVideo(src: string): boolean {
  return VIDEO_EXT.test(src);
}

export interface OptimizedMediaProps {
  src: string;
  alt: string;
  /** Only for images; use e.g. "16 / 9" or "3 / 4" */
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  /** For video: poster image URL to show before play */
  poster?: string;
  /** Extra class for the wrapper */
  className?: string;
  /** Border radius - applied as style */
  radius?: string;
  /** Enlarge on click (for video we don't implement; for image wrap in a modal if needed) */
  enlarge?: boolean;
  style?: React.CSSProperties;
}

export function OptimizedMedia({
  src,
  alt,
  aspectRatio = "16 / 9",
  priority = false,
  sizes = "(max-width: 960px) 100vw, 960px",
  poster,
  className,
  radius = "var(--radius-m, 8px)",
  style,
}: OptimizedMediaProps) {
  if (isVideo(src)) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio,
          borderRadius: radius,
          overflow: "hidden",
          ...style,
        }}
      >
        <video
          src={src}
          poster={poster}
          preload="metadata"
          controls
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          aria-label={alt}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: radius,
        overflow: "hidden",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

/** For use in MDX or when you only need an image (no video). */
export function OptimizedImage(
  props: Omit<OptimizedMediaProps, "aspectRatio"> & { aspectRatio?: string }
) {
  return <OptimizedMedia {...props} />;
}

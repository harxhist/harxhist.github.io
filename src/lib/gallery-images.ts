import fs from "node:fs";
import path from "node:path";

import type { Gallery } from "@/types";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

export type GalleryImageItem = Gallery["images"][number];

/**
 * All image files under `public/images/gallery`, sorted by filename (numeric-aware).
 * Used at build time for static export so every photo is listed without hand-maintaining the array.
 */
export function getGalleryImages(): GalleryImageItem[] {
  if (!fs.existsSync(GALLERY_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(GALLERY_DIR)
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."));

  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((filename) => {
    const base = filename.replace(/\.[^.]+$/i, "");
    const orientation =
      base.startsWith("vertical-") ? "vertical" : "horizontal";

    return {
      src: `/images/gallery/${filename}`,
      alt: `Gallery photo — ${base.replace(/-/g, " ")}`,
      orientation,
    };
  });
}

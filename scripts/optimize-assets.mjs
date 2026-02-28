#!/usr/bin/env node
/**
 * Optimize images and video in public/images for faster loading.
 * Run: npm run optimize-assets
 * Options: --dry-run (preview only), --images-only, --video-only
 *
 * Images: resized to max 1920px, compressed. HEIC → JPG (replace .heic refs in content with .jpg).
 * Video: re-encoded with H.264 (requires ffmpeg on PATH). Original saved as .mp4.backup.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 85;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const imagesOnly = args.includes("--images-only");
const videoOnly = args.includes("--video-only");

async function optimizeImages() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("Install sharp for image optimization: npm install -D sharp");
    return;
  }

  const exts = [".jpg", ".jpeg", ".png", ".webp", ".heic"];
  const files = walk(IMAGES_DIR).filter((f) =>
    exts.some((e) => f.toLowerCase().endsWith(e))
  );

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const ext = path.extname(file).toLowerCase();
    const outPath =
      ext === ".heic"
        ? file.replace(/\.heic$/i, ".jpg")
        : file;

    if (dryRun) {
      console.log("[dry-run] Would optimize:", rel);
      continue;
    }

    try {
      let pipeline = sharp(file);
      const meta = await pipeline.metadata();
      const { width, height } = meta;

      const needResize = width > MAX_WIDTH || height > MAX_WIDTH;
      if (needResize && width && height) {
        const w =
          width > height ? MAX_WIDTH : Math.round((width * MAX_WIDTH) / height);
        const h =
          height > width ? MAX_WIDTH : Math.round((height * MAX_WIDTH) / width);
        pipeline = pipeline.resize(w, h);
      }

      const tempPath = path.join(path.dirname(file), `.tmp-${path.basename(file)}`);
      if (ext === ".heic") {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
        await pipeline.toFile(outPath);
        if (outPath !== file) fs.unlinkSync(file);
        console.log("Converted HEIC → JPG:", rel);
      } else if (ext === ".png") {
        await pipeline.png({ compressionLevel: 6, quality: PNG_QUALITY }).toFile(tempPath);
        fs.renameSync(tempPath, file);
        console.log("Optimized:", rel);
      } else {
        await pipeline.jpeg({ quality: JPEG_QUALITY }).toFile(tempPath);
        fs.renameSync(tempPath, file);
        console.log("Optimized:", rel);
      }
    } catch (err) {
      console.error("Error", rel, err.message);
    }
  }
}

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

async function optimizeVideo() {
  const { execSync } = await import("child_process");
  const mp4s = walk(IMAGES_DIR).filter(
    (f) => f.toLowerCase().endsWith(".mp4")
  );

  for (const file of mp4s) {
    const rel = path.relative(ROOT, file);
    const dir = path.dirname(file);
    const base = path.basename(file, ".mp4");
    const outPath = path.join(dir, `${base}-web.mp4`);

    if (dryRun) {
      console.log("[dry-run] Would optimize video:", rel);
      continue;
    }

    try {
      execSync(
        `ffmpeg -y -i "${file}" -c:v libx264 -preset slow -crf 28 -movflags +faststart -an "${outPath}"`,
        { stdio: "inherit" }
      );
      const origSize = fs.statSync(file).size;
      const newSize = fs.statSync(outPath).size;
      if (newSize < origSize) {
        fs.renameSync(file, file + ".backup");
        fs.renameSync(outPath, file);
        console.log("Optimized video:", rel);
      } else {
        fs.unlinkSync(outPath);
        console.log("Kept original (smaller):", rel);
      }
    } catch (err) {
      if (err.message && err.message.includes("ffmpeg")) {
        console.warn("ffmpeg not found; install it to optimize video. Skipping:", rel);
      } else {
        console.error("Error", rel, err.message);
      }
    }
  }
}

async function main() {
  if (!videoOnly) await optimizeImages();
  if (!imagesOnly) await optimizeVideo();
}

main();

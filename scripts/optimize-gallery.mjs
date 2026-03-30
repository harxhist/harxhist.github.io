import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const INPUT_DIR = "public/images/gallery";
const OUTPUT_DIR = "public/images/gallery-opt";

// Max display width is ~50vw on a 1600px screen = 800px
// 2× for retina → 1600px is plenty
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1800; // for vertical portraits
const WEBP_QUALITY = 82;

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(INPUT_DIR)).filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f),
);

console.log(`Processing ${files.length} images...`);

let saved = 0;
let total = 0;

await Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(INPUT_DIR, file);
    const outputFile = file.replace(/\.(jpe?g|png|webp)$/i, ".webp");
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    if (existsSync(outputPath)) {
      console.log(`  skip  ${file}`);
      return;
    }

    try {
      const info = await sharp(inputPath)
        .rotate()  
        .resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: "inside",          // preserves aspect ratio, never upscales
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(outputPath);

      const orig = (await sharp(inputPath).metadata()).size ?? 0;
      const reduction = (((orig - info.size) / orig) * 100).toFixed(1);
      saved += orig - info.size;
      total += orig;
      console.log(`  ✓  ${file} → ${(info.size / 1024).toFixed(0)}KB  (${reduction}% smaller)`);
    } catch (err) {
      console.error(`  ✗  ${file}:`, err.message);
    }
  }),
);

console.log(
  `\nDone. Total saved: ${(saved / 1024 / 1024).toFixed(1)} MB / ${(total / 1024 / 1024).toFixed(1)} MB`,
);
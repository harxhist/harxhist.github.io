/**
 * Generates favicon.ico and apple-icon.png from public/images/skull.jpg.
 * Run: node scripts/generate-favicon.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import toIco from "to-ico";

const root = process.cwd();
const skullPath = path.join(root, "public/images/skull.jpg");

async function renderPng(size) {
  return sharp(skullPath)
    .resize(size, size, { fit: "cover", position: "center" })
    .flatten({ background: "#000000" })
    .png()
    .toBuffer();
}

const png16 = await renderPng(16);
const png32 = await renderPng(32);
const png48 = await renderPng(48);
const apple180 = await renderPng(180);

const ico = await toIco([png16, png32, png48]);

await mkdir(path.join(root, "src/app"), { recursive: true });
await mkdir(path.join(root, "public"), { recursive: true });

await writeFile(path.join(root, "public/favicon.ico"), ico);
await writeFile(path.join(root, "src/app/favicon.ico"), ico);
await writeFile(path.join(root, "src/app/apple-icon.png"), apple180);
await writeFile(path.join(root, "public/apple-icon.png"), apple180);

console.log("Generated favicon.ico and apple-icon.png");

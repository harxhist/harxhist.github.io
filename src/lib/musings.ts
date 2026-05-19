import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MusingMetadata, MusingPost } from "./musings-types";

export type { MusingKind, MusingMetadata, MusingPost } from "./musings-types";
export { encodeMusingsPdfPath } from "./musings-path";

const MUSINGS_POSTS_DIR = path.join(process.cwd(), "src", "app", "musings", "posts");

function readMusingFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: MusingMetadata = {
    title: data.title || "",
    summary: data.summary || "",
    kind: data.kind || "article",
    lang: data.lang,
    poem: data.poem,
    pdf: data.pdf,
    openPdfDirectly: data.openPdfDirectly === true,
    showCursor: data.showCursor !== false,
    publishedAt: data.publishedAt,
  };

  return { metadata, content };
}

export function getMusings(): MusingPost[] {
  if (!fs.existsSync(MUSINGS_POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(MUSINGS_POSTS_DIR)
    .filter((file) => path.extname(file) === ".mdx" && !file.startsWith("_"))
    .map((file) => {
      const { metadata, content } = readMusingFile(path.join(MUSINGS_POSTS_DIR, file));
      return {
        metadata,
        slug: path.basename(file, ".mdx"),
        content,
      };
    })
    .sort((a, b) => {
      const dateA = a.metadata.publishedAt ?? "";
      const dateB = b.metadata.publishedAt ?? "";
      if (dateA && dateB) return dateB.localeCompare(dateA);
      return a.metadata.title.localeCompare(b.metadata.title);
    });
}

export function getMusingBySlug(slug: string): MusingPost | undefined {
  return getMusings().find((post) => post.slug === slug);
}

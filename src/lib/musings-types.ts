export type MusingKind = "poetry" | "story" | "article";

export type MusingMetadata = {
  title: string;
  summary: string;
  kind: MusingKind;
  lang?: string;
  /** Multiline poem body — stanzas separated by blank lines */
  poem?: string;
  /** Public path to a PDF under `/musings-assets/...` */
  pdf?: string;
  /** Index card opens the PDF directly in a new tab */
  openPdfDirectly?: boolean;
  /** Show Apple Notes blinking cursor (default true for articles) */
  showCursor?: boolean;
  publishedAt?: string;
};

export type MusingPost = {
  metadata: MusingMetadata;
  slug: string;
  content: string;
};

"use client";

import Link from "next/link";
import { encodeMusingsPdfPath } from "@/lib/musings-path";
import type { MusingKind, MusingPost } from "@/lib/musings-types";

const kindLabels: Record<MusingKind, string> = {
  poetry: "Poetry",
  story: "Stories",
  article: "Articles & essays",
};

const kindOrder: MusingKind[] = ["poetry", "story", "article"];

type MusingsIndexProps = {
  posts: MusingPost[];
};

function groupByKind(posts: MusingPost[]) {
  return kindOrder
    .map((kind) => ({
      kind,
      label: kindLabels[kind],
      items: posts.filter((p) => p.metadata.kind === kind),
    }))
    .filter((g) => g.items.length > 0);
}

export default function MusingsIndex({ posts }: MusingsIndexProps) {
  const groups = groupByKind(posts);

  return (
    <div className="musings-index">
      {groups.map(({ kind, label, items }) => (
        <section key={kind} className="musings-index-section" aria-labelledby={`musings-${kind}`}>
          <h2 id={`musings-${kind}`} className="musings-index-heading">
            {label}
          </h2>
          <ul className="musings-index-list">
            {items.map((post) => {
              const opensPdf =
                post.metadata.openPdfDirectly && post.metadata.pdf;
              const pdfHref = post.metadata.pdf
                ? encodeMusingsPdfPath(post.metadata.pdf)
                : undefined;

              if (opensPdf && pdfHref) {
                return (
                  <li key={post.slug}>
                    <a
                      href={pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="musings-index-card"
                    >
                      <span className="musings-index-card-kind">
                        {kindLabels[post.metadata.kind]}
                      </span>
                      <span className="musings-index-card-title">
                        {post.metadata.title}
                      </span>
                      {post.metadata.summary ? (
                        <span className="musings-index-card-summary">
                          {post.metadata.summary}
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              }

              return (
                <li key={post.slug}>
                  <Link href={`/musings/${post.slug}`} className="musings-index-card">
                    <span className="musings-index-card-kind">
                      {kindLabels[post.metadata.kind]}
                    </span>
                    <span className="musings-index-card-title">{post.metadata.title}</span>
                    {post.metadata.summary ? (
                      <span className="musings-index-card-summary">
                        {post.metadata.summary}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Meta, Schema } from "@once-ui-system/core";
import { CustomMDX } from "@/components";
import ArticleNote from "@/components/musings/ArticleNote";
import PoetryNote from "@/components/musings/PoetryNote";
import { encodeMusingsPdfPath, getMusingBySlug, getMusings } from "@/lib/musings";
import { baseURL, musings, person } from "@/resources";

const NO_MUSINGS_SLUG = "__no-musings__";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getMusings();
  if (posts.length === 0) {
    return [{ slug: NO_MUSINGS_SLUG }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMusingBySlug(slug);
  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary || musings.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${musings.path}/${post.slug}`,
  });
}

export default async function MusingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === NO_MUSINGS_SLUG) {
    notFound();
  }

  const post = getMusingBySlug(slug);
  if (!post) {
    notFound();
  }

  const { metadata, content } = post;
  const path = `${musings.path}/${post.slug}`;

  return (
    <div className="musings-page landing-page">
      <Schema
        as="article"
        baseURL={baseURL}
        title={metadata.title}
        description={metadata.summary || musings.description}
        path={path}
        author={{
          name: person.name,
          url: `${baseURL}${musings.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <div className="musings-page-inner">
        <Link href={musings.path} className="musings-back">
          ← Musings
        </Link>
        <div className="musings-reader-wrap">
          {metadata.kind === "poetry" && metadata.poem ? (
            <PoetryNote title={metadata.title} lang={metadata.lang}>
              {metadata.poem}
            </PoetryNote>
          ) : (
            <ArticleNote
              title={metadata.title}
              pdfHref={metadata.pdf ? encodeMusingsPdfPath(metadata.pdf) : undefined}
              showCursor={metadata.showCursor}
            >
              {content.trim() ? <CustomMDX source={content} /> : null}
            </ArticleNote>
          )}
        </div>
      </div>
    </div>
  );
}

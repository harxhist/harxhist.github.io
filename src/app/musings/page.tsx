import Link from "next/link";
import { Meta, Schema } from "@once-ui-system/core";
import MusingsIndex from "@/components/musings/MusingsIndex";
import { getMusings } from "@/lib/musings";
import { baseURL, musings, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: musings.title,
    description: musings.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(musings.title)}`,
    path: musings.path,
  });
}

export default function MusingsPage() {
  const posts = getMusings();

  return (
    <div className="musings-page landing-page">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={musings.title}
        description={musings.description}
        path={musings.path}
        author={{
          name: person.name,
          url: `${baseURL}${musings.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <div className="musings-page-inner">
        <Link href="/bio" className="musings-back">
          ← Bio
        </Link>
        <h1 className="musings-index-title">{musings.label}</h1>
        <p className="musings-index-lead">{musings.description}</p>
        <MusingsIndex posts={posts} />
      </div>
    </div>
  );
}

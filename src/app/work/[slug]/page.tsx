import { getPosts } from "@/utils/utils";
import WorkSlugRedirect from "./WorkSlugRedirect";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "projects", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function WorkSlugPage() {
  return <WorkSlugRedirect />;
}

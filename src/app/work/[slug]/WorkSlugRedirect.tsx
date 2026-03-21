"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/** Legacy `/work/[slug]` → `/projects/[slug]`. */
export default function WorkSlugRedirect() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const slug = params?.slug;
    const s = Array.isArray(slug) ? slug.join("/") : slug;
    if (s) {
      router.replace(`/projects/${s}`);
    } else {
      router.replace("/projects");
    }
  }, [router, params]);
  return null;
}

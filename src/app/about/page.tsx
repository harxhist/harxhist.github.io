"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy `/about` URL → `/cv` (static export–friendly client redirect). */
export default function AboutRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/cv");
  }, [router]);
  return null;
}

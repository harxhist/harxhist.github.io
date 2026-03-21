"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy `/work` URL → `/projects`. */
export default function WorkRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/projects");
  }, [router]);
  return null;
}

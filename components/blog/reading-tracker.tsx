"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordRead } from "@/lib/reading-history";

export function ReadingTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const slug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
    if (slug && slug !== "blog") {
      recordRead(slug);
    }
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { postsMeta } from "@/lib/posts-data";

/** 进入文章详情页时，把浏览器标签页标题改为文章标题 */
export function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const slug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
    const post = postsMeta.find((p) => p.slug === slug);
    if (post) {
      document.title = `${post.title} - Oriensx`;
    }
  }, [pathname]);

  return null;
}

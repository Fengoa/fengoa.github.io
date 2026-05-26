"use client";

import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { postsMeta } from "@/lib/posts-data";

export function PostMetaInfo() {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const post = postsMeta.find((p) => p.slug === currentSlug);

  if (!post) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 pl-1 font-mono text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="size-3 -mt-px" />
        {post.date}
      </span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-border text-[10px]">
        {post.tag}
      </span>
    </div>
  );
}

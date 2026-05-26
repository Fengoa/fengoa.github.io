"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { postsMeta } from "@/lib/posts-data";
import similarityData from "@/public/similarity.json";

const similarity = similarityData as Record<string, string[]>;

export function RelatedPosts() {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const currentPost = postsMeta.find((p) => p.slug === currentSlug);
  if (!currentPost) return null;

  // 优先用相似度推荐，fallback 到同 tag
  let relatedSlugs = similarity[currentSlug];
  if (!relatedSlugs || relatedSlugs.length === 0) {
    relatedSlugs = postsMeta
      .filter((p) => p.tag === currentPost.tag && p.slug !== currentSlug)
      .map((p) => p.slug);
  }

  // 查找标题
  const related = relatedSlugs
    .map((slug) => postsMeta.find((p) => p.slug === slug))
    .filter(Boolean) as typeof postsMeta;

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mt-8 pt-6 border-t border-border/50">
      <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider uppercase">
        推荐阅读
      </span>
      <div className="flex flex-col gap-1.5">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={cn(
              "text-xs text-muted-foreground hover:text-foreground transition-colors",
              "line-clamp-1"
            )}
          >
            {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

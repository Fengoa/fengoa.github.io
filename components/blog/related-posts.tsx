"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { postsMeta } from "@/lib/posts-data";

export function RelatedPosts() {
  const pathname = usePathname();

  // 从 URL 提取当前 slug
  const currentSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");

  // 找到当前文章的 tag
  const currentPost = postsMeta.find((p) => p.slug === currentSlug);
  if (!currentPost) return null;

  // 过滤同 tag 的其他文章
  const related = postsMeta.filter(
    (p) => p.tag === currentPost.tag && p.slug !== currentSlug
  );

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mt-8 pt-6 border-t border-border/50">
      <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider uppercase">
        推荐阅读 · {currentPost.tag}
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

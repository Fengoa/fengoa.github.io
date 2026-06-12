"use client";

import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { postsMeta } from "@/lib/posts-data";
import { dislikePost, getDislikedSlugs } from "@/lib/reading-history";
import similarityData from "@/public/similarity.json";

const similarity = similarityData as Record<string, string[]>;
const MAX_RELATED = 10;

export function RelatedPosts() {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const currentPost = postsMeta.find((p) => p.slug === currentSlug);
  if (!currentPost) return null;

  return <RelatedPostsInner currentSlug={currentSlug} currentTag={currentPost.tag} />;
}

function RelatedPostsInner({ currentSlug, currentTag }: { currentSlug: string; currentTag: string }) {
  const [disliked, setDisliked] = useState<Set<string>>(() => getDislikedSlugs());

  const handleDislike = useCallback((slug: string) => {
    dislikePost(slug);
    setDisliked((prev) => new Set([...prev, slug]));
  }, []);

  // 优先用相似度推荐，fallback 到同 tag
  let relatedSlugs = similarity[currentSlug];
  if (!relatedSlugs || relatedSlugs.length === 0) {
    relatedSlugs = postsMeta
      .filter((p) => p.tag === currentTag && p.slug !== currentSlug)
      .map((p) => p.slug);
  }

  // 过滤不感兴趣的，限制数量
  const related = relatedSlugs
    .filter((slug) => !disliked.has(slug))
    .map((slug) => postsMeta.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, MAX_RELATED) as typeof postsMeta;

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mt-8 pt-6 border-t border-border/50">
      <span className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase">
        推荐阅读
      </span>
      <div className="flex flex-col gap-1.5">
        {related.map((post) => (
          <div key={post.slug} className="group flex items-center gap-1">
            <Link
              href={`/blog/${post.slug}`}
              className={cn(
                "flex-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
                "line-clamp-1"
              )}
            >
              {post.title}
            </Link>
            <button
              onClick={() => handleDislike(post.slug)}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-accent transition-all"
              title="不感兴趣"
            >
              <X className="size-3 text-muted-foreground/50" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

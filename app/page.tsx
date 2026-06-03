"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import similarityData from "@/public/similarity.json";
import { posts } from "./posts";
import { getReadSlugs, getDislikedSlugs, dislikePost } from "@/lib/reading-history";

const ALL_TAG = "all";
const REC_TAG = "picks";

/** 标签配置：英文 slug → 中文显示名 */
const TAG_CONFIG: { id: string; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "picks", label: "推荐" },
  { id: "llm", label: "大模型" },
  { id: "recsys", label: "推荐系统" },
  { id: "ml", label: "机器学习" },
  { id: "math", label: "数学" },
  { id: "resources", label: "资源" },
  { id: "dev", label: "建站" },
];

const TAGS = TAG_CONFIG.map((t) => t.id);
/** 中文 tag → 英文 id */
const TAG_CN_TO_ID: Record<string, string> = Object.fromEntries(
  TAG_CONFIG.map((t) => [t.label, t.id])
);

/** 把文章的中文 tag 转成英文 id */
function postTagToId(tag: string | undefined): string {
  if (!tag) return "";
  return TAG_CN_TO_ID[tag] || tag;
}

const similarity = similarityData as Record<string, string[]>;

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 从 URL 读取初始状态
  const initialTag = searchParams.get("tag") || ALL_TAG;
  const initialPage = Number(searchParams.get("page")) || 1;

  const [activeTag, setActiveTag] = useState(
    TAGS.includes(initialTag) ? initialTag : ALL_TAG
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const PAGE_SIZE = 20;

  // 同步状态到 URL
  const updateURL = useCallback(
    (tag: string, page: number) => {
      const params = new URLSearchParams();
      if (tag !== ALL_TAG) params.set("tag", tag);
      if (page > 1) params.set("page", String(page));
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    },
    [router]
  );

  // 计算每个标签的文章数量
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts[ALL_TAG] = posts.length;
    counts[REC_TAG] = 10;
    for (const tag of TAGS) {
      if (tag !== ALL_TAG && tag !== REC_TAG) {
        counts[tag] = posts.filter((p) => postTagToId(p.tag) === tag).length;
      }
    }
    return counts;
  }, []);

  // 客户端挂载标志（避免 hydration mismatch）
  const [mounted, setMounted] = useState(false);
  const [dislikedSlugs, setDislikedSlugs] = useState<Set<string>>(new Set());
  useEffect(() => {
    setMounted(true);
    setDislikedSlugs(getDislikedSlugs());
  }, []);

  const handleDislike = useCallback((slug: string) => {
    dislikePost(slug);
    setDislikedSlugs((prev) => new Set([...prev, slug]));
  }, []);

  const isRecMode = activeTag === REC_TAG && mounted;

  const filteredPosts = useMemo(() => {
    if (activeTag === ALL_TAG) return posts;

    if (activeTag === REC_TAG) {
      // SSR 或未挂载时显示全部（与服务端一致）
      if (!mounted) return posts;

      // 过滤不感兴趣的
      const available = posts.filter((p) => !dislikedSlugs.has(p.slug));

      // 基于阅读历史的个性化推荐
      const readSlugs = getReadSlugs();
      if (readSlugs.length === 0) return available.slice(0, 10);

      // 对每篇未读文章，计算和已读文章的平均相似度
      const scored = available
        .filter((p) => !readSlugs.includes(p.slug))
        .map((post) => {
          let totalSim = 0;
          let count = 0;
          for (const readSlug of readSlugs.slice(0, 10)) {
            const simList = similarity[readSlug];
            if (simList) {
              const rank = simList.indexOf(post.slug);
              if (rank >= 0) {
                totalSim += 1 / (rank + 1); // rank 越靠前分越高
                count++;
              }
            }
          }
          return { post, score: count > 0 ? totalSim / count : 0 };
        });

      scored.sort((a, b) => b.score - a.score);
      return scored.map((s) => s.post).slice(0, 10);
    }

    return posts.filter((p) => postTagToId(p.tag) === activeTag);
  }, [activeTag, mounted, dislikedSlugs]);

  // 分页
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  // 切换标签
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setCurrentPage(1);
    updateURL(tag, 1);
  };

  // 切换页码
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(activeTag, page);
  };

  return (
    <main className="py-20">
      <Grid.System>
        <BlogHero
          tags={TAG_CONFIG}
          activeTag={activeTag}
          onTagChange={handleTagChange}
          tagCounts={tagCounts}
        />
        <PostList posts={paginatedPosts} hideTopBorder onDislike={isRecMode ? handleDislike : undefined} />

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                  currentPage === i + 1
                    ? "border-foreground/60 text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              下一页
            </button>
          </div>
        )}
      </Grid.System>
    </main>
  );
}

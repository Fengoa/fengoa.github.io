"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

export type PostData = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  summary: string;
  cover?: string;
};

function formatDate(dateStr: string) {
  return dateStr;
}

export function PostCard({ post, index }: { post: PostData; index: number }) {
  const isEven = index % 2 === 0;
  const router = useRouter();
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    // 如果点击的是链接本身，不处理
    if ((e.target as HTMLElement).closest("a")) return;
    // 如果发生了拖拽（选中文字），不导航
    if (mouseDownPos.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      if (dx > 5 || dy > 5) return;
    }
    router.push(`/blog/${post.slug}`);
  };

  return (
    <article
      className="group relative transition-colors duration-300 hover:bg-white dark:hover:bg-white/5 cursor-pointer select-text"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 md:gap-8 overflow-hidden p-6 sm:p-8 lg:p-10"
        )}
      >
        {/* 封面区 — 移动端在上，桌面端根据奇偶左右排列 */}
        <div
          className={cn(
            "relative flex items-center justify-center mb-6 md:mb-0",
            isEven ? "md:order-2 md:justify-end" : "md:order-1 md:justify-start"
          )}
        >
          <div className="aspect-square rounded-full overflow-hidden size-90 border">
            {post.cover && (
              <Image
                src={post.cover}
                alt={post.title}
                className="size-full object-cover"
                width={320}
                height={320}
              />
            )}
          </div>
        </div>

        {/* 文字区 */}
        <div
          className={cn(
            "flex flex-col justify-center items-start gap-6 md:gap-12",
            isEven ? "md:order-1" : "md:order-2"
          )}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 font-mono text-xs text-muted-foreground tracking-wide">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3 -mt-px" />
                {formatDate(post.date)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground">
              {post.title}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-secondary-foreground transition-colors duration-200">
              {post.summary}
            </p>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-secondary-foreground hover:text-foreground transition-all duration-200"
            draggable={false}
          >
            阅读文章
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

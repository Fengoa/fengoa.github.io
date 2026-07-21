import React from "react";
import { TableOfContents } from "@/components/blog/toc";
import { RelatedPosts } from "@/components/blog/related-posts";
import { SeriesNavSidebar } from "@/components/blog/series-nav";
import { ReadingTracker } from "@/components/blog/reading-tracker";
import { PresentationMode } from "@/components/blog/presentation-mode";
import { ZenMode } from "@/components/blog/zen-mode";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <ReadingTracker />
      <PresentationMode />
      <ZenMode />
      <div className="max-w-3xl relative -mx-4 md:mx-auto">
        {/* 左侧目录 — 绝对定位，不占内容空间，h-full 让 sticky 生效 */}
        <aside className="hidden xl:block absolute right-full mr-8 w-48 top-0 h-full">
          <div className="sticky top-40">
            <TableOfContents />
          </div>
        </aside>

        {/* 右侧：系列（若有）+ 推荐阅读 */}
        <aside className="hidden xl:block absolute left-full ml-8 w-48 top-0 h-full">
          <div className="sticky top-40 flex flex-col gap-6">
            <SeriesNavSidebar />
            <RelatedPosts />
          </div>
        </aside>

        {/* 主阅读区域 — data-blog-main 供模式系统识别 */}
        <main
          data-blog-main
          className="min-w-0 py-16 px-4 md:px-8 lg:py-24"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { TableOfContents } from "@/components/blog/toc";
import { RelatedPosts } from "@/components/blog/related-posts";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto relative">
        {/* 右侧导航栏 — 绝对定位，不占内容空间，h-full 让 sticky 生效 */}
        <aside className="hidden xl:block absolute left-full ml-8 w-48 top-0 h-full">
          <div className="sticky top-40">
            <TableOfContents />
            <RelatedPosts />
          </div>
        </aside>

        {/* 主阅读区域 */}
        <main className="min-w-0 py-16 px-6 md:px-8 lg:py-24">{children}</main>
      </div>
    </div>
  );
}

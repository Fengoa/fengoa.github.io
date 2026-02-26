import React from "react";
import { TableOfContents } from "@/components/blog/toc";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto flex">
        {/* 左侧导航栏 — 占位，吸顶 */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24 py-16">
            <TableOfContents />
          </div>
        </aside>

        {/* 主阅读区域 */}
        <main className="flex-1 min-w-0 max-w-3xl py-16 px-6 md:px-8 lg:py-24">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { TableOfContents } from "@/components/blog/toc";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent relative">
      {/* 左侧导航栏  */}
      <nav className="absolute hidden lg:flex flex-col justify-end top-24 bottom-24 left-0 w-48 z-50">
        {/* 目录区域 */}
        <div className="flex-1 flex flex-col justify-end mb-8 overflow-y-auto no-scrollbar">
          <TableOfContents />
        </div>
      </nav>

      {/* 主阅读区域 */}
      <main className="max-w-4xl mx-auto py-16 px-6 md:px-8 lg:py-24">
        {children}
      </main>
    </div>
  );
}

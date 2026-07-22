import type { ReactNode } from "react";
import { TableOfContents } from "@/components/blog/toc";
import { PresentationMode } from "@/components/blog/presentation-mode";
import { ZenMode } from "@/components/blog/zen-mode";

export default function MonthlyIssueLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <PresentationMode />
      <ZenMode />
      <div className="relative -mx-4 max-w-3xl md:mx-auto">
        <aside className="absolute right-full top-0 mr-8 hidden h-full w-48 xl:block">
          <div className="sticky top-40">
            <TableOfContents backHref="/monthly" backLabel="月刊" />
          </div>
        </aside>

        <main
          data-blog-main
          className="min-w-0 px-4 py-16 md:px-8 lg:py-24"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

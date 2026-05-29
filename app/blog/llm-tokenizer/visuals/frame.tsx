"use client";

import { cn } from "@/lib/utils";

// =============================================================================
// 通用容器：所有可视化组件共用的画框
// =============================================================================

export function VisualFrame({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className="my-10">
      <div
        data-no-zoom
        className={cn(
          "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6",
          className
        )}
      >
        {children}
      </div>
      {title && (
        <figcaption className="mt-2 text-xs text-center text-muted-foreground font-mono">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

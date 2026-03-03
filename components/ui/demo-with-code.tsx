"use client";

import { type ReactNode } from "react";
import { highlight } from "sugar-high";
import { cn } from "@/lib/utils";

interface DemoWithCodeProps {
  /** 上方演示区域的内容 */
  children: ReactNode;
  /** 下方展示的代码字符串 */
  code: string;
  /** 代码语言，用于语法高亮，默认 tsx */
  language?: string;
  /** 演示区域额外样式 */
  demoClassName?: string;
  /** 整体容器额外样式 */
  className?: string;
}

/**
 * 演示 + 代码 组合组件，用于 MDX 中展示组件的视觉效果与对应源码。
 * 上方为演示区域，下方为带语法高亮的代码块。
 */
export function DemoWithCode({
  children,
  code,
  language = "tsx",
  demoClassName,
  className,
}: DemoWithCodeProps) {
  const html = highlight(code);

  return (
    <div
      className={cn(
        "my-8 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800",
        className
      )}
    >
      {/* 演示区域 */}
      <div
        className={cn(
          "flex min-h-[120px] items-center justify-center p-6 bg-neutral-50/50 dark:bg-neutral-900/30",
          demoClassName
        )}
      >
        {children}
      </div>

      {/* 代码区域 */}
      <div className="relative border-t border-neutral-200 dark:border-neutral-800 bg-transparent">
        <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed">
          <code
            className={cn("grid min-w-full", `language-${language}`)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

type MathProps = {
  /** LaTeX 源码。可以放 children 里也可以用此 prop。 */
  children?: string;
  /** 块级公式（独占一行，居中显示） */
  block?: boolean;
  /** 额外 className */
  className?: string;
};

/**
 * 渲染 LaTeX 数学公式。
 *
 * 用法（在 MDX 中可直接用，不需要 import）：
 *
 *   行内：<Math>x^2 + y^2 = r^2</Math>
 *   块级：<Math block>P(\text{next} \mid \text{context})</Math>
 */
export function Math({ children, block = false, className }: MathProps) {
  const source = (typeof children === "string" ? children : "").trim();

  const html = useMemo(() => {
    try {
      return katex.renderToString(source, {
        displayMode: block,
        throwOnError: false,
        // 错误时用红色显示原文，方便定位
        errorColor: "#dc2626",
        strict: "warn",
        output: "html",
        trust: false,
      });
    } catch (err) {
      console.error("[Math] render error:", err);
      return `<span style="color:#dc2626">${source}</span>`;
    }
  }, [source, block]);

  if (block) {
    return (
      <div
        className={cn(
          "my-6 overflow-x-auto py-3 text-center text-[1.05em]",
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={cn("inline-block align-baseline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMode } from "@/components/mode-provider";

/**
 * 禅模式：隐藏导航/页脚/侧边栏，放大字号 + 加宽行距。
 * 控制条只是一个"退出"按钮（ESC 也可退出）。
 */
export function ZenMode() {
  const { mode, setMode } = useMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || mode !== "zen") return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-400">
      <button
        type="button"
        onClick={() => setMode("normal")}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border shadow-sm text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        title="退出禅模式 ESC"
      >
        <X className="size-3.5" />
        <span>Zen</span>
      </button>
    </div>,
    document.body
  );
}

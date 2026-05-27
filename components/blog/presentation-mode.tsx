"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { useMode } from "@/components/mode-provider";

/**
 * 演示模式：把博客 main 内的内容按 <h2> 切片，全屏一次显示一页。
 * 实现方式：DOM 操作 —— 启动时遍历 main 的直接子节点，按 h2 包成
 * <div data-slide-group="N">，CSS 控制只显示当前 slide。退出时还原。
 */
export function PresentationMode() {
  const { mode, setMode } = useMode();
  const [slideCount, setSlideCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const originalChildrenRef = useRef<ChildNode[] | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // 进入 / 退出：切片处理
  useEffect(() => {
    if (mode !== "present") return;

    const main = document.querySelector<HTMLElement>(
      "main[data-blog-main]"
    );
    if (!main) {
      // 不是博客页 → 自动退出
      setMode("normal");
      return;
    }
    mainRef.current = main;

    // 记录原始 children 用于还原
    const originals = Array.from(main.childNodes);
    originalChildrenRef.current = originals;

    // 找到所有直接子 H2 作为切片锚点（也支持 H1 当首页）
    const groups: ChildNode[][] = [[]];
    const childArray = Array.from(main.children);
    childArray.forEach((node) => {
      if (node.tagName === "H2") {
        groups.push([node]);
      } else {
        groups[groups.length - 1].push(node);
      }
    });
    // 如果第一个 group 为空（h2 起头），去掉
    if (groups[0].length === 0) groups.shift();

    // 重新挂载：先清空 main，再装入 N 个 group 容器
    main.innerHTML = "";
    groups.forEach((nodes, i) => {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-slide-group", String(i));
      wrapper.className = "presentation-slide";
      nodes.forEach((n) => wrapper.appendChild(n));
      main.appendChild(wrapper);
    });

    setSlideCount(groups.length);
    setCurrent(0);
    main.setAttribute("data-current-slide", "0");

    return () => {
      // 还原：清空 main，把原始 children 一一放回
      if (!originalChildrenRef.current) return;
      main.innerHTML = "";
      originalChildrenRef.current.forEach((n) => main.appendChild(n));
      main.removeAttribute("data-current-slide");
      originalChildrenRef.current = null;
    };
  }, [mode, setMode]);

  // 同步当前页到 DOM
  useEffect(() => {
    if (mode !== "present" || !mainRef.current) return;
    mainRef.current.setAttribute("data-current-slide", String(current));
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [current, mode]);

  // 键盘控制
  useEffect(() => {
    if (mode !== "present") return;
    const onKey = (e: KeyboardEvent) => {
      // 命令面板打开时让位
      if (document.querySelector('[cmdk-root]')) return;

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "j":
          e.preventDefault();
          setCurrent((c) => Math.min(slideCount - 1, c + 1));
          break;
        case "ArrowLeft":
        case "PageUp":
        case "k":
          e.preventDefault();
          setCurrent((c) => Math.max(0, c - 1));
          break;
        case "Home":
        case "g":
          e.preventDefault();
          setCurrent(0);
          break;
        case "End":
        case "G":
          e.preventDefault();
          setCurrent(slideCount - 1);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, slideCount]);

  // 浏览器全屏 API
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const progress = useMemo(
    () => (slideCount > 0 ? ((current + 1) / slideCount) * 100 : 0),
    [current, slideCount]
  );

  if (!mounted || mode !== "present" || slideCount === 0) return null;

  // 控制条用 portal 渲染到 body，避免被 main 的 transform/overflow 影响
  return createPortal(
    <>
      {/* 顶部进度条 */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-400 bg-transparent">
        <div
          className="h-full bg-violet-500 dark:bg-violet-400 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 底部控制条 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-400 flex items-center gap-1 px-2 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border shadow-lg">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="上一页 ← / k"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="px-3 font-mono text-xs tabular-nums text-muted-foreground select-none">
          {current + 1} / {slideCount}
        </div>
        <button
          type="button"
          onClick={() =>
            setCurrent((c) => Math.min(slideCount - 1, c + 1))
          }
          disabled={current === slideCount - 1}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="下一页 → / Space / j"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="全屏 f"
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setMode("normal")}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="退出 ESC"
        >
          <X className="size-4" />
        </button>
      </div>
    </>,
    document.body
  );
}

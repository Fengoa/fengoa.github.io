"use client";

import { useRef, useState } from "react";

/**
 * 通用交互内容嵌入组件：
 * - 响应式 16:9 容器包裹 iframe
 * - 「放大」：在窗口内弹出接近全视口的模态层
 * - 「全屏」：调用浏览器 Fullscreen API
 * 适用于把在线小游戏 / 交互 Demo 嵌入博客正文。
 */
export function GameEmbed({
  src,
  title = "在线试玩",
  ratio = 16 / 9,
  allow = "fullscreen; pointer-lock",
}: {
  src: string;
  title?: string;
  ratio?: number;
  allow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);

  const goFullscreen = () => {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  const frame = (
    <iframe
      src={src}
      title={title}
      allow={allow}
      loading="lazy"
      className="absolute inset-0 h-full w-full border-0"
    />
  );

  const toolbar = (
    <div className="absolute right-2 top-2 z-10 flex gap-2">
      <button
        onClick={goFullscreen}
        className="rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
      >
        全屏
      </button>
      <button
        onClick={() => setZoom(true)}
        className="rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
      >
        放大
      </button>
    </div>
  );

  // 放大：覆盖视口大部分的模态层
  if (zoom) {
    return (
      <div className="fixed inset-0 z-100 flex flex-col bg-black/85 p-4 backdrop-blur md:p-10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-white">{title}</span>
          <div className="flex gap-2">
            <button
              onClick={goFullscreen}
              className="rounded-md bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
            >
              全屏
            </button>
            <button
              onClick={() => setZoom(false)}
              className="rounded-md bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
            >
              收起 ✕
            </button>
          </div>
        </div>
        <div
          ref={ref}
          className="relative flex-1 overflow-hidden rounded-xl border border-white/15"
        >
          {frame}
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div
        ref={ref}
        className="relative w-full overflow-hidden rounded-xl border border-neutral-300/30 dark:border-neutral-700/40"
        style={{ paddingTop: `${(1 / ratio) * 100}%` }}
      >
        {frame}
        {toolbar}
      </div>
    </div>
  );
}

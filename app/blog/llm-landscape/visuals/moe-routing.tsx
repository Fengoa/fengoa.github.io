"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

type Token = {
  word: string;
  /** 一组 8 个 expert 的路由概率，演示用，不是真模型 */
  routing: number[];
};

const TOKENS: Token[] = [
  { word: "推", routing: [0.05, 0.42, 0.08, 0.18, 0.03, 0.04, 0.15, 0.05] },
  { word: "荐", routing: [0.04, 0.38, 0.06, 0.22, 0.04, 0.06, 0.16, 0.04] },
  { word: "系", routing: [0.06, 0.04, 0.46, 0.06, 0.10, 0.04, 0.05, 0.19] },
  { word: "统", routing: [0.05, 0.05, 0.41, 0.05, 0.13, 0.05, 0.06, 0.20] },
  { word: "学", routing: [0.20, 0.04, 0.05, 0.04, 0.40, 0.05, 0.05, 0.17] },
  { word: "习", routing: [0.18, 0.05, 0.06, 0.04, 0.42, 0.04, 0.06, 0.15] },
  { word: "用", routing: [0.04, 0.05, 0.05, 0.06, 0.04, 0.45, 0.10, 0.21] },
  { word: "户", routing: [0.05, 0.06, 0.04, 0.06, 0.05, 0.40, 0.12, 0.22] },
];

const EXPERT_LABELS = ["语言学", "对话", "百科", "情绪", "代码", "数学", "翻译", "通识"];

const TOP_K = 2;

function topkIndices(arr: number[], k: number): Set<number> {
  const idx = arr.map((v, i) => [v, i] as [number, number]);
  idx.sort((a, b) => b[0] - a[0]);
  return new Set(idx.slice(0, k).map((p) => p[1]));
}

export function MoeRoutingAnimation() {
  const [tokenIdx, setTokenIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTokenIdx((i) => (i + 1) % TOKENS.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const tok = TOKENS[tokenIdx];
  const top = topkIndices(tok.routing, TOP_K);

  const numExperts = EXPERT_LABELS.length;
  const W = 720;
  const H = 280;

  const tokenX = 60;
  const tokenY = H / 2;
  const routerX = 220;
  const routerY = H / 2;
  const expertX = 520;
  const expertSpacing = (H - 40) / (numExperts - 1);
  const expertYStart = 20;

  return (
    <VisualFrame title="MoE 路由：每个 token 只激活 2 个专家">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 580 }}>
          <g>
            <motion.rect
              key={`tok-${tokenIdx}`}
              x={tokenX - 22}
              y={tokenY - 18}
              width={44}
              height={36}
              rx={6}
              className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={1}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.text
              key={`txt-${tokenIdx}`}
              x={tokenX}
              y={tokenY + 5}
              textAnchor="middle"
              fontSize="16"
              className="fill-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {tok.word}
            </motion.text>
            <text x={tokenX} y={tokenY - 28} textAnchor="middle" fontSize="9" fontFamily="monospace" className="fill-muted-foreground">
              输入 token
            </text>
          </g>

          <g>
            <rect
              x={routerX - 36}
              y={routerY - 28}
              width={72}
              height={56}
              rx={8}
              className="fill-violet-50 dark:fill-violet-950/40 stroke-violet-300 dark:stroke-violet-800"
              strokeWidth={1.2}
            />
            <text x={routerX} y={routerY - 8} textAnchor="middle" fontSize="11" className="fill-violet-700 dark:fill-violet-300 font-semibold">
              Router
            </text>
            <text x={routerX} y={routerY + 8} textAnchor="middle" fontSize="9" fontFamily="monospace" className="fill-violet-700 dark:fill-violet-300">
              top-{TOP_K}
            </text>
          </g>

          <line
            x1={tokenX + 22}
            y1={tokenY}
            x2={routerX - 36}
            y2={routerY}
            className="stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth={1.2}
            markerEnd="url(#moe-arrow)"
          />

          <defs>
            <marker id="moe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-neutral-400 dark:fill-neutral-600" />
            </marker>
          </defs>

          {EXPERT_LABELS.map((label, i) => {
            const ey = expertYStart + i * expertSpacing;
            const isTop = top.has(i);
            const w = tok.routing[i];

            const sx = routerX + 36;
            const sy = routerY;
            const tx = expertX - 50;
            const ty = ey;
            const cx = (sx + tx) / 2;

            return (
              <g key={i}>
                <motion.path
                  d={`M ${sx} ${sy} C ${cx} ${sy}, ${cx} ${ty}, ${tx} ${ty}`}
                  fill="none"
                  className={cn(
                    isTop ? "stroke-violet-500 dark:stroke-violet-400" : "stroke-neutral-300 dark:stroke-neutral-800"
                  )}
                  strokeWidth={isTop ? 1 + w * 6 : 0.6}
                  initial={false}
                  animate={{ opacity: isTop ? 0.95 : 0.35 }}
                  transition={{ duration: 0.4 }}
                />

                <motion.rect
                  x={expertX - 50}
                  y={ey - 14}
                  width={100}
                  height={28}
                  rx={5}
                  className={cn(
                    isTop
                      ? "fill-violet-100 dark:fill-violet-900/60 stroke-violet-400 dark:stroke-violet-500"
                      : "fill-neutral-50 dark:fill-neutral-900/60 stroke-neutral-200 dark:stroke-neutral-800"
                  )}
                  strokeWidth={1}
                  animate={{ opacity: isTop ? 1 : 0.55 }}
                  transition={{ duration: 0.3 }}
                />
                <text
                  x={expertX - 38}
                  y={ey + 4}
                  fontSize="10"
                  fontFamily="monospace"
                  className={cn(isTop ? "fill-violet-700 dark:fill-violet-200 font-semibold" : "fill-muted-foreground")}
                >
                  E{i}：{label}
                </text>
                {isTop && (
                  <text
                    x={expertX + 56}
                    y={ey + 4}
                    fontSize="9"
                    fontFamily="monospace"
                    className="fill-violet-600 dark:fill-violet-300"
                  >
                    {(w * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}

          <text x={expertX} y={H - 8} textAnchor="middle" fontSize="9" fontFamily="monospace" className="fill-muted-foreground">
            8 个 expert（每次只激活 {TOP_K} 个）
          </text>
        </svg>
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        总参数 8 × FFN，激活 {TOP_K} × FFN——容量大、计算少。DeepSeek-V3 把这件事推到 256 个 expert 每次激活 8 个。
      </div>
    </VisualFrame>
  );
}

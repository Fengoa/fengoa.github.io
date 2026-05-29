"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

const RESPONSE = `LLaMA 3 在三个方面做了升级：注意力换成 GQA，KV 显存更省；训练数据扩大到 15T tokens；上下文长度从 4K 提到 8K。`;

// 假设：模型生成 100 tokens，每个 token 50ms。
// batch: 等全部生成完一次性返回，TTFT = 5000ms
// stream: 第一个 token 50ms 就到，之后每 50ms 来一个

const TOKEN_INTERVAL = 30; // 每 token 间隔（ms）
const TOTAL_DURATION = 4500; // 全部生成耗时

export function StreamingVsBatchDemo() {
  const [running, setRunning] = useState(false);
  const [streamChars, setStreamChars] = useState(0);
  const [batchVisible, setBatchVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startedAt.current = Date.now();

    const tick = () => {
      const t = Date.now() - (startedAt.current ?? Date.now());
      setElapsed(t);

      // streaming：t / TOKEN_INTERVAL 个字符
      setStreamChars(Math.min(RESPONSE.length, Math.floor(t / TOKEN_INTERVAL)));

      // batch：到 TOTAL_DURATION 后一次性显示
      if (t >= TOTAL_DURATION) {
        setBatchVisible(true);
      }
    };

    const timer = setInterval(tick, 30);
    const stopAt = setTimeout(() => {
      clearInterval(timer);
      setRunning(false);
    }, TOTAL_DURATION + 500);

    return () => {
      clearInterval(timer);
      clearTimeout(stopAt);
    };
  }, [running]);

  function start() {
    setStreamChars(0);
    setBatchVisible(false);
    setElapsed(0);
    setRunning(true);
  }

  // TTFT
  const streamTTFT = streamChars > 0 ? "30 ms" : "—";
  const batchTTFT = batchVisible ? `${TOTAL_DURATION} ms` : "—";

  return (
    <VisualFrame title="Streaming vs Batch：第一个字到达的时间差出 100×">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={start}
            disabled={running}
            className={cn(
              "px-3 py-1.5 rounded border text-xs font-mono transition-all",
              running
                ? "border-neutral-200 dark:border-neutral-800 text-muted-foreground"
                : "border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:scale-[1.02]"
            )}
          >
            {running ? "生成中…" : "▶ 开始生成"}
          </button>
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            elapsed {(elapsed / 1000).toFixed(2)}s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Streaming */}
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                Streaming（SSE）
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                TTFT: <span className="text-emerald-600 dark:text-emerald-400">{streamTTFT}</span>
              </span>
            </div>
            <div className="min-h-24 font-mono text-xs leading-relaxed text-foreground">
              {RESPONSE.slice(0, streamChars)}
              {running && streamChars < RESPONSE.length && (
                <span className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-3">
              第一个字 30 ms 就出来，用户立刻知道有反应
            </div>
          </div>

          {/* Batch */}
          <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-400">
                Batch（一次返回）
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                TTFT: <span className="text-rose-600 dark:text-rose-400">{batchTTFT}</span>
              </span>
            </div>
            <div className="min-h-24 font-mono text-xs leading-relaxed text-foreground">
              {batchVisible ? (
                RESPONSE
              ) : running ? (
                <span className="text-muted-foreground italic">等待中…（屏幕一片空白）</span>
              ) : (
                <span className="text-muted-foreground italic">点击「开始生成」</span>
              )}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-3">
              整个 4.5 秒内屏幕没动静，用户开始怀疑是不是卡了
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-muted-foreground text-center pt-1">
          总生成时间相同，但 streaming 把感知延迟从「等 4.5 秒」变成「立刻有反应」
        </div>
      </div>
    </VisualFrame>
  );
}

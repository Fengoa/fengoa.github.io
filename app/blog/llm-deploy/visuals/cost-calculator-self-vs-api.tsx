"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 自部署：固定 GPU 月成本
// API：按 token 收费
// 找出拐点：每月多少 tokens 时自部署反而便宜

const SELF_COST_PER_MONTH = 500; // 1 张 A10G/L4 spot 月租约 $500
const API_COST_PER_MTOKEN = 2.5; // gpt-4o $2.5 / 1M tokens（输入输出粗合）

export function CostCalculatorSelfVsApi() {
  const [monthlyTokens, setMonthlyTokens] = useState(50_000_000); // 50M tokens

  const apiMonthly = useMemo(
    () => (monthlyTokens / 1_000_000) * API_COST_PER_MTOKEN,
    [monthlyTokens]
  );
  const selfMonthly = SELF_COST_PER_MONTH;
  const breakEvenTokens = (SELF_COST_PER_MONTH / API_COST_PER_MTOKEN) * 1_000_000;

  // 用对数刻度展示曲线
  const W = 600;
  const H = 220;
  const PAD = { l: 56, r: 16, t: 16, b: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  // x: 1M ~ 5B tokens（log）
  const xMin = Math.log10(1_000_000);
  const xMax = Math.log10(5_000_000_000);
  const yMax = 5000;

  const xS = (tokens: number) =>
    PAD.l + ((Math.log10(tokens) - xMin) / (xMax - xMin)) * innerW;
  const yS = (cost: number) => PAD.t + (1 - cost / yMax) * innerH;

  // 自部署：水平线
  const selfPath = `M ${xS(1_000_000)} ${yS(selfMonthly)} L ${xS(5_000_000_000)} ${yS(selfMonthly)}`;
  // API：随 tokens 线性涨
  const apiSamples = [];
  for (let i = 0; i <= 40; i++) {
    const t = Math.pow(10, xMin + (i / 40) * (xMax - xMin));
    const c = Math.min(yMax, (t / 1_000_000) * API_COST_PER_MTOKEN);
    apiSamples.push(`${i === 0 ? "M" : "L"} ${xS(t).toFixed(1)} ${yS(c).toFixed(1)}`);
  }
  const apiPath = apiSamples.join(" ");

  const cheaper = apiMonthly < selfMonthly ? "API" : "自部署";

  return (
    <VisualFrame title="自部署 vs API：算清楚每月用多少 tokens 才划算">
      <div className="space-y-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* 网格 */}
          {[1000, 2000, 3000, 4000].map((y) => (
            <g key={y}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={yS(y)}
                y2={yS(y)}
                stroke="currentColor"
                className="text-neutral-200 dark:text-neutral-800"
                strokeDasharray="2 3"
                strokeWidth={0.5}
              />
              <text
                x={PAD.l - 6}
                y={yS(y) + 3}
                textAnchor="end"
                className="text-[9px] font-mono fill-muted-foreground"
              >
                ${y}
              </text>
            </g>
          ))}
          <text
            x={PAD.l - 6}
            y={yS(0) + 3}
            textAnchor="end"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            $0
          </text>

          {/* x 轴刻度 */}
          {[1_000_000, 10_000_000, 100_000_000, 1_000_000_000, 5_000_000_000].map(
            (t) => (
              <g key={t}>
                <line
                  x1={xS(t)}
                  x2={xS(t)}
                  y1={H - PAD.b}
                  y2={H - PAD.b + 4}
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                />
                <text
                  x={xS(t)}
                  y={H - PAD.b + 14}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-muted-foreground"
                >
                  {t >= 1_000_000_000
                    ? `${t / 1_000_000_000}B`
                    : `${t / 1_000_000}M`}
                </text>
              </g>
            )
          )}
          <text
            x={W / 2}
            y={H - 4}
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            每月处理的 tokens
          </text>

          {/* 自部署线 */}
          <path d={selfPath} stroke="#10b981" strokeWidth={1.6} fill="none" />
          <text
            x={W - PAD.r - 6}
            y={yS(selfMonthly) - 6}
            textAnchor="end"
            className="text-[10px] font-mono fill-emerald-500"
          >
            自部署 ${SELF_COST_PER_MONTH}/月
          </text>

          {/* API 线 */}
          <path d={apiPath} stroke="#f59e0b" strokeWidth={1.6} fill="none" />
          <text
            x={xS(2_000_000_000)}
            y={yS(2_000_000_000 / 1_000_000 * API_COST_PER_MTOKEN) - 6}
            textAnchor="end"
            className="text-[10px] font-mono fill-amber-500"
          >
            API $2.5 / 1M tokens
          </text>

          {/* 拐点 */}
          <line
            x1={xS(breakEvenTokens)}
            x2={xS(breakEvenTokens)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="#8b5cf6"
            strokeDasharray="3 2"
            strokeWidth={0.8}
          />
          <text
            x={xS(breakEvenTokens) + 4}
            y={PAD.t + 12}
            className="text-[10px] font-mono fill-violet-500"
          >
            拐点 {(breakEvenTokens / 1_000_000).toFixed(0)}M
          </text>

          {/* 当前位置 */}
          <line
            x1={xS(monthlyTokens)}
            x2={xS(monthlyTokens)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="currentColor"
            className="text-foreground"
            strokeWidth={1.2}
          />
          <circle cx={xS(monthlyTokens)} cy={yS(apiMonthly)} r={3.5} fill="#f59e0b" />
          <circle cx={xS(monthlyTokens)} cy={yS(selfMonthly)} r={3.5} fill="#10b981" />
        </svg>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono">
            <label className="text-muted-foreground shrink-0">每月用量</label>
            <input
              type="range"
              min={Math.log10(1_000_000)}
              max={Math.log10(5_000_000_000)}
              step="0.05"
              value={Math.log10(monthlyTokens)}
              onChange={(e) =>
                setMonthlyTokens(Math.round(Math.pow(10, parseFloat(e.target.value))))
              }
              className="flex-1 accent-violet-500"
            />
            <span className="tabular-nums w-20 text-right">
              {monthlyTokens >= 1_000_000_000
                ? `${(monthlyTokens / 1_000_000_000).toFixed(2)}B`
                : `${(monthlyTokens / 1_000_000).toFixed(0)}M`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <Pill label="自部署" value={`$${selfMonthly.toFixed(0)}`} color="text-emerald-500" />
            <Pill label="API" value={`$${apiMonthly.toFixed(0)}`} color="text-amber-500" />
            <Pill
              label="便宜方案"
              value={cheaper}
              color={cheaper === "自部署" ? "text-emerald-500" : "text-amber-500"}
              highlight
            />
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function Pill({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded border px-3 py-2",
        highlight
          ? "border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40"
          : "border-neutral-200 dark:border-neutral-800"
      )}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-semibold mt-0.5 tabular-nums", color)}>
        {value}
      </div>
    </div>
  );
}

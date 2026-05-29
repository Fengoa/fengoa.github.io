"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

type Model = {
  name: string;
  org: string;
  /** 浮点年份，例：2024.5 = 2024 年中 */
  date: number;
  /** 总参数（B），MoE 用激活参数标注 active */
  params: number;
  /** MoE 激活参数；非 MoE 留空 */
  active?: number;
  /** 1-3，决定气泡大小 */
  influence: 1 | 2 | 3;
  desc: string;
};

const MODELS: Model[] = [
  { name: "GPT-2", org: "OpenAI", date: 2019.1, params: 1.5, influence: 2, desc: "首个被广泛使用的开源大模型，证明 scaling works。" },
  { name: "GPT-Neo", org: "EleutherAI", date: 2021.3, params: 2.7, influence: 1, desc: "社区复刻 GPT-3 的尝试，开了开源大模型先河。" },
  { name: "BLOOM", org: "BigScience", date: 2022.7, params: 176, influence: 1, desc: "多语言开源模型，46 种自然语言 + 13 种编程语言。" },
  { name: "OPT-175B", org: "Meta", date: 2022.5, params: 175, influence: 1, desc: "Meta 第一次开源 GPT-3 量级模型，但许可证受限。" },
  { name: "LLaMA-1", org: "Meta", date: 2023.2, params: 65, influence: 3, desc: "权重泄露后社区生态爆发，所有开源指令模型都从这里 fork。" },
  { name: "LLaMA-2", org: "Meta", date: 2023.6, params: 70, influence: 3, desc: "正式开放商用，Chat 版本对齐质量大幅提升。" },
  { name: "Mistral-7B", org: "Mistral", date: 2023.8, params: 7, influence: 3, desc: "用 GQA + Sliding Window 把 7B 做到 LLaMA-2-13B 水平。" },
  { name: "Mixtral-8x7B", org: "Mistral", date: 2023.11, params: 47, active: 13, influence: 3, desc: "首个出圈的开源 MoE，激活 13B 参数效果对标 70B 稠密模型。" },
  { name: "Yi-34B", org: "01.AI", date: 2023.10, params: 34, influence: 1, desc: "中文社区第一批高质量开源模型。" },
  { name: "Qwen-1.5", org: "Alibaba", date: 2024.1, params: 72, influence: 2, desc: "阿里第一代覆盖 0.5B-72B 全尺寸的开源模型族。" },
  { name: "LLaMA-3", org: "Meta", date: 2024.4, params: 70, influence: 3, desc: "数据量翻三倍到 15T token，70B 已逼近闭源旗舰。" },
  { name: "LLaMA-3.1", org: "Meta", date: 2024.7, params: 405, influence: 3, desc: "首次开源 400B+ 稠密模型，对标 GPT-4。" },
  { name: "DeepSeek-V2", org: "DeepSeek", date: 2024.5, params: 236, active: 21, influence: 2, desc: "MLA + 细粒度 MoE 把训练成本压到主流模型的零头。" },
  { name: "Qwen-2.5", org: "Alibaba", date: 2024.9, params: 72, influence: 3, desc: "中文场景稳定超过同尺寸 LLaMA-3，全球下载量第一梯队。" },
  { name: "DeepSeek-V3", org: "DeepSeek", date: 2024.12, params: 671, active: 37, influence: 3, desc: "训练只用 600 万美元，开源权重直接对标 GPT-4o。" },
  { name: "DeepSeek-R1", org: "DeepSeek", date: 2025.1, params: 671, active: 37, influence: 3, desc: "纯 RL 学出推理能力，o1 路线第一次被开源化。" },
  { name: "Gemma-2", org: "Google", date: 2024.6, params: 27, influence: 1, desc: "Google 在轻量级开源市场的回应。" },
];

const minDate = 2019;
const maxDate = 2025.4;
const minLogP = Math.log10(1);
const maxLogP = Math.log10(700);

const W = 760;
const H = 360;
const PAD_L = 56;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 40;

function xPos(date: number) {
  return PAD_L + ((date - minDate) / (maxDate - minDate)) * (W - PAD_L - PAD_R);
}
function yPos(params: number) {
  const t = (Math.log10(params) - minLogP) / (maxLogP - minLogP);
  return H - PAD_B - t * (H - PAD_T - PAD_B);
}
function radius(infl: 1 | 2 | 3) {
  return infl === 3 ? 11 : infl === 2 ? 8 : 6;
}

export function OpenSourceModelsScatter() {
  const [hover, setHover] = useState<number | null>(null);
  const yticks = [1, 7, 30, 100, 400];
  const xticks = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  const active = hover != null ? MODELS[hover] : null;

  return (
    <VisualFrame title="开源大模型生态 · 横轴时间，纵轴参数量（log），气泡大小代表社区影响力">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 600 }}>
          <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth={1} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth={1} />

          {yticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yPos(t)}
                y2={yPos(t)}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeDasharray="2 4"
                strokeWidth={0.6}
              />
              <text x={PAD_L - 6} y={yPos(t) + 3} textAnchor="end" fontSize="10" fontFamily="monospace" className="fill-muted-foreground">
                {t}B
              </text>
            </g>
          ))}
          {xticks.map((t) => (
            <text key={t} x={xPos(t)} y={H - PAD_B + 16} textAnchor="middle" fontSize="10" fontFamily="monospace" className="fill-muted-foreground">
              {t}
            </text>
          ))}

          {MODELS.map((m, i) => {
            const x = xPos(m.date);
            const y = yPos(m.params);
            const r = radius(m.influence);
            const isHover = hover === i;
            return (
              <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                {m.active && (
                  <circle
                    cx={x}
                    cy={yPos(m.active)}
                    r={r * 0.55}
                    className="fill-violet-300/40 dark:fill-violet-500/30 stroke-violet-400 dark:stroke-violet-500"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}
                {m.active && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={yPos(m.active)}
                    className="stroke-violet-400 dark:stroke-violet-500"
                    strokeWidth={0.6}
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  className={cn(
                    isHover
                      ? "fill-violet-500 dark:fill-violet-400 stroke-violet-600 dark:stroke-violet-300"
                      : "fill-violet-400/60 dark:fill-violet-500/60 stroke-violet-500 dark:stroke-violet-400"
                  )}
                  strokeWidth={1}
                />
                {(m.influence === 3 || isHover) && (
                  <text
                    x={x + r + 3}
                    y={y + 3}
                    fontSize="10"
                    fontFamily="monospace"
                    className={cn(isHover ? "fill-foreground font-semibold" : "fill-secondary-foreground")}
                  >
                    {m.name}
                  </text>
                )}
              </g>
            );
          })}

          <text x={PAD_L} y={PAD_T - 4} fontSize="9" fontFamily="monospace" className="fill-muted-foreground">
            参数量（B）
          </text>
        </svg>
      </div>

      <div className="mt-3 min-h-15 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-900/40 text-sm">
        {active ? (
          <>
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-semibold">{active.name}</span>
              <span className="text-xs text-muted-foreground">{active.org} · {active.date.toFixed(1)}</span>
              <span className="text-xs font-mono text-muted-foreground">
                {active.active ? `${active.params}B 总 / ${active.active}B 激活` : `${active.params}B`}
              </span>
            </div>
            <div className="text-xs text-secondary-foreground leading-relaxed">{active.desc}</div>
          </>
        ) : (
          <div className="text-xs text-muted-foreground leading-relaxed">
            实心气泡是模型总参数量。MoE 模型多画一个虚线气泡表示每次实际激活的参数——同样 671B，DeepSeek-V3 每次只跑 37B，成本接近 7B 模型。
          </div>
        )}
      </div>
    </VisualFrame>
  );
}

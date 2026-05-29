"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

type Node = {
  year: number;
  name: string;
  org: string;
  highlight: string;
  paper: string;
  desc: string;
  /** 影响力分级，决定圆圈大小 */
  impact: 1 | 2 | 3;
};

const NODES: Node[] = [
  {
    year: 2017,
    name: "Transformer",
    org: "Google",
    highlight: "Attention 取代 RNN",
    paper: "Attention Is All You Need",
    desc: "把 Self-Attention 当主角，序列建模从此摆脱循环依赖，并行训练成为可能。后面所有 LLM 都长在这个骨架上。",
    impact: 3,
  },
  {
    year: 2018,
    name: "GPT-1",
    org: "OpenAI",
    highlight: "Decoder-only 预训练",
    paper: "Improving Language Understanding by Generative Pre-Training",
    desc: "1.17 亿参数，先在大规模语料上预训练再在下游任务微调。把单向语言模型这条路证明了。",
    impact: 1,
  },
  {
    year: 2019,
    name: "GPT-2",
    org: "OpenAI",
    highlight: "1.5B 参数，零样本",
    paper: "Language Models are Unsupervised Multitask Learners",
    desc: "把规模再放大一个量级，模型开始展现出未经训练就能完成新任务的能力。",
    impact: 2,
  },
  {
    year: 2020,
    name: "GPT-3",
    org: "OpenAI",
    highlight: "175B，few-shot 涌现",
    paper: "Language Models are Few-Shot Learners",
    desc: "1750 亿参数，prompt 里塞几个例子模型就能照做。Scaling 这件事第一次有了肉眼可见的拐点。",
    impact: 3,
  },
  {
    year: 2020,
    name: "Scaling Laws",
    org: "OpenAI",
    highlight: "幂律预测 loss",
    paper: "Scaling Laws for Neural Language Models",
    desc: "训练 loss 随参数、数据、算力三者各自呈幂律下降。后续训练预算分配都从这里出发。",
    impact: 2,
  },
  {
    year: 2022,
    name: "InstructGPT",
    org: "OpenAI",
    highlight: "RLHF 让模型听话",
    paper: "Training language models to follow instructions",
    desc: "把人类偏好通过 PPO 灌进模型。ChatGPT 的核心做法，对齐这个词从此进入主流词汇。",
    impact: 3,
  },
  {
    year: 2022,
    name: "Chinchilla",
    org: "DeepMind",
    highlight: "参数与数据等比放大",
    paper: "Training Compute-Optimal Large Language Models",
    desc: "70B 参数喂 1.4T token，效果反超 280B 的 Gopher。GPT-3 之后大家才意识到数据严重不足。",
    impact: 2,
  },
  {
    year: 2023,
    name: "LLaMA",
    org: "Meta",
    highlight: "开源拉平起跑线",
    paper: "LLaMA: Open and Efficient Foundation LMs",
    desc: "7B 到 65B 全系列开源权重，一夜之间所有研究者都能在自己卡上跑大模型。",
    impact: 3,
  },
  {
    year: 2023,
    name: "GPT-4",
    org: "OpenAI",
    highlight: "多模态 + 长上下文",
    paper: "GPT-4 Technical Report",
    desc: "图文混合输入、32K 上下文、推理能力又上一个台阶。技术细节全部封闭，工业界标杆。",
    impact: 3,
  },
  {
    year: 2023,
    name: "DPO",
    org: "Stanford",
    highlight: "丢掉 PPO 直接对齐",
    paper: "Direct Preference Optimization",
    desc: "把偏好优化变成一个简单的分类损失，不用 reward model 也不用 RL，复杂度大幅下降。",
    impact: 2,
  },
  {
    year: 2023,
    name: "Flash Attention 2",
    org: "Princeton",
    highlight: "重写 Attention kernel",
    paper: "FlashAttention-2",
    desc: "通过分块 + 重计算把 Attention 显存压到线性，速度也提了一倍多。长上下文能跑起来全靠它。",
    impact: 2,
  },
  {
    year: 2024,
    name: "LLaMA-3",
    org: "Meta",
    highlight: "8B/70B/405B",
    paper: "The LLaMA 3 Herd of Models",
    desc: "数据扩到 15T token，405B 旗舰版接近 GPT-4。开源生态从这里完成代际更替。",
    impact: 2,
  },
  {
    year: 2024,
    name: "Qwen-2.5",
    org: "Alibaba",
    highlight: "中文最强开源",
    paper: "Qwen2.5 Technical Report",
    desc: "0.5B 到 72B 全尺寸，预训练 18T token。中文场景上稳定超过同尺寸 LLaMA。",
    impact: 2,
  },
  {
    year: 2024,
    name: "DeepSeek-V3",
    org: "DeepSeek",
    highlight: "671B MoE，训练 6M 美元",
    paper: "DeepSeek-V3 Technical Report",
    desc: "用 MLA + 细粒度 MoE 把训练成本压到主流模型的零头，开源权重直接对标 GPT-4o。",
    impact: 3,
  },
  {
    year: 2024,
    name: "o1",
    org: "OpenAI",
    highlight: "推理时 Scaling",
    paper: "Learning to Reason with LLMs",
    desc: "把算力从训练阶段挪到推理阶段，模型先长链思考再回答。数学和代码任务大幅领先。",
    impact: 3,
  },
  {
    year: 2025,
    name: "DeepSeek-R1",
    org: "DeepSeek",
    highlight: "纯 RL 出推理能力",
    paper: "DeepSeek-R1",
    desc: "不靠 SFT 直接 RL，模型自发学会反思、回溯、验证。把 o1 路线开源化。",
    impact: 3,
  },
];

export function LLMTimelineInteractive() {
  const [selected, setSelected] = useState<number>(0);
  const node = NODES[selected];

  const minYear = NODES[0].year;
  const maxYear = NODES[NODES.length - 1].year;
  const yearSpan = maxYear - minYear;

  return (
    <VisualFrame title="LLM 演进时间轴（点击节点查看详情）">
      <div className="space-y-6">
        <div className="relative pt-8 pb-12">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="relative h-20">
            {NODES.map((n, i) => {
              const left = ((n.year - minYear) / yearSpan) * 100;
              const r = n.impact === 3 ? 7 : n.impact === 2 ? 5 : 4;
              const above = i % 2 === 0;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="absolute -translate-x-1/2 group"
                  style={{ left: `${left}%`, top: above ? "auto" : "50%", bottom: above ? "50%" : "auto" }}
                  aria-label={n.name}
                >
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 w-px bg-neutral-300 dark:bg-neutral-700",
                      above ? "bottom-0" : "top-0"
                    )}
                    style={{ height: above ? "16px" : "16px" }}
                  />
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono",
                      above ? "bottom-5" : "top-5",
                      selected === i ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {n.name}
                  </div>
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all",
                      selected === i
                        ? "bg-violet-500 border-violet-500 dark:bg-violet-400 dark:border-violet-400"
                        : "bg-white dark:bg-neutral-900 border-neutral-400 dark:border-neutral-600 group-hover:border-violet-400"
                    )}
                    style={{ width: r * 2, height: r * 2, top: above ? "100%" : "0%" }}
                  />
                </button>
              );
            })}
            {[2017, 2019, 2021, 2023, 2025].map((y) => {
              const left = ((y - minYear) / yearSpan) * 100;
              return (
                <div
                  key={y}
                  className="absolute -translate-x-1/2 text-xs font-mono text-muted-foreground"
                  style={{ left: `${left}%`, top: "calc(50% + 28px)" }}
                >
                  {y}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900/40">
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">{node.year}</span>
            <span className="font-semibold text-base text-foreground">{node.name}</span>
            <span className="text-xs text-muted-foreground">{node.org}</span>
          </div>
          <div className="text-xs text-violet-600 dark:text-violet-400 font-mono mb-2">
            {node.highlight}
          </div>
          <div className="text-sm text-secondary-foreground leading-relaxed mb-2">
            {node.desc}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            论文：{node.paper}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground justify-center flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-600" /> 一般
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-neutral-400 dark:border-neutral-600" /> 重要
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded-full border border-neutral-400 dark:border-neutral-600" /> 里程碑
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}

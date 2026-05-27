"use client";

import { cn } from "@/lib/utils";
import React from "react";

const themes = {
  data: {
    bg: "bg-[#e6f1fb] dark:bg-[#1a2a3a]",
    border: "border-[#b5d4f4] dark:border-[#2d4a6a]",
    cardBg: "bg-white dark:bg-[#1f2f3f]",
    cardBorder: "border-[#b5d4f4] dark:border-[#2d4a6a]",
    title: "text-[#042c53] dark:text-[#a8cef0]",
    name: "text-[#0c447c] dark:text-[#7fb8e8]",
    desc: "text-[#185fa5] dark:text-[#6aa3d6]",
    chip: "bg-[#b5d4f4] text-[#0c447c] dark:bg-[#2d4a6a] dark:text-[#a8cef0]",
  },
  arch: {
    bg: "bg-[#eeedfe] dark:bg-[#1e1d3a]",
    border: "border-[#afa9ec] dark:border-[#4a4580]",
    cardBg: "bg-white dark:bg-[#252440]",
    cardBorder: "border-[#afa9ec] dark:border-[#4a4580]",
    title: "text-[#26215c] dark:text-[#c4c0f0]",
    name: "text-[#3c3489] dark:text-[#a8a2e0]",
    desc: "text-[#534ab7] dark:text-[#9590d0]",
    chip: "bg-[#afa9ec] text-[#26215c] dark:bg-[#4a4580] dark:text-[#c4c0f0]",
  },
  pretrain: {
    bg: "bg-[#e1f5ee] dark:bg-[#162e26]",
    border: "border-[#9fe1cb] dark:border-[#2a5e4a]",
    cardBg: "bg-white dark:bg-[#1b3830]",
    cardBorder: "border-[#9fe1cb] dark:border-[#2a5e4a]",
    title: "text-[#04342c] dark:text-[#8ed8b8]",
    name: "text-[#085041] dark:text-[#6dc4a0]",
    desc: "text-[#0f6e56] dark:text-[#5ab890]",
    chip: "bg-[#9fe1cb] text-[#085041] dark:bg-[#2a5e4a] dark:text-[#8ed8b8]",
  },
  align: {
    bg: "bg-[#faece7] dark:bg-[#2e1c15]",
    border: "border-[#f5c4b3] dark:border-[#6a3d2d]",
    cardBg: "bg-white dark:bg-[#38241c]",
    cardBorder: "border-[#f5c4b3] dark:border-[#6a3d2d]",
    title: "text-[#4a1b0c] dark:text-[#f0b8a0]",
    name: "text-[#993c1d] dark:text-[#e09070]",
    desc: "text-[#d85a30] dark:text-[#d07850]",
    chip: "bg-[#f5c4b3] text-[#993c1d] dark:bg-[#6a3d2d] dark:text-[#f0b8a0]",
  },
  infer: {
    bg: "bg-[#fbeaf0] dark:bg-[#2e1520]",
    border: "border-[#f4c0d1] dark:border-[#6a3048]",
    cardBg: "bg-white dark:bg-[#381c28]",
    cardBorder: "border-[#f4c0d1] dark:border-[#6a3048]",
    title: "text-[#4b1528] dark:text-[#f0b0c8]",
    name: "text-[#72243e] dark:text-[#d890a8]",
    desc: "text-[#993556] dark:text-[#c87898]",
    chip: "bg-[#f4c0d1] text-[#72243e] dark:bg-[#6a3048] dark:text-[#f0b0c8]",
  },
  cap: {
    bg: "bg-[#faeeda] dark:bg-[#2e2410]",
    border: "border-[#fac775] dark:border-[#6a5020]",
    cardBg: "bg-white dark:bg-[#382c18]",
    cardBorder: "border-[#fac775] dark:border-[#6a5020]",
    title: "text-[#412402] dark:text-[#f0d090]",
    name: "text-[#633806] dark:text-[#d8a840]",
    desc: "text-[#854f0b] dark:text-[#c89830]",
    chip: "bg-[#fac775] text-[#633806] dark:bg-[#6a5020] dark:text-[#f0d090]",
  },
  eval: {
    bg: "bg-[#eaf3de] dark:bg-[#1a2c10]",
    border: "border-[#c0dd97] dark:border-[#3a5a20]",
    cardBg: "bg-white dark:bg-[#223418]",
    cardBorder: "border-[#c0dd97] dark:border-[#3a5a20]",
    title: "text-[#173404] dark:text-[#a8d880]",
    name: "text-[#27500a] dark:text-[#88c060]",
    desc: "text-[#3b6d11] dark:text-[#78b050]",
    chip: "bg-[#c0dd97] text-[#27500a] dark:bg-[#3a5a20] dark:text-[#a8d880]",
  },
  app: {
    bg: "bg-[#f1efe8] dark:bg-[#1e1d18]",
    border: "border-[#d3d1c7] dark:border-[#4a4840]",
    cardBg: "bg-white dark:bg-[#282720]",
    cardBorder: "border-[#d3d1c7] dark:border-[#4a4840]",
    title: "text-[#2c2c2a] dark:text-[#d0cec8]",
    name: "text-[#2c2c2a] dark:text-[#b8b6b0]",
    desc: "text-[#5f5e5a] dark:text-[#9a9890]",
    chip: "bg-[#d3d1c7] text-[#444441] dark:bg-[#4a4840] dark:text-[#d0cec8]",
  },
};

type ThemeKey = keyof typeof themes;

function Layer({ title, theme, children }: { title: string; theme: ThemeKey; children: React.ReactNode }) {
  const t = themes[theme];
  return (
    <div className={cn("rounded-xl p-4 border-[1.5px]", t.bg, t.border)}>
      <div className={cn("text-sm font-semibold mb-3", t.title)}>{title}</div>
      {children}
    </div>
  );
}

function Card({ name, theme, wide, children }: { name: string; theme: ThemeKey; wide?: boolean; children: React.ReactNode }) {
  const t = themes[theme];
  return (
    <div className={cn("rounded-lg p-2.5 border", t.cardBg, t.cardBorder, wide ? "min-w-[200px] flex-[2]" : "min-w-[118px] flex-1")}>
      <div className={cn("text-xs font-semibold mb-1", t.name)}>{name}</div>
      <div className={cn("text-xs leading-[1.8]", t.desc)}>{children}</div>
    </div>
  );
}

function Connector({ label, theme }: { label: string; theme: ThemeKey }) {
  const t = themes[theme];
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-[1.5px] h-3 bg-neutral-300 dark:bg-neutral-600" />
        <span className={cn("text-xs font-semibold px-3 py-0.5 rounded-full", t.chip)}>{label}</span>
        <div className="w-[1.5px] h-3 bg-neutral-300 dark:bg-neutral-600" />
      </div>
    </div>
  );
}

function F({ children }: { children: React.ReactNode }) {
  return <span className="text-[#7F77DD] dark:text-[#a8a2e8] italic">{children}</span>;
}

function RankPanel({ title, theme, children }: { title: string; theme: ThemeKey; children: React.ReactNode }) {
  const t = themes[theme];
  return (
    <div className={cn("flex-1 rounded-lg p-3 border", t.cardBg, t.cardBorder)}>
      <div className={cn("text-xs font-semibold mb-1.5", t.name)}>{title}</div>
      <div className={cn("text-xs leading-[1.8]", t.desc)}>{children}</div>
    </div>
  );
}

export function LLMSystemLandscape({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col text-sm", className)}>
      {/* ① 数据层 */}
      <Layer title="① 数据层" theme="data">
        <div className="flex gap-2 flex-wrap">
          <Card name="预训练语料" theme="data">网页：Common Crawl / C4<br/>书籍：Books3<br/>代码：GitHub / Stack<br/>百科：Wikipedia</Card>
          <Card name="数据处理" theme="data">语言识别 / 去重（MinHash）<br/>质量过滤（困惑度）<br/>有毒内容过滤<br/><F>合成数据生成</F></Card>
          <Card name="指令/对齐数据" theme="data">人工标注指令数据<br/>Self-Instruct 蒸馏<br/>RLHF 偏好对<br/><F>Constitutional AI</F></Card>
          <Card name="多模态数据" theme="data">图文对：LAION / CC<br/>视频：HowTo100M<br/>音频：LibriSpeech<br/><F>交错图文</F></Card>
        </div>
      </Layer>

      <Connector label="万亿 Token 语料" theme="arch" />

      {/* ② 架构层 */}
      <Layer title="② 模型架构层" theme="arch">
        <div className="flex gap-2 flex-wrap">
          <Card name="Transformer 核心" theme="arch" wide>
            <b>Attention：</b>MHA → GQA / <F>MLA</F><br/>
            <b>FFN：</b>Dense → SwiGLU / <F>MoE</F><br/>
            <b>Norm：</b>LayerNorm → RMSNorm<br/>
            <b>位置：</b>绝对 → RoPE → <F>YaRN</F>
          </Card>
          <Card name="主流范式" theme="arch">Decoder-only：GPT/LLaMA<br/>Enc-Dec：T5/GLM<br/>Encoder：BERT</Card>
          <Card name="MoE 架构" theme="arch">Top-K 路由<br/>Expert 并行<br/><F>DeepSeekMoE</F><br/><F>共享+路由 Expert</F></Card>
        </div>
      </Layer>

      <Connector label="随机初始化参数" theme="pretrain" />

      {/* ③ 预训练层 */}
      <Layer title="③ 预训练层" theme="pretrain">
        <div className="flex gap-2 flex-wrap">
          <Card name="训练目标" theme="pretrain">CLM（因果语言模型）<br/>MLM / PrefixLM<br/><F>Diffusion LM</F></Card>
          <Card name="分布式训练" theme="pretrain">数据并行 DP/DDP<br/>张量并行 TP<br/>流水线并行 PP<br/>ZeRO-1/2/3</Card>
          <Card name="训练优化" theme="pretrain">Flash Attention<br/>混合精度 BF16<br/>梯度裁剪 / Warmup<br/><F>FP8 训练</F></Card>
          <Card name="Scaling Laws" theme="pretrain">Chinchilla 最优配比<br/>N ∝ D（参数 ∝ 数据）<br/><F>推理时 Scaling</F></Card>
        </div>
      </Layer>

      <Connector label="Base Model" theme="align" />

      {/* ④ 对齐层 */}
      <Layer title="④ 后训练 · 对齐层" theme="align">
        <div className="flex gap-2 flex-wrap">
          <RankPanel title="SFT（监督微调）" theme="align">
            指令跟随微调<br/>Chat Template<br/>全参 / LoRA / QLoRA<br/><F>合成数据蒸馏</F>
          </RankPanel>
          <div className="flex items-center text-neutral-300 dark:text-neutral-600 px-0.5">→</div>
          <RankPanel title="偏好优化" theme="align">
            DPO / IPO / SimPO<br/>PPO（在线 RL）<br/>GRPO<br/><F>RLVR 可验证奖励</F>
          </RankPanel>
          <div className="flex items-center text-neutral-300 dark:text-neutral-600 px-0.5">→</div>
          <RankPanel title="安全对齐" theme="align">
            Constitutional AI<br/>Red Teaming<br/>Jailbreak 防御<br/><F>对抗对齐</F>
          </RankPanel>
        </div>
      </Layer>

      <Connector label="Chat / Instruct Model" theme="infer" />

      {/* ⑤ 推理部署层 */}
      <Layer title="⑤ 推理 · 部署层" theme="infer">
        <div className="flex gap-2 flex-wrap">
          <Card name="推理加速" theme="infer">KV Cache / PagedAttention<br/>Continuous Batching<br/>Flash Decoding<br/><F>Speculative Decoding</F></Card>
          <Card name="量化压缩" theme="infer">GPTQ / AWQ (W4)<br/>SmoothQuant (W8A8)<br/>FP8 推理<br/><F>1-bit BitNet</F></Card>
          <Card name="服务框架" theme="infer">vLLM / TGI<br/>TensorRT-LLM<br/>SGLang / Ollama<br/><F>Prefill-Decode 分离</F></Card>
          <Card name="长文本" theme="infer">滑动窗口 / Ring Attention<br/>YaRN / LongRoPE<br/><F>无限上下文 MemGPT</F></Card>
        </div>
      </Layer>

      <Connector label="部署就绪模型" theme="cap" />

      {/* ⑥ 能力扩展层 */}
      <Layer title="⑥ 能力扩展层" theme="cap">
        <div className="flex gap-2 flex-wrap">
          <Card name="推理能力" theme="cap">CoT / ToT<br/>Self-Consistency<br/><F>o1 慢思考</F><br/><F>MCTS 搜索</F></Card>
          <Card name="多模态" theme="cap">CLIP / ViT 视觉编码<br/>LLaVA 视觉-语言<br/><F>视频理解</F><br/><F>统一 Token</F></Card>
          <Card name="工具调用" theme="cap">Function Calling<br/>Code Interpreter<br/>Web Search<br/><F>MCP 协议</F></Card>
          <Card name="Agent" theme="cap">ReAct / Reflexion<br/>多 Agent 协作<br/><F>Computer Use</F><br/><F>Long-horizon Plan</F></Card>
        </div>
      </Layer>

      <Connector label="线上服务" theme="eval" />

      {/* ⑦ 评估体系 */}
      <Layer title="⑦ 评估体系" theme="eval">
        <div className="flex gap-2 flex-wrap">
          <Card name="知识/推理" theme="eval">MMLU / HellaSwag<br/>GSM8K / MATH<br/>BBH</Card>
          <Card name="代码" theme="eval">HumanEval / MBPP<br/>SWE-bench<br/><F>LiveCodeBench</F></Card>
          <Card name="对话" theme="eval">MT-Bench / AlpacaEval<br/>Chatbot Arena ELO<br/>IFEval</Card>
          <Card name="安全" theme="eval">TruthfulQA<br/>HarmBench<br/><F>多文化偏见</F></Card>
        </div>
      </Layer>

      <Connector label="用户反馈闭环" theme="app" />

      {/* ⑧ 应用层 */}
      <Layer title="⑧ 应用层" theme="app">
        <div className="flex gap-2 flex-wrap">
          <Card name="RAG" theme="app">Naive / Advanced<br/>Graph RAG<br/><F>Agentic RAG</F></Card>
          <Card name="Agent 框架" theme="app">LangChain / AutoGen<br/>OpenHands<br/><F>多 Agent 编排</F></Card>
          <Card name="垂直领域" theme="app">代码：Copilot / Cursor<br/>医疗 / 法律 / 金融<br/>科学：AlphaFold</Card>
          <Card name="生成" theme="app">文生图 DALL-E/SD<br/>文生视频 Sora<br/>TTS / 数字人</Card>
        </div>
      </Layer>
    </div>
  );
}

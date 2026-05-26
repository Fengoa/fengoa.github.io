"use client";

import { cn } from "@/lib/utils";

/**
 * 推荐系统 × 大模型：技术重叠全景 + LLM4Rec 五大范式
 * 使用 React + Tailwind 重构，与 RecSystemLandscape 风格统一
 */

/* ─── 配色 ─── */
const layerThemes = {
  purple: {
    bg: "bg-[#eeedfe] dark:bg-[#1e1d3a]",
    head: "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC] dark:bg-[#2a2850] dark:text-[#b0a8f0] dark:border-[#4a4580]",
  },
  teal: {
    bg: "bg-[#e1f5ee] dark:bg-[#162e26]",
    head: "bg-[#E1F5EE] text-[#085041] border-[#5DCAA5] dark:bg-[#162e26] dark:text-[#6dc4a0] dark:border-[#2a5e4a]",
  },
  blue: {
    bg: "bg-[#e6f1fb] dark:bg-[#1a2a3a]",
    head: "bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB] dark:bg-[#1a2a3a] dark:text-[#7fb8e8] dark:border-[#2d4a6a]",
  },
  coral: {
    bg: "bg-[#faece7] dark:bg-[#2e1c15]",
    head: "bg-[#FAECE7] text-[#712B13] border-[#F0997B] dark:bg-[#2d1a14] dark:text-[#f0997b] dark:border-[#6a3d2d]",
  },
} as const;

type LayerTheme = keyof typeof layerThemes;

/* ─── 连接器 ─── */

function Connector({ label, theme }: { label: string; theme: LayerTheme }) {
  const chipColors: Record<LayerTheme, string> = {
    purple: "bg-[#afa9ec] text-[#26215c] dark:bg-[#4a4580] dark:text-[#c4c0f0]",
    teal: "bg-[#9fe1cb] text-[#085041] dark:bg-[#2a5e4a] dark:text-[#8ed8b8]",
    blue: "bg-[#b5d4f4] text-[#0c447c] dark:bg-[#2d4a6a] dark:text-[#a8cef0]",
    coral: "bg-[#f5c4b3] text-[#993c1d] dark:bg-[#6a3d2d] dark:text-[#f0b8a0]",
  };
  return (
    <div className="flex flex-col items-center py-1 gap-1">
      <div className="w-px h-4 bg-border" />
      <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", chipColors[theme])}>
        {label}
      </span>
      <div className="w-px h-4 bg-border" />
    </div>
  );
}

function LayerHead({ children, theme }: { children: React.ReactNode; theme: LayerTheme }) {
  return (
    <div className={cn("text-xs font-medium px-3 py-1.5 rounded-lg border inline-flex items-center gap-2 mb-3", layerThemes[theme].head)}>
      {children}
    </div>
  );
}

function OverlapCard({
  title,
  rec,
  llm,
  bridge = "=",
  highlight,
}: {
  title: string;
  rec: React.ReactNode;
  llm: React.ReactNode;
  bridge?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border p-3 bg-white dark:bg-[#1a1a2e]",
      highlight
        ? "border-[#AFA9EC] dark:border-[#4a4580]"
        : "border-border/60"
    )}>
      <div className="text-sm font-medium mb-2 text-foreground">{title}</div>
      <div className="flex items-stretch gap-0">
        <div className="flex-1 rounded-md p-2 bg-[#e6f1fb] dark:bg-[#1a2a3a] text-xs leading-relaxed">
          <div className="text-xs font-semibold tracking-wide opacity-70 mb-0.5 text-[#0C447C] dark:text-[#7fb8e8]">推荐系统</div>
          <div className="text-[#0C447C] dark:text-[#7fb8e8]">{rec}</div>
        </div>
        <div className="flex items-center justify-center px-2 text-muted-foreground text-sm shrink-0">
          {bridge}
        </div>
        <div className="flex-1 rounded-md p-2 bg-[#eeedfe] dark:bg-[#1e1d3a] text-xs leading-relaxed">
          <div className="text-xs font-semibold tracking-wide opacity-70 mb-0.5 text-[#3C3489] dark:text-[#b0a8f0]">大语言模型</div>
          <div className="text-[#3C3489] dark:text-[#b0a8f0]">{llm}</div>
        </div>
      </div>
    </div>
  );
}

function ParadigmCard({
  levelLabel,
  name,
  tagline,
  mechanism,
  pros,
  cons,
  papers,
  color,
  highlight,
}: {
  level?: string;
  levelLabel: string;
  name: string;
  tagline?: string;
  mechanism: string;
  pros: string[];
  cons: string[];
  papers: string[];
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden bg-white dark:bg-[#1a1a2e]",
      highlight ? "border-[#AFA9EC] dark:border-[#4a4580]" : "border-border/60"
    )}>
      {/* 头部：色条 + 层级 + 名称 */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-accent/80 text-muted-foreground shrink-0">{levelLabel}</span>
        <span className="text-sm font-medium text-foreground">{name}</span>
        {tagline && <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">{tagline}</span>}
      </div>
      {/* 正文 */}
      <div className="px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground font-medium">机制：</span>{mechanism}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
          {pros.map((p, i) => <span key={`p${i}`} className="text-[#0F6E56] dark:text-[#6dc4a0]">✓ {p}</span>)}
          {cons.map((c, i) => <span key={`c${i}`} className="text-[#993C1D] dark:text-[#f0997b]">✗ {c}</span>)}
        </div>
        {/* 论文标签 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {papers.map((p, i) => (
            <span key={i} className="inline-block text-xs px-1.5 py-0.5 rounded border border-border/50 bg-accent/40 text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 主组件 ─── */

export function RecLLMBridge() {
  return (
    <div className="flex flex-col text-sm">
      {/* 第一层 */}
      <div className={cn("rounded-xl p-4", layerThemes.purple.bg)}>
        <LayerHead theme="purple">第一层：完全共享 — 同一套技术，两边都在用</LayerHead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <OverlapCard highlight title="Transformer / Attention" rec={<>BST / SASRec / BERT4Rec<br/>DIN Target-Attention</>} llm={<>GPT / LLaMA / Qwen<br/>MHA → GQA → MLA</>} />
          <OverlapCard title="Embedding 向量化" rec={<>Item/User Embedding<br/>Field Value Emb</>} llm={<>Token Embedding<br/>Position Embedding</>} />
          <OverlapCard title="ANN 近似最近邻检索" rec={<>召回层向量检索<br/>Faiss / HNSW / Milvus</>} llm={<>RAG 文档检索<br/>Faiss / HNSW / pgvector</>} />
          <OverlapCard title="知识蒸馏 / 模型压缩" rec={<>轻量粗排蒸馏<br/>Teacher→Student</>} llm={<>Alpaca / Vicuna 蒸馏<br/>QLoRA 压缩部署</>} />
        </div>
      </div>

      <Connector label="技术相同" theme="purple" />

      {/* 第二层 */}
      <div className={cn("rounded-xl p-4", layerThemes.teal.bg)}>
        <LayerHead theme="teal">第二层：范式共享 — 同一思路，不同实例化</LayerHead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <OverlapCard title="序列建模（核心交叉）" bridge="≈" rec={<>GRU4Rec / SASRec<br/>BERT4Rec（行为序列）</>} llm={<>GPT（Token序列）<br/>BERT（双向语言模型）</>} />
          <OverlapCard title="混合专家 MoE" bridge="≈" rec={<>MMoE / PLE<br/>多目标 Gate 路由</>} llm={<>Mixtral / DeepSeekMoE<br/>Token级稀疏路由</>} />
          <OverlapCard title="自监督预训练" bridge="≈" rec={<>行为掩码预测<br/>对比学习增强</>} llm={<>MLM / CLM 预训练<br/>万亿 Token 语料</>} />
          <OverlapCard title="对比学习 / 双塔" bridge="≈" rec={<>DSSM 双塔召回<br/>In-batch Negative</>} llm={<>SimCSE / E5<br/>文本向量表示学习</>} />
        </div>
      </div>

      <Connector label="范式相似" theme="teal" />

      {/* 第三层 */}
      <div className={cn("rounded-xl p-4", layerThemes.blue.bg)}>
        <LayerHead theme="blue">第三层：目标共享 — 优化同类问题</LayerHead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <OverlapCard title="偏好预测（结构几乎相同）" bridge="≈" rec={<>CTR 预估模型<br/>点击=偏好信号</>} llm={<>RLHF Reward Model<br/>人类偏好打分</>} />
          <OverlapCard title="Scaling Laws" bridge="?" rec={<>参数 × 数据最优配比<br/>竞赛 $45K 奖项方向</>} llm={<>Kaplan / Chinchilla<br/>计算最优 N∝D</>} />
          <OverlapCard title="多任务学习" bridge="≈" rec={<>CTR + CVR + GMV<br/>共享底层特征塔</>} llm={<>指令微调多任务<br/>FLAN / T0</>} />
          <OverlapCard title="因果推断 / 去偏" bridge="≈" rec={<>曝光偏差 IPW / DR<br/>位置偏差修正</>} llm={<>对齐偏差去除<br/>奖励模型偏差修正</>} />
        </div>
      </div>

      <Connector label="目标一致" theme="blue" />

      {/* 第四层 */}
      <div className={cn("rounded-xl p-4", layerThemes.coral.bg)}>
        <LayerHead theme="coral">第四层：LLM → 推荐 直接融合（最前沿，单向流动）</LayerHead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <OverlapCard title="LLM 直接做推荐" bridge="→" rec={<>P5 / LLMRec / TALLRec<br/>LLM4Rec 精排器</>} llm={<>文本推理 + 世界知识<br/>Zero-shot 泛化</>} />
          <OverlapCard title="冷启动 × 语义理解" bridge="→" rec={<>新用户/新物品冷启<br/>无行为数据困境</>} llm={<>语义 Emb 补全特征<br/>文本描述理解物品</>} />
          <OverlapCard title="RAG ↔ 召回 + 排序" bridge="≈" rec={<>召回（retrieve）<br/>精排（rank）两阶段</>} llm={<>RAG：检索 + 生成<br/>Re-ranker 重排</>} />
          <OverlapCard title="合成数据生成" bridge="→" rec={<>数据增强 / 负样本<br/>用户行为模拟</>} llm={<>生成偏好数据<br/>用户 Profile 描述</>} />
        </div>
      </div>

      <Connector label="展开第四层" theme="coral" />

      {/* 五大范式整体包裹 */}
      <div className={cn("rounded-xl p-4", layerThemes.coral.bg)}>
        <div className="text-xs font-medium text-[#712B13] dark:text-[#f0997b] mb-3">第四层展开：LLM 做推荐的五大范式（浅→深）</div>

        {/* 核心矛盾条 */}
        <div className="flex items-stretch rounded-lg border border-border/60 overflow-hidden mb-3">
          <div className="flex-1 px-3 py-2 bg-[#e6f1fb] dark:bg-[#1a2a3a] text-xs font-medium text-[#0C447C] dark:text-[#7fb8e8]">
            传统推荐<br/><span className="font-normal opacity-80">协同过滤 ID · 点击行为 · CF信号</span>
          </div>
          <div className="flex items-center px-3 text-xs text-muted-foreground border-x border-border/40 whitespace-nowrap">← ID vs Text →</div>
          <div className="flex-1 px-3 py-2 bg-[#eeedfe] dark:bg-[#1e1d3a] text-xs font-medium text-[#3C3489] dark:text-[#b0a8f0] text-right">
            大语言模型<br/><span className="font-normal opacity-80">文本语义 · 世界知识 · 推理能力</span>
          </div>
        </div>

        {/* 五大范式卡片 */}
        <div className="flex flex-col gap-2">
          <ParadigmCard level="①" levelLabel="浅层 ①" name="LLM 作为零样本排序器" tagline="无微调，直接提示" color="#B4B2A9"
            mechanism="把用户历史行为转成自然语言 prompt，让 LLM 直接输出推荐结果。无需推荐数据微调。"
            pros={["零样本泛化，冷启动友好", "利用世界知识"]}
            cons={["完全忽略协同过滤信号", "延迟极高，无法在线服务"]}
            papers={["ChatRec 2023", "LLMRank 2023", "GPT4Rec 2023"]}
          />
          <ParadigmCard level="②" levelLabel="浅层 ②" name="LLM 作为语义特征编码器" tagline="冻结 LLM，提取 Embedding" color="#85B7EB"
            mechanism="用冻结的 LLM 把物品标题/描述编码成语义向量，替代或增强传统 ID Embedding。"
            pros={["语义 Emb 解决冷启动", "LLM 只做离线推断，延迟可控"]}
            cons={["冻结 LLM 无法学习推荐偏好", "语义相似 ≠ 用户偏好相似"]}
            papers={["UniSRec 2022", "MoRec 2023", "RLMRec 2024"]}
          />
          <ParadigmCard level="③" levelLabel="中层 ③" name="统一文本生成框架 (P5)" tagline="微调 LLM，推荐任务→文本生成" color="#5DCAA5"
            mechanism="把评分预测、序列推荐、解释生成等全部转成 Seq2Seq 任务，用推荐数据微调 T5/LLaMA。"
            pros={["统一框架，多任务联合", "可生成推荐理由"]}
            cons={["物品 ID 对 LLM 无语义意义", "生成速度慢，难工业落地"]}
            papers={["P5 2022", "TALLRec 2023", "LLaRA 2023"]}
          />
          <ParadigmCard level="④" levelLabel="深层 ④ — 分水岭" name={'语义 ID：让 LLM 真正"认识"物品'} color="#AFA9EC" highlight
            mechanism="用 RQ-VAE 把物品编码成离散语义 token（如 [42, 7, 156]），既有语义含义又捕获协同信号，直接进 LLM 词表。"
            pros={["同时捕获语义 + 协同过滤信号", "LLM 可生成新物品 token（泛化）", "与 LLM 预训练框架完全兼容"]}
            cons={["量化训练复杂，token 数量爆炸", "推理延迟仍是瓶颈"]}
            papers={["TIGER 2023", "VQ-Rec 2023", "LCRec 2023", "LETTER 2024"]}
          />
          <ParadigmCard level="⑤" levelLabel="前沿 ⑤" name="端到端统一 Backbone" tagline="序列行为 + 多字段特征 → 同一架构" color="#EF9F27" highlight
            mechanism="统一 token 化方案，行为序列、类别特征、目标物品进入同一个同构可堆叠 Backbone，一次前向传播完成所有交互。"
            pros={["消除粗排/精排结构割裂", "遵循 Scaling Law，可系统扩展"]}
            cons={["工业落地延迟挑战极大", "尚无成熟范式"]}
            papers={["HSTU Meta 2024", "FEARec", "UniBlock竞赛"]}
          />
        </div>
      </div>
    </div>
  );
}

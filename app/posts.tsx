import type { PostData } from "@/components/blog/post-card";
import { CraftCover } from "@/app/blog/craft-oriensx/cover";
import { AstralResourcesCover } from "@/app/blog/polar-starry-resources/cover";
import { RecommenderCover } from "@/app/blog/minimal-recommender/cover";
import { VectorRecallCover } from "@/app/blog/vector-recall/cover";
import { DeepFMCover } from "@/app/blog/deepfm-ranking/cover";
import { TwoTowerCover } from "@/app/blog/two-tower-recall/cover";
import { HardNegativeCover } from "@/app/blog/hard-negative-eval/cover";
import { DINSequenceCover } from "@/app/blog/din-sequence/cover";
import { MMoECover } from "@/app/blog/mmoe-multitask/cover";
import { RerankingCover } from "@/app/blog/reranking-diversity/cover";
import { EngineeringCover } from "@/app/blog/engineering-recommender/cover";
import { LandscapeCover } from "@/app/blog/recommender-landscape/cover";
import {
  MinimalLLMCover,
  TokenizerCover,
  AttentionCover,
  TransformerCover,
  TrainingCover,
} from "@/app/blog/minimal-llm/cover";
import {
  ScalingLawCover,
  RoPECover,
  EfficientAttentionCover,
  SFTCover,
  DPOCover,
  InferenceCover,
  DeployCover,
  RAGCover,
  LandscapeLLMCover,
} from "@/app/blog/llm-scaling-law/cover";
import { LinearAlgebraCover } from "@/app/blog/linear-algebra-for-dl/cover";
import { MLConceptsCover } from "@/app/blog/ml-core-concepts/cover";
import { PaperGuideCover } from "@/app/blog/cs-paper-guide/cover";
import { BlogRecommenderCover } from "@/app/blog/blog-recommender/cover";
import { EmbodiedRobotCover } from "@/app/blog/embodied-robot/cover";
import { ObsessionCover } from "@/app/blog/obsession/cover";
import { CodexAgentCover } from "@/app/blog/codex-agent/cover";
import { CodexAgentReactCover } from "@/app/blog/codex-agent-ReAct/cover";
import { MinqinASRCover } from "@/app/blog/minqin-asr/cover";
import { RelationLLMCover } from "@/app/blog/relation-llm/cover";
import { AiNativeOrganizationCover } from "./blog/ai-native-organization/cover";
import { AimlabCover } from "./blog/aimlab/cover";

export const posts: PostData[] = [
  {
    slug: "aimlab",
    title: "从零写一个浏览器里的 3D 瞄准训练器",
    date: "2026-07-24",
    tag: "前端技术",
    summary:
      "面向零基础：用 React Three Fiber 从空项目到可玩训练器。分三个里程碑——天空盒与贴图（含贴图怎么生成）、靶子与命中靶点、第一人称枪械模型。",
    cover: <AimlabCover />,
    coverShape: "square",
  },
  {
    slug: "ai-native-organization",
    title: "为什么组织学习率将成为 AI 时代最重要的竞争变量",
    date: "2026-07-21",
    tag: "大模型",
    summary:
      "AI 降低执行成本后，组织竞争的约束转向学习率。文章定义 OLR，区分局部智能与组织智能，并为 AI Native Organization Stack 建立入口。",
    cover: <AiNativeOrganizationCover />,
    coverShape: "square",
  },
  {
    slug: "relation-llm",
    title: "非结构化关系记忆：口语笔记到可查询图谱",
    date: "2026-07-16",
    tag: "大模型",
    summary:
      "形式化三类记忆形状，详述两遍抽取、实体解析、农历查询时换算、递归邻域与向量召回，以及置信度闸门与关联发现。",
    cover: <RelationLLMCover />,
    coverShape: "circle",
  },
  {
    slug: "minqin-asr",
    title: "民勤话语音识别：Whisper 微调流水线",
    date: "2026-07-03",
    tag: "大模型",
    summary:
      "民勤话口音导致通用 Whisper 识别失败；基于 Whisper-small 微调，将民勤话语音转写为普通话文字，覆盖本地数据整理、Colab 训练、CER 评估与增量微调。",
    cover: <MinqinASRCover />,
    coverShape: "circle",
  },
  {
    slug: "codex-agent-ReAct",
    title: "Codex Agent 设计原理",
    date: "2026-06-12",
    tag: "大模型",
    summary:
      "从第一性原理拆解 Agent 的十个设计决策：ReAct 循环、工具合约、上下文记忆、观测编码、审批信任、视觉接地与任务分解。",
    cover: <CodexAgentReactCover />,
    coverShape: "circle",
  },
  {
    slug: "codex-agent",
    title: "Codex Agent 技术实现原理详解",
    date: "2026-06-12",
    tag: "大模型",
    summary:
      "Agent Loop、工具注册、上下文裁剪——ReAct 循环的工作方式，流式输出和安全审批的接入方式，附浏览器自动化与 OpenCLI 编排示例。",
    cover: <CodexAgentCover />,
    coverShape: "square",
  },
  {
    slug: "obsession",
    title: "脑锁：如何摆脱强迫症",
    date: "2026-06-11",
    tag: "人文",
    summary: "大脑用你自己的语言威胁你自己。整理自《脑锁》：两扇门之外还有第三道门，四步骤把「我」和「它」分开。",
    cover: <ObsessionCover />,
    coverShape: "circle",
  },
  {
    slug: "embodied-robot",
    title: "具身机器人全景研究报告",
    date: "2026-06-03",
    tag: "资源",
    summary:
      "产业链、市场情况、技术架构全景分析。从感知决策执行到应用场景，覆盖人形机器人、四足机器人、自动驾驶载具三大方向。",
    cover: <EmbodiedRobotCover />,
    coverShape: "circle",
  },
  {
    slug: "ml-core-concepts",
    title: "机器学习的 7 个核心概念",
    date: "2026-05-09",
    tag: "机器学习",
    summary: "不讲证明，只讲直觉。Loss、梯度下降、反向传播、神经网络、Embedding、过拟合——每个概念一句话说清楚，对应到代码的哪一行。",
    cover: <MLConceptsCover />,
    coverShape: "square",
  },
  {
    slug: "linear-algebra-for-dl",
    title: "线性代数：深度学习用到的那些",
    date: "2026-05-06",
    tag: "机器学习",
    summary:
      "不讲证明，只讲直觉。向量、点积、矩阵乘法、SVD、旋转矩阵——每个概念都对应到 Attention、LoRA、RoPE、矩阵分解召回的具体场景。",
    cover: <LinearAlgebraCover />,
  },
  {
    slug: "rec-llm-bridge",
    title: "推荐系统 × 大模型：四层重叠与五大范式",
    date: "2026-05-28",
    tag: "推荐系统",
    summary:
      "推荐系统与大模型深度交织。从完全共享到直接融合，四层递进关系全景。核心矛盾只有一个：ID vs Text。",
    cover: <LandscapeCover />,
  },
  {
    slug: "llm-landscape",
    title: "大模型全景图",
    date: "2026-04-29",
    tag: "大模型",
    summary: "从数据层到应用层，大模型完整技术栈全貌。对照工业界看做了什么、差什么、前沿在哪。",
    cover: <LandscapeLLMCover />,
    coverShape: "square",
  },
  {
    slug: "llm-rag",
    title: "RAG：给模型外接知识",
    date: "2026-04-26",
    tag: "大模型",
    summary: "检索增强生成：先搜相关文档拼进 prompt，再让模型回答。解决知识截止和私有数据问题。",
    cover: <RAGCover />,
    coverShape: "square",
  },
  {
    slug: "llm-deploy",
    title: "部署上线",
    date: "2026-04-27",
    tag: "大模型",
    summary: "用 vLLM 把模型包成 OpenAI 兼容 API：Docker 部署、Streaming、负载监控、成本估算。",
    cover: <DeployCover />,
    coverShape: "square",
  },
  {
    slug: "llm-inference",
    title: "推理优化：提升模型推理速度",
    date: "2026-04-16",
    tag: "大模型",
    summary: "量化（FP16→INT4）、Speculative Decoding、Continuous Batching。组合起来推理速度提升 10-50 倍。",
    cover: <InferenceCover />,
  },
  {
    slug: "llm-dpo",
    title: "DPO：让模型对齐人类偏好",
    date: "2026-04-15",
    tag: "大模型",
    summary: "把 RLHF 的 4 模型+PPO 简化为 2 模型+分类 loss。从偏好数据直接学「什么回答更好」。",
    cover: <DPOCover />,
    coverShape: "square",
  },
  {
    slug: "llm-sft",
    title: "SFT：教模型听话",
    date: "2026-04-14",
    tag: "大模型",
    summary: "用指令-回复对微调，让模型从「续写」转为「回答」。LoRA 仅微调 1% 参数，效果接近全参数微调。",
    cover: <SFTCover />,
    coverShape: "square",
  },
  {
    slug: "llm-efficient-attention",
    title: "高效注意力：GQA + KV Cache",
    date: "2026-04-11",
    tag: "大模型",
    summary: "KV Cache 不重复算历史 token（10x 加速），GQA 多 Q 共享 KV（显存降 2-8x），Flash Attention IO 优化（2-4x）。",
    cover: <EfficientAttentionCover />,
    coverShape: "square",
  },
  {
    slug: "llm-rope",
    title: "位置编码：RoPE",
    date: "2026-03-21",
    tag: "大模型",
    summary: "不加位置 embedding，通过旋转 Q/K 向量编码位置。优雅的数学技巧让模型能外推到训练时没见过的长度。",
    cover: <RoPECover />,
  },
  {
    slug: "llm-scaling-law",
    title: "Scaling Law：更大一定更好吗",
    date: "2026-03-20",
    tag: "大模型",
    summary: "参数量、数据量、算力三者的幂律关系。用实验验证 Chinchilla 结论：同样算力下，中等模型+足够数据 > 大模型+少数据。",
    cover: <ScalingLawCover />,
  },
  {
    slug: "llm-training",
    title: "训练：让模型学会说话",
    date: "2026-03-15",
    tag: "大模型",
    summary:
      "用 4M 参数模型正式训练一次：cosine LR、gradient clipping、过拟合诊断。观察模型从乱码到莎士比亚的全过程。",
    cover: <TrainingCover />,
  },
  {
    slug: "llm-transformer",
    title: "搭一个完整的 Transformer",
    date: "2026-03-14",
    tag: "大模型",
    summary:
      "消融实验逐一移除 LayerNorm、残差连接、FFN、位置编码，用数据证明每个组件为什么不可或缺。",
    cover: <TransformerCover />,
  },
  {
    slug: "llm-attention",
    title: "Attention 到底在做什么",
    date: "2026-03-09",
    tag: "大模型",
    summary:
      "从查字典的角度拆解 Q/K/V，逐步演示注意力计算，可视化训练后的注意力模式——不同 head 自动学会了局部、全局、分散三种关注方式。",
    cover: <AttentionCover />,
  },
  {
    slug: "llm-tokenizer",
    title: "Tokenizer：把文字变成数字",
    date: "2026-03-07",
    tag: "大模型",
    summary:
      "手写 BPE 算法，从 256 字节开始不断合并高频对。vocab_size=4000 时压缩率 3.75x，同样的上下文窗口能看到 4 倍内容。",
    cover: <TokenizerCover />,
  },
  {
    slug: "minimal-llm",
    title: "从零搭建一个语言模型",
    date: "2026-03-01",
    tag: "大模型",
    summary:
      "从只看前 1 个字符的 Bigram，到看 16 个字符的 MLP，到用 Attention 动态决定看哪里的 MiniGPT。三个模型，同一份莎士比亚数据，效果逐级提升。",
    cover: <MinimalLLMCover />,
  },
  {
    slug: "recommender-landscape",
    title: "推荐系统全景图",
    date: "2026-02-22",
    tag: "推荐系统",
    summary:
      "从数据层到评估体系，7 个环节的完整架构。对照工业界标准看我们做了什么、还差什么、前沿在哪。",
    cover: <LandscapeCover />,
  },
  {
    slug: "engineering-recommender",
    title: "把推荐系统工程化",
    date: "2026-02-21",
    tag: "推荐系统",
    summary:
      "Docker 一键启动、PostgreSQL 持久化、Redis 缓存、结构化日志、模型热切换。把可运行的 demo 变成可部署的服务。",
    cover: <EngineeringCover />,
  },
  {
    slug: "reranking-diversity",
    title: "重排：让推荐列表不再千篇一律",
    date: "2026-02-18",
    tag: "推荐系统",
    summary:
      "精排逐条打分看不见列表整体。重排站在列表层面做多样性：MMR 兼顾分数和差异，类型打散避免连续同类型，Coverage 提升 25%。",
    cover: <RerankingCover />,
  },
  {
    slug: "mmoe-multitask",
    title: "多目标排序：一个模型同时优化多件事",
    date: "2026-02-17",
    tag: "推荐系统",
    summary:
      "用 MMoE 同时预测用户会不会看、会不会及格、会不会高分。训练一次，调权重就能适配不同业务策略。",
    cover: <MMoECover />,
  },
  {
    slug: "din-sequence",
    title: "用 DIN 建模用户兴趣序列",
    date: "2026-02-14",
    tag: "推荐系统",
    summary:
      "把用户最近看过的电影序列喂进模型，用 attention 动态提取和候选相关的兴趣。同一个用户看完科幻和看完动画之后拿到的推荐完全不同。",
    cover: <DINSequenceCover />,
  },
  {
    slug: "hard-negative-eval",
    title: "负样本策略和离线评估",
    date: "2026-02-11",
    tag: "推荐系统",
    summary:
      "建了一套离线评估 pipeline 量化推荐效果，把负样本从纯随机换成热门+同类型混合策略，让模型学更难的判断。",
    cover: <HardNegativeCover />,
  },
  {
    slug: "two-tower-recall",
    title: "用双塔模型做向量召回",
    date: "2026-02-09",
    tag: "推荐系统",
    summary:
      "用两个神经网络分别编码用户和电影，训练时拉近正样本推远负样本，替代 SVD 做更强的向量召回。",
    cover: <TwoTowerCover />,
  },
  {
    slug: "deepfm-ranking",
    title: "用模型替代手写公式做排序",
    date: "2026-02-07",
    tag: "推荐系统",
    summary:
      "用 DeepFM 从 285 万条数据里学出什么用户配什么电影，让排序结果因人而异，替代拍脑袋定权重的手写公式。",
    cover: <DeepFMCover />,
  },
  {
    slug: "vector-recall",
    title: "给推荐系统加上向量召回",
    date: "2026-02-05",
    tag: "推荐系统",
    summary:
      "用矩阵分解把电影压缩成 64 维向量，用 FAISS 做毫秒级检索，让推荐系统能发现「没有共现但语义相似」的电影。",
    cover: <VectorRecallCover />,
  },
  {
    slug: "minimal-recommender",
    title: "从零搭建一个推荐系统",
    date: "2026-02-01",
    tag: "推荐系统",
    summary:
      "用 MovieLens + Python + FastAPI 搭一个最小但结构完整的推荐系统，理解召回、合并、精排的工程本质。",
    cover: <RecommenderCover />,
  },
  {
    slug: "polar-starry-resources",
    title: "极地星空 / 宇宙主题资源清单",
    date: "2026-01-18",
    tag: "资源",
    summary:
      "整理极光、星空延时、星轨、宇宙纪录片与天文摄影相关的素材平台和 YouTube 频道，方便后续做治愈音乐与星空视觉内容。",
    cover: <AstralResourcesCover />,
  },
  {
    slug: "cs-paper-guide",
    title: "计算机学术论文：从哪找、怎么看、哪些值得看",
    date: "2026-01-13",
    tag: "资源",
    summary:
      "arXiv 是什么、顶会有哪些、怎么判断论文质量、三遍阅读法。附我们引用过的关键论文清单。",
    cover: <PaperGuideCover />,
  },
  {
    slug: "blog-recommender",
    title: "纯前端博客推荐系统：TF-IDF + 阅读历史",
    date: "2026-04-21",
    tag: "机器学习",
    summary:
      "构建时计算 TF-IDF 余弦相似度矩阵，运行时读 localStorage 做个性化。零后端、零依赖、31 篇文章 100ms 搞定。",
    cover: <BlogRecommenderCover />,
    coverShape: "square",
  },
  {
    slug: "craft-oriensx",
    title: "搭建这个网站",
    date: "2026-01-04",
    tag: "人文",
    summary:
      "搭建这个网站的过程是一场关于秩序的实验，我努力追求一种克制的、美丽优雅的呈现。这种美不为悦人，而为自洽。",
    cover: <CraftCover />,
  },
];

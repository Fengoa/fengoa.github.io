/**
 * 博客文章元数据（不含 React Cover 组件，供多处复用）
 * 与 app/posts.tsx 保持同步
 */

export interface PostMeta {
  slug: string;
  title: string;
  tag: string;
  date: string;
}

export const postsMeta: PostMeta[] = [
  { slug: "aeo-goose-practice", title: "答案引擎优化：一套可落地的 AEO 能力清单", tag: "大模型", date: "2026-07-30" },
  { slug: "deepseek-interview", title: "梁文锋访谈：开源、克制与 AGI 路线图", tag: "大模型", date: "2026-07-27" },
  { slug: "aimlab", title: "从零写一个浏览器里的 3D 瞄准训练器", tag: "前端技术", date: "2026-07-24" },
  { slug: "ai-native-organization", title: "为什么组织学习率将成为 AI 时代最重要的竞争变量", tag: "大模型", date: "2026-07-21" },
  { slug: "relation-llm", title: "非结构化关系记忆：口语笔记到可查询图谱", tag: "大模型", date: "2026-07-16" },
  { slug: "minqin-asr", title: "民勤话语音识别：Whisper 微调流水线", tag: "大模型", date: "2026-07-03" },
  { slug: "codex-agent-ReAct", title: "Codex Agent 设计原理", tag: "大模型", date: "2026-06-12" },
  { slug: "codex-agent", title: "Codex Agent 技术实现原理详解", tag: "大模型", date: "2026-06-12" },
  { slug: "obsession", title: "脑锁：如何摆脱强迫症", tag: "人文", date: "2026-06-11" },
  { slug: "embodied-robot", title: "具身机器人全景研究报告", tag: "资源", date: "2026-06-03" },
  { slug: "ml-core-concepts", title: "机器学习的 7 个核心概念", tag: "机器学习", date: "2026-05-09" },
  { slug: "linear-algebra-for-dl", title: "线性代数：深度学习用到的那些", tag: "机器学习", date: "2026-05-06" },
  { slug: "rec-llm-bridge", title: "推荐系统 × 大模型：四层重叠与五大范式", tag: "推荐系统", date: "2026-05-28" },
  { slug: "llm-landscape", title: "大模型全景图", tag: "大模型", date: "2026-04-29" },
  { slug: "llm-rag", title: "RAG：给模型外接知识", tag: "大模型", date: "2026-04-26" },
  { slug: "llm-deploy", title: "部署上线", tag: "大模型", date: "2026-04-27" },
  { slug: "llm-inference", title: "推理优化：让模型跑得更快", tag: "大模型", date: "2026-04-16" },
  { slug: "llm-dpo", title: "DPO：让模型对齐人类偏好", tag: "大模型", date: "2026-04-15" },
  { slug: "llm-sft", title: "SFT：教模型听话", tag: "大模型", date: "2026-04-14" },
  { slug: "llm-efficient-attention", title: "高效注意力：GQA + KV Cache", tag: "大模型", date: "2026-04-11" },
  { slug: "llm-rope", title: "位置编码：RoPE", tag: "大模型", date: "2026-03-21" },
  { slug: "llm-scaling-law", title: "Scaling Law：更大一定更好吗", tag: "大模型", date: "2026-03-20" },
  { slug: "llm-training", title: "训练：让模型学会说话", tag: "大模型", date: "2026-03-15" },
  { slug: "llm-transformer", title: "搭一个完整的 Transformer", tag: "大模型", date: "2026-03-14" },
  { slug: "llm-attention", title: "Attention 到底在做什么", tag: "大模型", date: "2026-03-09" },
  { slug: "llm-tokenizer", title: "Tokenizer：把文字变成数字", tag: "大模型", date: "2026-03-07" },
  { slug: "minimal-llm", title: "从零搭建一个语言模型", tag: "大模型", date: "2026-03-01" },
  { slug: "recommender-landscape", title: "推荐系统全景图", tag: "推荐系统", date: "2026-02-22" },
  { slug: "engineering-recommender", title: "把推荐系统工程化", tag: "推荐系统", date: "2026-02-21" },
  { slug: "reranking-diversity", title: "重排：让推荐列表不再千篇一律", tag: "推荐系统", date: "2026-02-18" },
  { slug: "mmoe-multitask", title: "多目标排序：一个模型同时优化多件事", tag: "推荐系统", date: "2026-02-17" },
  { slug: "din-sequence", title: "用 DIN 建模用户兴趣序列", tag: "推荐系统", date: "2026-02-14" },
  { slug: "hard-negative-eval", title: "负样本策略和离线评估", tag: "推荐系统", date: "2026-02-11" },
  { slug: "two-tower-recall", title: "用双塔模型做向量召回", tag: "推荐系统", date: "2026-02-09" },
  { slug: "deepfm-ranking", title: "用模型替代手写公式做排序", tag: "推荐系统", date: "2026-02-07" },
  { slug: "vector-recall", title: "给推荐系统加上向量召回", tag: "推荐系统", date: "2026-02-05" },
  { slug: "minimal-recommender", title: "从零搭建一个推荐系统", tag: "推荐系统", date: "2026-02-01" },
  { slug: "polar-starry-resources", title: "极地星空 / 宇宙主题资源清单", tag: "资源", date: "2026-01-18" },
  { slug: "cs-paper-guide", title: "计算机学术论文：从哪找、怎么看、哪些值得看", tag: "资源", date: "2026-01-13" },
  { slug: "blog-recommender", title: "纯前端博客推荐系统：TF-IDF + 阅读历史", tag: "机器学习", date: "2026-04-21" },
  { slug: "craft-oriensx", title: "搭建这个网站", tag: "人文", date: "2026-01-04" },
];

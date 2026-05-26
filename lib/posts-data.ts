/**
 * 博客文章元数据（不含 React Cover 组件，供多处复用）
 */

export interface PostMeta {
  slug: string;
  title: string;
  tag: string;
  date: string;
}

export const postsMeta: PostMeta[] = [
  { slug: "ml-core-concepts", title: "机器学习的 7 个核心概念", tag: "机器学习", date: "2026-05-25" },
  { slug: "linear-algebra-for-dl", title: "线性代数：深度学习用到的那些", tag: "数学", date: "2026-05-25" },
  { slug: "rec-llm-bridge", title: "推荐系统 × 大模型：四层重叠与五大范式", tag: "推荐系统", date: "2026-05-25" },
  { slug: "llm-landscape", title: "大模型全景图", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-rag", title: "RAG：给模型外接知识", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-deploy", title: "部署上线", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-inference", title: "推理优化：让模型跑得更快", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-dpo", title: "DPO：让模型对齐人类偏好", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-sft", title: "SFT：教模型听话", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-efficient-attention", title: "高效注意力：GQA + KV Cache", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-rope", title: "位置编码：RoPE", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-scaling-law", title: "Scaling Law：更大一定更好吗", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-training", title: "训练：让模型学会说话", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-transformer", title: "搭一个完整的 Transformer", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-attention", title: "Attention 到底在做什么", tag: "大模型", date: "2026-05-25" },
  { slug: "llm-tokenizer", title: "Tokenizer：把文字变成数字", tag: "大模型", date: "2026-05-25" },
  { slug: "minimal-llm", title: "从零搭一个语言模型", tag: "大模型", date: "2026-05-25" },
  { slug: "recommender-landscape", title: "推荐系统全景图", tag: "推荐系统", date: "2026-05-22" },
  { slug: "engineering-recommender", title: "把推荐系统工程化", tag: "推荐系统", date: "2026-05-22" },
  { slug: "reranking-diversity", title: "重排：让推荐列表不再千篇一律", tag: "推荐系统", date: "2026-05-22" },
  { slug: "mmoe-multitask", title: "多目标排序：一个模型同时优化多件事", tag: "推荐系统", date: "2026-05-21" },
  { slug: "din-sequence", title: "用 DIN 建模用户兴趣序列", tag: "推荐系统", date: "2026-05-21" },
  { slug: "hard-negative-eval", title: "负样本策略和离线评估", tag: "推荐系统", date: "2026-05-21" },
  { slug: "two-tower-recall", title: "用双塔模型做向量召回", tag: "推荐系统", date: "2026-05-21" },
  { slug: "deepfm-ranking", title: "用模型替代手写公式做排序", tag: "推荐系统", date: "2026-05-20" },
  { slug: "vector-recall", title: "给推荐系统加上向量召回", tag: "推荐系统", date: "2026-05-20" },
  { slug: "minimal-recommender", title: "从零搭一个推荐系统", tag: "推荐系统", date: "2026-05-20" },
  { slug: "polar-starry-resources", title: "极地星空 / 宇宙主题资源清单", tag: "资源", date: "2026-05-18" },
  { slug: "cs-paper-guide", title: "计算机学术论文：从哪找、怎么看、哪些值得看", tag: "资源", date: "2026-05-25" },
  { slug: "blog-recommender", title: "纯前端博客推荐系统：TF-IDF + 阅读历史", tag: "建站", date: "2026-05-26" },
  { slug: "craft-oriensx", title: "搭建这个网站", tag: "建站", date: "2026-03-02" },
];

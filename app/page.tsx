"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
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

const ALL_TAG = "全部";
const TAGS = [ALL_TAG, "大模型", "推荐系统", "机器学习", "数学", "资源", "建站"];

const posts: PostData[] = [
  {
    slug: "ml-core-concepts",
    title: "机器学习的 7 个核心概念",
    date: "2026-05-25",
    tag: "机器学习",
    summary: "不讲证明，只讲直觉。Loss、梯度下降、反向传播、神经网络、Embedding、过拟合——每个概念一句话说清楚，对应到代码的哪一行。",
    cover: <MLConceptsCover />,
    coverShape: "square",
  },
  {
    slug: "linear-algebra-for-dl",
    title: "线性代数：深度学习用到的那些",
    date: "2026-05-25",
    tag: "数学",
    summary:
      "不讲证明，只讲直觉。向量、点积、矩阵乘法、SVD、旋转矩阵——每个概念都对应到 Attention、LoRA、RoPE、矩阵分解召回的具体场景。",
    cover: <LinearAlgebraCover />,
  },
  {
    slug: "rec-llm-bridge",
    title: "推荐系统 × 大模型：四层重叠与五大范式",
    date: "2026-05-25",
    tag: "推荐系统",
    summary:
      "两个领域不是平行的，而是深度交织的。从完全共享到直接融合，四层递进关系全景。核心矛盾只有一个：ID vs Text。",
    cover: <LandscapeCover />,
  },
  {
    slug: "llm-landscape",
    title: "大模型全景图",
    date: "2026-05-25",
    tag: "大模型",
    summary: "从数据层到应用层，大模型完整技术栈全貌。对照工业界看做了什么、差什么、前沿在哪。",
    cover: <LandscapeLLMCover />,
    coverShape: "square",
  },
  {
    slug: "llm-rag",
    title: "RAG：给模型外接知识",
    date: "2026-05-25",
    tag: "大模型",
    summary: "检索增强生成：先搜相关文档拼进 prompt，再让模型回答。解决知识截止和私有数据问题。",
    cover: <RAGCover />,
    coverShape: "square",
  },
  {
    slug: "llm-deploy",
    title: "部署上线",
    date: "2026-05-25",
    tag: "大模型",
    summary: "用 vLLM 把模型包成 OpenAI 兼容 API：Docker 部署、Streaming、负载监控、成本估算。",
    cover: <DeployCover />,
    coverShape: "square",
  },
  {
    slug: "llm-inference",
    title: "推理优化：让模型跑得更快",
    date: "2026-05-25",
    tag: "大模型",
    summary: "量化（FP16→INT4）、Speculative Decoding、Continuous Batching。组合起来推理速度提升 10-50 倍。",
    cover: <InferenceCover />,
  },
  {
    slug: "llm-dpo",
    title: "DPO：让模型对齐人类偏好",
    date: "2026-05-25",
    tag: "大模型",
    summary: "把 RLHF 的 4 模型+PPO 简化为 2 模型+分类 loss。从偏好数据直接学「什么回答更好」。",
    cover: <DPOCover />,
    coverShape: "square",
  },
  {
    slug: "llm-sft",
    title: "SFT：教模型听话",
    date: "2026-05-25",
    tag: "大模型",
    summary: "用指令-回复对微调，让模型从「续写」变成「回答」。LoRA 只训 1% 参数，效果接近全参数微调。",
    cover: <SFTCover />,
    coverShape: "square",
  },
  {
    slug: "llm-efficient-attention",
    title: "高效注意力：GQA + KV Cache",
    date: "2026-05-25",
    tag: "大模型",
    summary: "KV Cache 不重复算历史 token（10x 加速），GQA 多 Q 共享 KV（显存降 2-8x），Flash Attention IO 优化（2-4x）。",
    cover: <EfficientAttentionCover />,
    coverShape: "square",
  },
  {
    slug: "llm-rope",
    title: "位置编码：RoPE",
    date: "2026-05-25",
    tag: "大模型",
    summary: "不加位置 embedding，而是旋转 Q/K 向量编码位置。优雅的数学技巧让模型能外推到训练时没见过的长度。",
    cover: <RoPECover />,
  },
  {
    slug: "llm-scaling-law",
    title: "Scaling Law：更大一定更好吗",
    date: "2026-05-25",
    tag: "大模型",
    summary: "参数量、数据量、算力三者的幂律关系。用实验验证 Chinchilla 结论：同样算力下，中等模型+足够数据 > 大模型+少数据。",
    cover: <ScalingLawCover />,
  },
  {
    slug: "llm-training",
    title: "训练：让模型学会说话",
    date: "2026-05-25",
    tag: "大模型",
    summary:
      "用 4M 参数模型正式训练一次：cosine LR、gradient clipping、过拟合诊断。观察模型从乱码到莎士比亚的全过程。",
    cover: <TrainingCover />,
  },
  {
    slug: "llm-transformer",
    title: "搭一个完整的 Transformer",
    date: "2026-05-25",
    tag: "大模型",
    summary:
      "消融实验逐一移除 LayerNorm、残差连接、FFN、位置编码，用数据证明每个组件为什么不可或缺。",
    cover: <TransformerCover />,
  },
  {
    slug: "llm-attention",
    title: "Attention 到底在做什么",
    date: "2026-05-25",
    tag: "大模型",
    summary:
      "从查字典的角度拆解 Q/K/V，逐步演示注意力计算，可视化训练后的注意力模式——不同 head 自动学会了局部、全局、分散三种关注方式。",
    cover: <AttentionCover />,
  },
  {
    slug: "llm-tokenizer",
    title: "Tokenizer：把文字变成数字",
    date: "2026-05-25",
    tag: "大模型",
    summary:
      "手写 BPE 算法，从 256 字节开始不断合并高频对。vocab_size=4000 时压缩率 3.75x，同样的上下文窗口能看到 4 倍内容。",
    cover: <TokenizerCover />,
  },
  {
    slug: "minimal-llm",
    title: "从零搭一个语言模型",
    date: "2026-05-25",
    tag: "大模型",
    summary:
      "从只看前 1 个字符的 Bigram，到看 16 个字符的 MLP，到用 Attention 动态决定看哪里的 MiniGPT。三个模型，同一份莎士比亚数据，效果逐级提升。",
    cover: <MinimalLLMCover />,
  },
  {
    slug: "recommender-landscape",
    title: "推荐系统全景图",
    date: "2026-05-22",
    tag: "推荐系统",
    summary:
      "从数据层到评估体系，7 个环节的完整架构。对照工业界标准看我们做了什么、还差什么、前沿在哪。",
    cover: <LandscapeCover />,
  },
  {
    slug: "engineering-recommender",
    title: "把推荐系统工程化",
    date: "2026-05-22",
    tag: "推荐系统",
    summary:
      "Docker 一键启动、PostgreSQL 持久化、Redis 缓存、结构化日志、模型热切换。把能跑的 demo 变成能部署的服务。",
    cover: <EngineeringCover />,
  },
  {
    slug: "reranking-diversity",
    title: "重排：让推荐列表不再千篇一律",
    date: "2026-05-22",
    tag: "推荐系统",
    summary:
      "精排逐条打分看不见列表整体。重排站在列表层面做多样性：MMR 兼顾分数和差异，类型打散避免连续同类型，Coverage 提升 25%。",
    cover: <RerankingCover />,
  },
  {
    slug: "mmoe-multitask",
    title: "多目标排序：一个模型同时优化多件事",
    date: "2026-05-21",
    tag: "推荐系统",
    summary:
      "用 MMoE 同时预测用户会不会看、会不会及格、会不会高分。训练一次，调权重就能适配不同业务策略。",
    cover: <MMoECover />,
  },
  {
    slug: "din-sequence",
    title: "用 DIN 建模用户兴趣序列",
    date: "2026-05-21",
    tag: "推荐系统",
    summary:
      "把用户最近看过的电影序列喂进模型，用 attention 动态提取和候选相关的兴趣。同一个用户看完科幻和看完动画之后拿到的推荐完全不同。",
    cover: <DINSequenceCover />,
  },
  {
    slug: "hard-negative-eval",
    title: "负样本策略和离线评估",
    date: "2026-05-21",
    tag: "推荐系统",
    summary:
      "建了一套离线评估 pipeline 量化推荐效果，把负样本从纯随机换成热门+同类型混合策略，让模型学更难的判断。",
    cover: <HardNegativeCover />,
  },
  {
    slug: "two-tower-recall",
    title: "用双塔模型做向量召回",
    date: "2026-05-21",
    tag: "推荐系统",
    summary:
      "用两个神经网络分别编码用户和电影，训练时拉近正样本推远负样本，替代 SVD 做更强的向量召回。",
    cover: <TwoTowerCover />,
  },
  {
    slug: "deepfm-ranking",
    title: "用模型替代手写公式做排序",
    date: "2026-05-20",
    tag: "推荐系统",
    summary:
      "用 DeepFM 从 285 万条数据里学出什么用户配什么电影，让排序结果因人而异，替代拍脑袋定权重的手写公式。",
    cover: <DeepFMCover />,
  },
  {
    slug: "vector-recall",
    title: "给推荐系统加上向量召回",
    date: "2026-05-20",
    tag: "推荐系统",
    summary:
      "用矩阵分解把电影压缩成 64 维向量，用 FAISS 做毫秒级检索，让推荐系统能发现「没有共现但语义相似」的电影。",
    cover: <VectorRecallCover />,
  },
  {
    slug: "minimal-recommender",
    title: "从零搭一个推荐系统",
    date: "2026-05-20",
    tag: "推荐系统",
    summary:
      "用 MovieLens + Python + FastAPI 搭一个最小但结构完整的推荐系统，理解召回、合并、精排的工程本质。",
    cover: <RecommenderCover />,
  },
  {
    slug: "polar-starry-resources",
    title: "极地星空 / 宇宙主题资源清单",
    date: "2026-05-18",
    tag: "资源",
    summary:
      "整理极光、星空延时、星轨、宇宙纪录片与天文摄影相关的素材平台和 YouTube 频道，方便后续做治愈音乐与星空视觉内容。",
    cover: <AstralResourcesCover />,
  },
  {
    slug: "craft-oriensx",
    title: "搭建这个网站",
    date: "2026-03-02",
    tag: "建站",
    summary:
      "搭建这个网站的过程是一场关于秩序的实验，我努力追求一种克制的、美丽优雅的呈现。这种美不为悦人，而为自洽。",
    cover: <CraftCover />,
  },
];

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 从 URL 读取初始状态
  const initialTag = searchParams.get("tag") || ALL_TAG;
  const initialPage = Number(searchParams.get("page")) || 1;

  const [activeTag, setActiveTag] = useState(
    TAGS.includes(initialTag) ? initialTag : ALL_TAG
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const PAGE_SIZE = 10;

  // 同步状态到 URL
  const updateURL = useCallback(
    (tag: string, page: number) => {
      const params = new URLSearchParams();
      if (tag !== ALL_TAG) params.set("tag", tag);
      if (page > 1) params.set("page", String(page));
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    },
    [router]
  );

  // 计算每个标签的文章数量
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts[ALL_TAG] = posts.length;
    for (const tag of TAGS) {
      if (tag !== ALL_TAG) {
        counts[tag] = posts.filter((p) => p.tag === tag).length;
      }
    }
    return counts;
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeTag === ALL_TAG) return posts;
    return posts.filter((p) => p.tag === activeTag);
  }, [activeTag]);

  // 分页
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  // 切换标签
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setCurrentPage(1);
    updateURL(tag, 1);
  };

  // 切换页码
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(activeTag, page);
  };

  return (
    <main className="py-20">
      <Grid.System>
        <BlogHero
          tags={TAGS}
          activeTag={activeTag}
          onTagChange={handleTagChange}
          tagCounts={tagCounts}
        />
        <PostList posts={paginatedPosts} />

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-8">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                  currentPage === i + 1
                    ? "border-foreground/60 text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              下一页
            </button>
          </div>
        )}
      </Grid.System>
    </main>
  );
}

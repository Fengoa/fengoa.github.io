"use client";

import { useState, useMemo } from "react";
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

const ALL_TAG = "全部";
const TAGS = [ALL_TAG, "大模型", "推荐系统", "生活", "资源", "建站"];

const posts: PostData[] = [
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
  const [activeTag, setActiveTag] = useState(ALL_TAG);

  const filteredPosts = useMemo(() => {
    if (activeTag === ALL_TAG) return posts;
    return posts.filter((p) => p.tag === activeTag);
  }, [activeTag]);

  return (
    <main className="py-20">
      <Grid.System>
        <BlogHero tags={TAGS} activeTag={activeTag} onTagChange={setActiveTag} />
        <PostList posts={filteredPosts} />
      </Grid.System>
    </main>
  );
}

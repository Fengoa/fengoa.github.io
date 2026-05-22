"use client";

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

const posts: PostData[] = [
  {
    slug: "engineering-recommender",
    title: "把推荐系统工程化",
    date: "2026-05-22",
    summary:
      "Docker 一键启动、PostgreSQL 持久化、Redis 缓存、结构化日志、模型热切换。把能跑的 demo 变成能部署的服务。",
    cover: <EngineeringCover />,
  },
  {
    slug: "reranking-diversity",
    title: "重排：让推荐列表不再千篇一律",
    date: "2026-05-22",
    summary:
      "精排逐条打分看不见列表整体。重排站在列表层面做多样性：MMR 兼顾分数和差异，类型打散避免连续同类型，Coverage 提升 25%。",
    cover: <RerankingCover />,
  },
  {
    slug: "mmoe-multitask",
    title: "多目标排序：一个模型同时优化多件事",
    date: "2026-05-21",
    summary:
      "用 MMoE 同时预测用户会不会看、会不会及格、会不会高分。训练一次，调权重就能适配不同业务策略。",
    cover: <MMoECover />,
  },
  {
    slug: "din-sequence",
    title: "用 DIN 建模用户兴趣序列",
    date: "2026-05-21",
    summary:
      "把用户最近看过的电影序列喂进模型，用 attention 动态提取和候选相关的兴趣。同一个用户看完科幻和看完动画之后拿到的推荐完全不同。",
    cover: <DINSequenceCover />,
  },
  {
    slug: "hard-negative-eval",
    title: "负样本策略和离线评估",
    date: "2026-05-21",
    summary:
      "建了一套离线评估 pipeline 量化推荐效果，把负样本从纯随机换成热门+同类型混合策略，让模型学更难的判断。",
    cover: <HardNegativeCover />,
  },
  {
    slug: "two-tower-recall",
    title: "用双塔模型做向量召回",
    date: "2026-05-21",
    summary:
      "用两个神经网络分别编码用户和电影，训练时拉近正样本推远负样本，替代 SVD 做更强的向量召回。",
    cover: <TwoTowerCover />,
  },
  {
    slug: "deepfm-ranking",
    title: "用模型替代手写公式做排序",
    date: "2026-05-20",
    summary:
      "用 DeepFM 从 285 万条数据里学出什么用户配什么电影，让排序结果因人而异，替代拍脑袋定权重的手写公式。",
    cover: <DeepFMCover />,
  },
  {
    slug: "vector-recall",
    title: "给推荐系统加上向量召回",
    date: "2026-05-20",
    summary:
      "用矩阵分解把电影压缩成 64 维向量，用 FAISS 做毫秒级检索，让推荐系统能发现「没有共现但语义相似」的电影。",
    cover: <VectorRecallCover />,
  },
  {
    slug: "minimal-recommender",
    title: "从零搭一个推荐系统",
    date: "2026-05-20",
    summary:
      "用 MovieLens + Python + FastAPI 搭一个最小但结构完整的推荐系统，理解召回、合并、精排的工程本质。",
    cover: <RecommenderCover />,
  },
  {
    slug: "polar-starry-resources",
    title: "极地星空 / 宇宙主题资源清单",
    date: "2026-05-18",
    summary:
      "整理极光、星空延时、星轨、宇宙纪录片与天文摄影相关的素材平台和 YouTube 频道，方便后续做治愈音乐与星空视觉内容。",
    cover: <AstralResourcesCover />,
  },
  {
    slug: "craft-oriensx",
    title: "搭建这个网站",
    date: "2026-03-02",
    summary:
      "搭建这个网站的过程是一场关于秩序的实验，我努力追求一种克制的、美丽优雅的呈现。这种美不为悦人，而为自洽。",
    cover: <CraftCover />,
  },
];

export default function Home() {
  return (
    <main className="py-20">
      <Grid.System>
        <BlogHero />
        <PostList posts={posts} />
      </Grid.System>
    </main>
  );
}

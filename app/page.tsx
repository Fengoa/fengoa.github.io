"use client";

import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import type { PostData } from "@/components/blog/post-card";
import { CraftCover } from "@/app/blog/craft-oriensx/cover";
import { AstralResourcesCover } from "@/app/blog/polar-starry-resources/cover";
import { RecommenderCover } from "@/app/blog/minimal-recommender/cover";

const posts: PostData[] = [
  {
    slug: "minimal-recommender",
    title: "从零搭一个推荐系统",
    date: "2026-05-20",
    summary:
      "推荐系统不是一个模型，是一条流水线。用 MovieLens + Python + FastAPI 搭一个最小但结构完整的推荐系统，理解召回、合并、精排的工程本质。",
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

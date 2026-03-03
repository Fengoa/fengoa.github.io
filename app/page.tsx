"use client";

import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import type { PostData } from "@/components/blog/post-card";
import { CraftCover } from "@/app/blog/craft-oriensx/cover";

const posts: PostData[] = [
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

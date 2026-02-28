import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import type { PostData } from "@/components/blog/post-card";

const posts: PostData[] = [
  {
    slug: "crafting-oriensx",
    title: "制作稳定的界面：个人网站的搭建",
    date: "2026-02-26",
    summary:
      "秩序，平和，隐藏一点俏皮，是我为这个网站设定的风格，我确实很喜欢这个风格。",
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

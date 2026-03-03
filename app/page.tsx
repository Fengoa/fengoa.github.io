import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import type { PostData } from "@/components/blog/post-card";

const posts: PostData[] = [
  {
    slug: "craft-oriensx",
    title: "表达的欲望：这个网站是怎么搭建的",
    date: "2026-03-02",
    summary:
      "",
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

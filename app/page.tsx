import { PostList } from "@/components/blog/post-list";
import { BlogHero } from "@/components/blog/blog-hero";
import { Grid } from "@/components/ui/grid";
import type { PostData } from "@/components/blog/post-card";

const posts: PostData[] = [
  {
    slug: "craft-oriensx",
    title: "安静但不是什么都没有",
    date: "2026-02-26",
    summary:
      "一个安静的页面，怎样才不会显得空洞？答案藏在那些大多数人注意不到的地方。",
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

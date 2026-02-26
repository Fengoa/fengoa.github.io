import { PostList } from "@/components/blog/post-list";
import type { PostData } from "@/components/blog/post-card";

const posts: PostData[] = [
  {
    slug: "craft-oriens",
    title: "Crafting Oriens",
    date: "2026-02-26",
    author: "向东Oriens",
    summary:
      "记录这个博客的搭建过程——导航栏的模糊渐变、网格系统的参考线绘制、以及那个跟随鼠标的滑动背景。",
  },
  {
    slug: "hello-world",
    title: "Hello World: 我的第一篇数字花园日志",
    date: "2026-02-05",
    author: "向东Oriens",
    summary:
      "探索 UX Engineer 的像素与代码之路，记录在用户体验、视觉设计与前端工程化之间的探索。",
  },
  {
    slug: "magic-ui-animation",
    title: "Magic UI 动画的丝滑之道",
    date: "2026-02-08",
    author: "向东Oriens",
    summary:
      "深入剖析 Framer Motion 与 CSS 动画在组件库中的最佳实践，让每一帧都恰到好处。",
  },
  {
    slug: "bento-grid-layout",
    title: "Bento Grid：从布局到叙事",
    date: "2026-02-10",
    author: "向东Oriens",
    summary:
      "好的布局不只是排列，而是讲故事。聊聊 Bento Grid 背后的设计哲学与响应式实现。",
  },
  {
    slug: "dark-mode-engineering",
    title: "暗黑模式的工程美学",
    date: "2026-02-11",
    author: "向东Oriens",
    summary:
      "不只是黑白反转。从色彩系统、对比度到 View Transition，构建真正优雅的暗黑体验。",
  },
];

export default function Home() {
  return (
    <main className="py-20 space-y-12">
      <PostList posts={posts} />
    </main>
  );
}

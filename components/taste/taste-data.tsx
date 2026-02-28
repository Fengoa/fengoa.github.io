import type { TasteItem, TasteCategory } from "./taste-card";

export type TasteCategoryGroup = {
  id: string;
  label: TasteCategory;
  items: TasteItem[];
};

export const tasteCategories: TasteCategoryGroup[] = [
  {
    id: "article",
    label: "文章",
    items: [
      {
        id: "taste-1",
        title: "The UX of UUIDs",
        description:
          "从用户体验角度重新审视 UUID 的设计，探讨更友好的标识符方案。",
        url: "https://unkey.com/blog/uuid-ux",
        category: "文章",
        date: "2026-01-15",
      },
      {
        id: "taste-2",
        title: "Why We Design",
        description:
          "关于设计初心的深度反思——我们为什么设计，以及设计的意义何在。",
        url: "https://vanschneider.com/blog/why-we-design",
        category: "文章",
        date: "2025-12-20",
      },
    ],
  },
  {
    id: "tool",
    label: "工具",
    items: [
      {
        id: "taste-3",
        title: "Raycast",
        description:
          "Mac 上最强大的启动器，效率翻倍的工作流利器。",
        url: "https://www.raycast.com",
        category: "工具",
        date: "2026-02-01",
      },
      {
        id: "taste-4",
        title: "Linear",
        description:
          "为高效团队打造的项目管理工具，极致的操作体验和设计美学。",
        url: "https://linear.app",
        category: "工具",
        date: "2025-11-10",
      },
    ],
  },
  {
    id: "design",
    label: "设计",
    items: [
      {
        id: "taste-5",
        title: "Vercel Design System",
        description:
          "Vercel 的设计系统，极简、一致且高度可扩展的组件体系。",
        url: "https://vercel.com/geist/introduction",
        category: "设计",
        date: "2026-01-05",
      },
      {
        id: "taste-6",
        title: "Radix UI",
        description:
          "无样式的无障碍组件库，构建高质量设计系统的基石。",
        url: "https://www.radix-ui.com",
        category: "设计",
        date: "2025-10-18",
      },
    ],
  },
  {
    id: "open-source",
    label: "开源",
    items: [
      {
        id: "taste-7",
        title: "Shadcn UI",
        description:
          "可复制粘贴的精美组件集合，基于 Radix 和 Tailwind CSS。",
        url: "https://ui.shadcn.com",
        category: "开源",
        date: "2026-02-10",
      },
      {
        id: "taste-8",
        title: "Motion Primitives",
        description:
          "精心制作的动画组件集，为 React 项目增添丝滑的交互体验。",
        url: "https://motion-primitives.com",
        category: "开源",
        date: "2025-12-25",
      },
    ],
  },
  {
    id: "podcast",
    label: "播客",
    items: [
      {
        id: "taste-9",
        title: "Syntax.fm",
        description:
          "面向 Web 开发者的播客，全栈技术、工具和职业发展的深度对话。",
        url: "https://syntax.fm",
        category: "播客",
        date: "2025-11-30",
      },
    ],
  },
  {
    id: "video",
    label: "视频",
    items: [
      {
        id: "taste-10",
        title: "Fireship: 100 Seconds of Code",
        description:
          "用 100 秒解释一个技术概念，高效有趣的编程科普系列。",
        url: "https://www.youtube.com/@Fireship",
        category: "视频",
        date: "2026-01-20",
      },
    ],
  },
];

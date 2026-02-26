import { TasteList } from "@/components/taste/taste-list";
import type { TasteItem } from "@/components/taste/taste-card";

const items: TasteItem[] = [
  {
    id: "1",
    title: "The Evolution of React Architecture",
    description:
      "从 Class Components 到 Server Components，React 架构演进背后的设计哲学与工程权衡。一篇值得反复阅读的深度长文。",
    url: "https://example.com",
    category: "文章",
    date: "2026-02-24",
    source: "Dan Abramov",
  },
  {
    id: "2",
    title: "Figma 的 Variable 系统设计指南",
    description:
      "Figma 官方团队详解 Variable 系统如何统一设计与开发之间的表达，从 Token 到响应式的完整实践路径。",
    url: "https://example.com",
    category: "设计",
    date: "2026-02-20",
    source: "Figma Blog",
  },
  {
    id: "3",
    title: "Motion：Framer Motion 的下一代",
    description:
      "Framer Motion 正式更名为 Motion，独立发展为一个更轻量、更通用的动画库。了解新 API 的变化与迁移路径。",
    url: "https://motion.dev",
    category: "开源",
    date: "2026-02-18",
    source: "motion.dev",
  },
  {
    id: "4",
    title: "Raycast：重新定义桌面效率工具",
    description:
      "一款为开发者设计的 macOS 启动器，内置剪贴板管理、窗口管理、AI 聊天，以及可扩展的插件生态。",
    url: "https://raycast.com",
    category: "工具",
    date: "2026-02-15",
    source: "Raycast",
  },
  {
    id: "5",
    title: "Syntax.fm — Modern CSS 特辑",
    description:
      "Wes Bos 和 Scott Tolinski 深入聊了 CSS 领域的最新进展：Container Queries、Anchor Positioning、View Transitions 等。",
    url: "https://syntax.fm",
    category: "播客",
    date: "2026-02-12",
    source: "Syntax.fm",
  },
  {
    id: "6",
    title: "shadcn/ui：不只是组件库",
    description:
      "为什么 shadcn/ui 选择以代码分发而非 npm 包的方式交付？这篇深度分析了其架构哲学对前端生态的深远影响。",
    url: "https://example.com",
    category: "文章",
    date: "2026-02-10",
    source: "Vercel Blog",
  },
  {
    id: "7",
    title: "Excalidraw：手绘风白板的工程之美",
    description:
      "开源的手绘风格白板工具，支持实时协作。其渲染引擎和协作架构值得每一位前端开发者学习。",
    url: "https://excalidraw.com",
    category: "开源",
    date: "2026-02-08",
    source: "GitHub",
  },
  {
    id: "8",
    title: "Designing for Dark Mode — 不止是反色",
    description:
      "来自 Apple 设计团队的分享，讲述暗黑模式设计中色彩感知、对比度和情感表达的平衡之道。",
    url: "https://example.com",
    category: "视频",
    date: "2026-02-05",
    source: "WWDC",
  },
];

export default function TastePage() {
  return (
    <main className="py-12">
      <TasteList items={items} />
    </main>
  );
}

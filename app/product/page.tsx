import { ProductHero } from "@/components/product/product-hero";
import { ProductList } from "@/components/product/product-list";
import type { ProductItem } from "@/components/product/product-card";
import { Grid } from "@/components/ui/grid";
import {
  Palette,
  Terminal,
  Figma,
  Layers,
  Sparkles,
  Globe,
} from "lucide-react";

const products: ProductItem[] = [
  {
    id: "oriens-blog",
    name: "Oriens Blog",
    description:
      "基于 Next.js 构建的个人博客，采用 MDX 内容管理、Grid 布局系统与 Motion 动画。",
    href: "https://github.com",
    tags: ["Next.js", "MDX", "Motion"],
    icon: <Globe className="size-5" />,
    year: "2026",
  },
  {
    id: "design-system",
    name: "Orien Design",
    description:
      "一套面向产品团队的设计系统，包含 Token、组件库与主题引擎，统一设计与开发表达。",
    href: "https://github.com",
    tags: ["Design System", "React", "Figma"],
    icon: <Palette className="size-5" />,
    year: "2025",
  },
  {
    id: "fig-gen",
    name: "FigGen",
    description:
      "Figma 插件，自动生成设计规范文档与标注，加速设计到开发的交付流程。",
    href: "https://github.com",
    tags: ["Figma Plugin", "TypeScript"],
    icon: <Figma className="size-5" />,
    year: "2025",
  },
  {
    id: "cli-toolkit",
    name: "DevKit CLI",
    description:
      "面向前端工程师的命令行工具集，集成项目初始化、代码生成与发布流水线。",
    href: "https://github.com",
    tags: ["CLI", "Node.js"],
    icon: <Terminal className="size-5" />,
    year: "2024",
  },
  {
    id: "motion-lab",
    name: "Motion Lab",
    description:
      "交互动画实验场，探索 Spring 物理模型、手势驱动与布局动画的最佳实践。",
    href: "https://github.com",
    tags: ["Motion", "实验"],
    icon: <Sparkles className="size-5" />,
    year: "2024",
  },
  {
    id: "layer-stack",
    name: "LayerStack",
    description:
      "可视化图层管理工具，帮助设计师快速整理复杂 Figma 文件的图层结构。",
    href: "https://github.com",
    tags: ["Figma Plugin", "效率"],
    icon: <Layers className="size-5" />,
    year: "2023",
  },
];

export default function ProductPage() {
  return (
    <main className="py-20">
      <Grid.System>
        <ProductHero />
        <ProductList products={products} />
      </Grid.System>
    </main>
  );
}

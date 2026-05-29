import { ProductHero } from "@/components/product/product-hero";
import { ProductList } from "@/components/product/product-list";
import type { ProductItem } from "@/components/product/product-card";
import { Grid } from "@/components/ui/grid";
import {
  Globe,
  // TrendingUpDown,
  MessageCircle,
  AudioLines,
  SprayCan,
  Figma,
  ScanLine,
} from "lucide-react";

const products: ProductItem[] = [
  {
    id: "personal-site",
    name: "个人网站 oriensx.github.io",
    description: "基于 Next.js 构建的个人网站，包含博客、作品集和个人简历。",
    href: "https://oriensx.github.io",
    icon: <Globe className="size-5" />,
  },
  // {
  //   id: "tradexcellet",
  //   name: "交易分析产品 Tradexcellet",
  //   description: "面向交易者的数据分析产品，提供专业的交易数据洞察与可视化。",
  //   href: "https://tradexcellet.com",
  //   icon: <TrendingUpDown className="size-5" />,
  // },
  {
    id: "wechat-video",
    name: "微信聊天生成视频工具",
    description: "将微信聊天记录转化为视频内容的在线工具。",
    href: "https://lab.logeast.cc/chat",
    icon: <MessageCircle className="size-5" />,
  },
  {
    id: "audio-tools",
    name: "在线音频合并/裁剪工具",
    description: "轻量级在线音频处理工具，支持音频合并与裁剪，无需安装软件。",
    href: "https://lab.logeast.cc/en/audio-merge",
    icon: <AudioLines className="size-5" />,
  },
  {
    id: "magic-lottery",
    name: "Magic Lottery",
    description: "一个用于抽奖的轻量级 JavaScript 库，简单易用。",
    href: "https://orienslu.github.io/magic-lottery/zh/",
    icon: <SprayCan className="size-5" />,
  },
  {
    id: "figma-uml",
    name: "Figma UML Table Diagram",
    description:
      "Figma 社区插件，用于在 Figma 中快速创建 UML 表格图。",
    href: "https://www.figma.com/community/widget/1190104377571373751/uml-table-diagram",
    icon: <Figma className="size-5" />,
  },
  {
    id: "scan-stars",
    name: "和公众人物比较相似度",
    description: "一款有趣的微信小程序，通过人脸识别与公众人物进行相似度比较。",
    href: "https://github.com/WeDaHub/incubator-scan-stars",
    icon: <ScanLine className="size-5" />,
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

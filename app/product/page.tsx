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
  Terminal,
  Gamepad2,
} from "lucide-react";

const products: ProductItem[] = [
  {
    id: "create-gin-api",
    name: "create-gin-api",
    description: (
      <>
        Go CLI 脚手架。交互式或命令行生成 Gin API；模板含{" "}
        <strong>GORM / Postgres</strong>、Redis、Zap、Air、Swagger 与 Docker。
      </>
    ),
    href: "/product/create-gin-api",
    icon: <Terminal className="size-5" />,
  },
  {
    id: "2048-arena",
    name: "2048 Arena",
    description:
      "Write a JS bot, play 2048, and rank your product site on a daily board. Visual language adapted from 2048bid.lol.",
    href: "/2048",
    icon: <Gamepad2 className="size-5" />,
  },
  {
    id: "personal-site",
    name: "个人网站 oriensx.github.io",
    description: "Next.js 个人站，覆盖博客、作品与简历。",
    href: "https://oriensx.github.io",
    icon: <Globe className="size-5" />,
  },
  // {
  //   id: "tradexcellet",
  //   name: "交易分析产品 Tradexcellet",
  //   description: "交易数据分析与可视化。",
  //   href: "https://tradexcellet.com",
  //   icon: <TrendingUpDown className="size-5" />,
  // },
  {
    id: "wechat-video",
    name: "微信聊天生成视频工具",
    description: "在线工具：将微信聊天记录导出为视频。",
    href: "https://lab.logeast.cc/chat",
    icon: <MessageCircle className="size-5" />,
  },
  {
    id: "audio-tools",
    name: "在线音频合并/裁剪工具",
    description: "浏览器内完成音频合并与裁剪。",
    href: "https://lab.logeast.cc/en/audio-merge",
    icon: <AudioLines className="size-5" />,
  },
  {
    id: "magic-lottery",
    name: "Magic Lottery",
    description: "抽奖用的 JavaScript 库。",
    href: "https://orienslu.github.io/magic-lottery/zh/",
    icon: <SprayCan className="size-5" />,
  },
  {
    id: "figma-uml",
    name: "Figma UML Table Diagram",
    description: "Figma 社区插件，在画布上创建 UML 表格图。",
    href: "https://www.figma.com/community/widget/1190104377571373751/uml-table-diagram",
    icon: <Figma className="size-5" />,
  },
  {
    id: "scan-stars",
    name: "和公众人物比较相似度",
    description: "微信小程序。人脸识别后，与公众人物计算相似度。",
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

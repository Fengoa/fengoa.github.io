import { ProductList } from "@/components/product/product-list";
import type { ProductItem } from "@/components/product/product-card";
import {
  Rocket,
  Shield,
  Globe,
  Zap,
  Cloud,
  Code,
  Users,
  Lock,
  BarChart3,
  Layers,
  Gauge,
  Headphones,
} from "lucide-react";

const products: ProductItem[] = [
  {
    id: "starter",
    name: "Starter",
    description: "适合个人项目和独立开发者，快速起步的理想选择。",
    price: "免费",
    features: [
      { icon: <Rocket className="size-4" />, text: "快速部署，秒级上线" },
      { icon: <Code className="size-4" />, text: "自动化 CI/CD 流水线" },
      { icon: <Shield className="size-4" />, text: "基础安全防护" },
      { icon: <Globe className="size-4" />, text: "全球 CDN 加速" },
      { icon: <Cloud className="size-4" />, text: "弹性计算资源" },
      { icon: <BarChart3 className="size-4" />, text: "基础流量分析" },
    ],
    cta: "开始使用",
    ctaHref: "#",
  },
  {
    id: "pro",
    name: "Pro",
    description: "为团队和成长型产品打造，满足规模化需求。",
    price: "¥128/月",
    priceNote: "+ 按量计费",
    popular: true,
    features: [
      {
        icon: <Zap className="size-4" />,
        text: "包含 Starter 全部功能",
      },
      { icon: <Layers className="size-4" />, text: "¥128 免费额度" },
      { icon: <Users className="size-4" />, text: "团队协作与权限管理" },
      {
        icon: <Gauge className="size-4" />,
        text: "更快的构建速度",
      },
      {
        icon: <Shield className="size-4" />,
        text: "冷启动优化",
      },
      { icon: <Cloud className="size-4" />, text: "企业级扩展插件" },
    ],
    cta: "免费试用",
    ctaHref: "#",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "关键安全、高可用、平台级 SLA 和专属支持。",
    features: [
      {
        icon: <Lock className="size-4" />,
        text: "包含 Pro 全部功能",
      },
      {
        icon: <Users className="size-4" />,
        text: "访客与团队权限控制",
      },
      {
        icon: <Shield className="size-4" />,
        text: "目录同步与 SSO",
      },
      {
        icon: <Globe className="size-4" />,
        text: "多区域计算与容灾",
      },
      {
        icon: <Gauge className="size-4" />,
        text: "99.99% SLA",
      },
      {
        icon: <Headphones className="size-4" />,
        text: "专属技术支持",
      },
    ],
    cta: "获取方案",
    ctaHref: "#",
    secondaryCta: "申请试用",
    secondaryCtaHref: "#",
  },
];

export default function ProductPage() {
  return (
    <main className="py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          找到适合你的方案
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          面向不同规模的团队，按需选择，灵活扩展。
        </p>
      </div>

      {/* Product Grid */}
      <ProductList products={products} />
    </main>
  );
}

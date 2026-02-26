import { Grid } from "@/components/ui/grid";
import {
  Mail,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Monitor,
  Lightbulb,
  Sparkles,
  Dice5,
  Code,
} from "lucide-react";

export default function MePage() {
  return (
    <main className="py-12 space-y-0">
      {/* Hero */}
      <Grid rows={1} columns={4}>
        <Grid.Cross row={1} column={1} />
        <Grid.Cell
          row={1}
          column={1}
          colSpan={4}
          className="py-16 sm:py-24"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            卢向东
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            用户体验工程师，擅长产品研发、创意挖掘、用户体验打磨。
          </p>
        </Grid.Cell>
      </Grid>

      {/* 主体 Grid */}
      <Grid rows={5} columns={4}>
        <Grid.Cross row={1} column={1} />
        <Grid.Cross row={1} column={-1} />
        <Grid.Cross row={-1} column={1} />
        <Grid.Cross row={-1} column={-1} />

        {/* 关于 — 左侧 2×2 */}
        <Grid.Cell row={1} column={1} colSpan={2} rowSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">关于</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            我在腾讯微信广告设计团队担任设计工程师，已超过 6 年。
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            保持着对这些事的热情：创意设计、动效设计、交互动画、React、CSS。
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a
              href="mailto:oriensx@outlook.com"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-3.5" />
              oriensx@outlook.com
            </a>
            <a
              href="https://github.com/orienslu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="size-3.5" />
              orienslu
            </a>
            <a
              href="https://moodl.ink/me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="size-3.5" />
              moodl.ink/me
            </a>
          </div>
        </Grid.Cell>

        {/* 经历 — 右侧 2 列 */}
        <Grid.Cell row={1} column={3} colSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Briefcase className="size-4" />
            <span className="text-sm font-medium">经历</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">腾讯 · 微信广告设计团队</p>
                <p className="text-xs text-muted-foreground mt-0.5">设计工程师</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">2019 - 至今</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">中山大学</p>
                <p className="text-xs text-muted-foreground mt-0.5">本科</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">2015 - 2019</span>
            </div>
          </div>
        </Grid.Cell>

        {/* 工作 — 右下 */}
        <Grid.Cell row={2} column={3} colSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Monitor className="size-4" />
            <span className="text-sm font-medium">正在做的事</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-1 size-1 rounded-full bg-muted-foreground/50" />
              还原设计理念，研发生产力工具
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-1 size-1 rounded-full bg-muted-foreground/50" />
              基础组件库和原子设计的引领者
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-1 size-1 rounded-full bg-muted-foreground/50" />
              Web 平台核心贡献者，AI 应用的先行者
            </li>
          </ul>
        </Grid.Cell>

        {/* 产品 — 第3行左2列 */}
        <Grid.Cell row={3} column={1} colSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Lightbulb className="size-4" />
            <span className="text-sm font-medium">产品</span>
          </div>
          <div className="space-y-3">
            <a
              href="https://moodl.ink"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-sm font-medium text-foreground group-hover:underline">Moodl.ink</p>
              <p className="text-xs text-muted-foreground mt-0.5">多媒体工具集合平台，让每一份情绪都能完美表达</p>
            </a>
            <a
              href="https://tradexcellet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-sm font-medium text-foreground group-hover:underline">Tradexcellet.com</p>
              <p className="text-xs text-muted-foreground mt-0.5">交易分析产品，正在为上千用户提供服务</p>
            </a>
          </div>
        </Grid.Cell>

        {/* 开源 — 第3行右2列 */}
        <Grid.Cell row={3} column={3} colSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Code className="size-4" />
            <span className="text-sm font-medium">开源</span>
          </div>
          <div className="space-y-3">
            <a
              href="https://orienslu.github.io/magic-lottery/zh/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-sm font-medium text-foreground group-hover:underline">Magic Lottery</p>
              <p className="text-xs text-muted-foreground mt-0.5">一款用于抽奖的库</p>
            </a>
            <a
              href="https://github.com/logeast/figma-dark-theme"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-sm font-medium text-foreground group-hover:underline">Figma Dark Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">改变 Figma 网页端皮肤的浏览器插件</p>
            </a>
            <a
              href="https://github.com/WeDaHub/incubator-scan-stars"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="text-sm font-medium text-foreground group-hover:underline">Incubator Scan Stars</p>
              <p className="text-xs text-muted-foreground mt-0.5">识别公众人物的小程序</p>
            </a>
          </div>
        </Grid.Cell>

        {/* 技能 — 第4行左1列 */}
        <Grid.Cell row={4} column={1} colSpan={1} rowSpan={2} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Dice5 className="size-4" />
            <span className="text-sm font-medium">技能</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Vue 3", "Next.js", "Node.js", "CSS", "小程序"].map(
              (skill) => (
                <span
                  key={skill}
                  className="inline-block px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              )
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["动效设计", "创意编程"].map((skill) => (
              <span
                key={skill}
                className="inline-block px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </Grid.Cell>

        {/* 创意 — 第4行中间 */}
        <Grid.Cell row={4} column={2} colSpan={3} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Lightbulb className="size-4" />
            <span className="text-sm font-medium">创意挖掘</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            阅读、思考，冒出稀奇古怪的创意。并正在把它们创造出来。
          </p>
        </Grid.Cell>

        {/* 学校 — 第5行 */}
        <Grid.Cell row={5} column={2} colSpan={3} className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <GraduationCap className="size-4" />
            <span className="text-sm font-medium">中山大学</span>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">厚朴工作室</span>
              {" — "}专注学院 IT 服务，网站设计和研发
            </p>
            <p>
              <span className="font-medium text-foreground">青朴科技</span>
              {" — "}HopeUI，一个基于 React 的设计系统
            </p>
          </div>
        </Grid.Cell>
      </Grid>
    </main>
  );
}

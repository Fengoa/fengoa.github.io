import { Grid } from "@/components/ui/grid";
import Image from "next/image";
import {
  Mail,
  Github,
  Globe,
  Briefcase,
  Lightbulb,
  Sparkles,
  Dice5,
  Code,
  Bookmark,
} from "lucide-react";

interface ResumeContentProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
}

export function ResumeContent({ resumeRef }: ResumeContentProps) {
  return (
    <Grid
      rows={1}
      columns={12}
      mergedAreas={[{ row: 1, column: 1, colSpan: 12 }]}
    >
      <Grid.Cell row={1} column={1} colSpan={12}>
        <div className="flex justify-center p-12">
          <div
            ref={resumeRef}
            id="resume"
            className="w-full max-w-3xl aspect-210/297 p-8 hover:bg-white dark:hover:bg-white/5 transition-all duration-300"
          >
            <Grid.System>
              {/* 第 1 行：左侧名片 + 右侧照片（2行高） */}
              <Grid
                rows={2}
                columns={2}
                mergedAreas={[{ row: 1, column: 2, rowSpan: 2 }]}
              >
                {/* 名片 */}
                <Grid.Cell row={1} column={1} className="p-8">
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Sparkles className="size-4" />
                    <span className="text-sm font-medium">关于</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    卢向东
                  </h2>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground/50" />
                      设计工程师 @腾讯
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground/50" />
                      oriensx@outlook.com
                    </li>
                  </ul>
                </Grid.Cell>

                {/* 照片 */}
                <Grid.Cell
                  row={1}
                  column={2}
                  rowSpan={2}
                  className="relative overflow-hidden"
                >
                  <Image
                    src="/oriens_pure.png"
                    alt="卢向东"
                    fill
                    className="object-cover object-top sepia-[.15] saturate-[1.1] drop-shadow-[0_0_6px_var(--background)]"
                    priority
                  />
                </Grid.Cell>

                {/* 简介 */}
                <Grid.Cell row={2} column={1} className="p-8">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    我在腾讯微信广告设计团队担任设计工程师，已超过 6 年。
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    保持着对这些事的热情：创意设计、动效设计、交互动画、React、CSS。
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    我的使命是创造优雅而精致的用户界面。
                  </p>
                </Grid.Cell>

                <Grid.Cross row={1} column={1} />
              </Grid>

              {/* 第 2 行：产品 + 经历 */}
              <Grid rows={1} columns={2}>
                {/* 产品 */}
                <Grid.Cell row={1} column={1} className="p-8">
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
                      <p className="text-sm font-medium text-foreground group-hover:underline">
                        Moodl.ink
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        多媒体工具集合平台，让每一份情绪都能完美表达
                      </p>
                    </a>
                    <a
                      href="https://tradexcellet.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <p className="text-sm font-medium text-foreground group-hover:underline">
                        Tradexcellet.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        交易分析产品，正在为上千用户提供服务
                      </p>
                    </a>
                  </div>
                </Grid.Cell>

                {/* 经历 */}
                <Grid.Cell row={1} column={2} className="p-8">
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Briefcase className="size-4" />
                    <span className="text-sm font-medium">经历</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          腾讯 · 微信广告设计团队
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          设计工程师
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        2019 - 至今
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          中山大学
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          本科
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        2015 - 2019
                      </span>
                    </div>
                  </div>
                </Grid.Cell>
              </Grid>

              {/* 第 3 行：技能 + 开源 */}
              <Grid rows={1} columns={2}>
                {/* 技能 */}
                <Grid.Cell row={1} column={1} className="p-8">
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Dice5 className="size-4" />
                    <span className="text-sm font-medium">技能</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "React",
                      "TypeScript",
                      "Vue 3",
                      "Next.js",
                      "Node.js",
                      "CSS",
                      "小程序",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
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

                {/* 开源 */}
                <Grid.Cell row={1} column={2} className="p-8">
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
                      <p className="text-sm font-medium text-foreground group-hover:underline">
                        Magic Lottery
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        一款用于抽奖的库
                      </p>
                    </a>
                    <a
                      href="https://github.com/logeast/figma-dark-theme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <p className="text-sm font-medium text-foreground group-hover:underline">
                        Figma Dark Theme
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        改变 Figma 网页端皮肤的浏览器插件
                      </p>
                    </a>
                    <a
                      href="https://github.com/WeDaHub/incubator-scan-stars"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <p className="text-sm font-medium text-foreground group-hover:underline">
                        Incubator Scan Stars
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        识别公众人物的小程序
                      </p>
                    </a>
                  </div>
                </Grid.Cell>
              </Grid>

              {/* 第 4 行：联系方式，跨满 */}
              <Grid
                rows={1}
                columns={2}
                mergedAreas={[{ row: 1, column: 1, colSpan: 2 }]}
              >
                <Grid.Cell row={1} column={1} colSpan={2} className="p-8">
                  <div className="flex flex-wrap gap-6 text-sm">
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
                      oriensx
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
                    <a
                      href="/taste"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Bookmark className="size-3.5" />
                      收藏夹
                    </a>
                  </div>
                </Grid.Cell>
                <Grid.Cross row={1} column={2} anchor="bottom-right" />
              </Grid>
            </Grid.System>
          </div>
        </div>
      </Grid.Cell>
    </Grid>
  );
}

import { Grid } from "@/components/ui/grid";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { SectionLabel } from "./section-label";
import { UserPenIcon } from "@/components/ui/user-pen-icon";
import { ContactRoundIcon } from "@/components/ui/contact-round-icon";
import { SwordsIcon } from "@/components/ui/swords-icon";
import { GamepadIcon } from "@/components/ui/gamepad-icon";
import { GithubIcon } from "@/components/ui/github-icon";
import { MailIcon } from "@/components/ui/mail-icon";
import { GlobeIcon } from "@/components/ui/globe-icon";
import { HeartIcon } from "@/components/ui/heart-icon";
import { ExternalLink } from "./external-link";

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
        <div className="flex justify-center p-4 md:p-12">
          <div
            ref={resumeRef}
            id="resume"
            className="w-full max-w-200 md:aspect-210/297 p-4 md:p-8 hover:bg-white dark:hover:bg-white/5 transition-all duration-300"
          >
            <Grid.System>
              {/* 第 1 行：移动端 1 列（照片在前），桌面端 2 列（照片跨 2 行） */}
              <Grid
                rows={2}
                columns={2}
                smColumns={1}
                smRows={3}
                mergedAreas={[{ row: 1, column: 2, rowSpan: 2 }]}
              >
                {/* 名片：桌面 r1c1，移动 r2c1 */}
                <Grid.Cell
                  row={1}
                  column={1}
                  smRow={2}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <SectionLabel
                    icon={(ref) => (
                      <UserPenIcon ref={ref} size={16} isAnimated={false} />
                    )}
                    label="卢向东"
                  />
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      设计工程师 @
                      <ExternalLink href="https://www.tencent.com/">
                        腾讯
                      </ExternalLink>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      oriensx@outlook.com
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      1996-11-11；中国深圳
                    </li>
                  </ul>
                </Grid.Cell>

                {/* 照片：桌面 r1c2 跨 2 行，移动 r1c1 */}
                <Grid.Cell
                  row={1}
                  column={2}
                  rowSpan={2}
                  smRow={1}
                  smColumn={1}
                  smRowSpan={1}
                  className="relative overflow-hidden aspect-3/3.6"
                >
                  <Image
                    src="/oriens_pure.png"
                    alt="卢向东"
                    fill
                    className="object-cover object-top sepia-[.15] saturate-[1.1] drop-shadow-[0_0_6px_var(--background)]"
                    priority
                  />
                </Grid.Cell>

                {/* 简介：桌面 r2c1，移动 r3c1 */}
                <Grid.Cell
                  row={2}
                  column={1}
                  smRow={3}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    我在广告投放设计团队担任设计工程师（UX 工程师），已超过 6
                    年。
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    我保持着对这些事的热情：
                    <br />
                    产品体验设计，广告平台，AI 应用探索，微信小程序，游戏制作和
                    <ExternalLink href="https://fanqienovel.com/page/7553065438549117976">
                      阅读
                    </ExternalLink>
                    。
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    我在做出伟大产品的路上持续耕耘。
                  </p>
                </Grid.Cell>

                <Grid.Cross row={1} column={1} />
              </Grid>

              {/* 第 2 行：产品 + 经历 */}
              <Grid rows={1} columns={2} smColumns={1} smRows={2}>
                <Grid.Cell
                  row={1}
                  column={1}
                  smRow={1}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <SectionLabel
                    icon={() => <Lightbulb className="size-4" />}
                    label="作品"
                  />
                  <div className="space-y-3">
                    <ExternalLink href="https://ad.qq.com/">
                      腾讯广告投放平台
                    </ExternalLink>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        腾讯广告助手小程序
                      </p>
                    </div>
                  </div>
                </Grid.Cell>

                <Grid.Cell
                  row={1}
                  column={2}
                  smRow={2}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <SectionLabel
                    icon={(ref) => (
                      <ContactRoundIcon
                        ref={ref}
                        size={16}
                        isAnimated={false}
                      />
                    )}
                    label="经历"
                  />
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          腾讯 · 广告投放设计团队
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
                <Grid.Cross row={1} column={2} anchor="bottom-left" />
              </Grid>
              <Grid rows={1} columns={2} smColumns={1} smRows={2}>
                <Grid.Cell
                  row={1}
                  column={1}
                  smRow={1}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <SectionLabel
                    icon={(ref) => (
                      <SwordsIcon ref={ref} size={16} isAnimated={false} />
                    )}
                    label="技能"
                  />
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

                <Grid.Cell
                  row={1}
                  column={2}
                  smRow={2}
                  smColumn={1}
                  className="p-6 md:p-8"
                >
                  <SectionLabel
                    icon={(ref) => (
                      <GamepadIcon ref={ref} size={16} isAnimated={false} />
                    )}
                    label="玩具"
                  />
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
                smColumns={1}
                mergedAreas={[{ row: 1, column: 1, colSpan: 2 }]}
              >
                <Grid.Cell
                  row={1}
                  column={1}
                  colSpan={2}
                  smColSpan={1}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
                    <a
                      href="mailto:oriensx@outlook.com"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MailIcon size={14} />
                      oriensx@outlook.com
                    </a>
                    <a
                      href="https://github.com/orienslu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GithubIcon size={14} />
                      oriensx
                    </a>
                    <a
                      href="https://moodl.ink/me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GlobeIcon size={14} />
                      moodl.ink/me
                    </a>
                    <a
                      href="/taste"
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HeartIcon size={14} />
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

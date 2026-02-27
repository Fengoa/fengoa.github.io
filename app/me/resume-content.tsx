import { Grid } from "@/components/ui/grid";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { SectionLabel } from "./section-label";
import { UserPenIcon } from "@/components/ui/user-pen-icon";
import { ContactRoundIcon } from "@/components/ui/contact-round-icon";
import { SwordsIcon } from "@/components/ui/swords-icon";
import { GamepadIcon } from "@/components/ui/gamepad-icon";
import { GithubIcon } from "@/components/ui/github-icon";
import { HeartIcon } from "@/components/ui/heart-icon";
import { ExternalLink } from "./external-link";
import { BlocksIcon } from "@/components/ui/blocks-icon";
import { QrCodeIcon } from "@/components/ui/qr-code-icon";
import { InfoItem } from "./info-item";
import { MousePointerClickIcon } from "@/components/ui/mouse-pointer-click-icon";
import { TelescopeIcon } from "@/components/ui/telescope-icon";
import { AudioLinesIcon } from "@/components/ui/audio-lines-icon";
import { FigmaIcon } from "@/components/ui/figma-icon";
import { ScanLineIcon } from "@/components/ui/scan-line-icon";
import { TrendingUpDownIcon } from "@/components/ui/trending-up-down-icon";
import { MessageCircleIcon } from "@/components/ui/message-circle-icon";
import { SprayCanIcon } from "@/components/ui/spray-can-icon";
import { AvatarIcon } from "@/components/ui/avatar-icon";

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
                  <div className="flex flex-col space-y-1.5">
                    <InfoItem>
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      设计工程师
                      <ExternalLink href="https://www.tencent.com/">
                        @腾讯
                      </ExternalLink>
                    </InfoItem>
                    <InfoItem>
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      oriensx@outlook.com
                    </InfoItem>
                    <InfoItem>
                      <span className="size-1 rounded-full bg-muted-foreground/40" />
                      1996-11-11；中国深圳
                    </InfoItem>
                  </div>
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
                  className="p-6 md:p-8 space-y-3"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    我在广告投放设计团队担任设计工程师（UX 工程师），已超过 6
                    年。
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    我保持着对这些事的热情：
                    <br />
                    产品体验设计，广告平台，AI 应用探索，微信小程序，游戏制作和
                    <ExternalLink href="https://fanqienovel.com/page/7553065438549117976">
                      阅读
                    </ExternalLink>
                    。
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                    <InfoItem>
                      <BlocksIcon size={16} />
                      <span>
                        广告
                        <ExternalLink href="https://ad.qq.com/">
                          投放平台/工作台
                        </ExternalLink>
                      </span>
                    </InfoItem>
                    <InfoItem>
                      <QrCodeIcon size={16} />
                      <span>
                        腾讯广告助手/客户工作台
                        <ExternalLink href="https://ad.qq.com/">
                          小程序
                        </ExternalLink>
                      </span>
                    </InfoItem>
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
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <InfoItem>
                        <MousePointerClickIcon size={16} />
                        <ExternalLink href="https://e.qq.com/technology">
                          腾讯广告投放设计团队
                        </ExternalLink>
                      </InfoItem>
                      <InfoItem>2019 - 至今</InfoItem>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <InfoItem>
                        <TelescopeIcon size={16} />
                        中山大学 ·
                        <ExternalLink href="https://ce.sysu.edu.cn/zh-hans">
                          应用化学
                        </ExternalLink>
                      </InfoItem>
                      <InfoItem>2015 - 2019</InfoItem>
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
                      "Next.js",
                      "Tailwind CSS",
                      "微信小程序",
                      "CocosCreator",
                      "Figma design",
                      "PHP Laravel",
                      "Vibe coding",
                      "产品设计",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-dashed my-6" />
                  <div className="flex items-center flex-wrap">
                    <InfoItem>
                      <ExternalLink
                        href="https://github.com/oriensx"
                        icon={<GithubIcon size={14} />}
                      >
                        GitHub
                      </ExternalLink>
                    </InfoItem>
                    <div className="h-6 -my-1 mx-4 w-px rounded-full bg-linear-to-b from-transparent from-2% via-border to-transparent to-98%"></div>
                    <InfoItem>
                      <ExternalLink
                        href="/taste"
                        icon={<HeartIcon size={14} />}
                      >
                        收藏夹
                      </ExternalLink>
                    </InfoItem>
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
                    <InfoItem>
                      <AvatarIcon src="/favicon.ico" size={16} />
                      <ExternalLink href="https://oriensx.github.io">
                        个人网站 oriensx.github.io
                      </ExternalLink>
                    </InfoItem>
                    <InfoItem>
                      <TrendingUpDownIcon size={16} />
                      交易分析产品
                      <ExternalLink href="https://tradexcellet.com">
                        Tradexcellet.com
                      </ExternalLink>
                    </InfoItem>
                    <InfoItem>
                      <MessageCircleIcon size={16} />
                      <ExternalLink href="https://lab.logeast.cc/chat">
                        微信聊天生成视频工具
                      </ExternalLink>
                    </InfoItem>
                    <InfoItem>
                      <AudioLinesIcon size={16} />
                      在线音频
                      <ExternalLink href="https://lab.logeast.cc/en/audio-merge">
                        合并
                      </ExternalLink>
                      <ExternalLink href="https://lab.logeast.cc/en/audio-trim">
                        裁剪
                      </ExternalLink>
                      工具
                    </InfoItem>
                    <InfoItem>
                      <SprayCanIcon size={16} />
                      <ExternalLink href="https://orienslu.github.io/magic-lottery/zh/">
                        用于抽奖的库 Magic Lottery
                      </ExternalLink>
                    </InfoItem>
                    <InfoItem>
                      <FigmaIcon size={16} />
                      <ExternalLink href="https://www.figma.com/community/widget/1190104377571373751/uml-table-diagram">
                        Figma UML Table Diagram
                      </ExternalLink>
                    </InfoItem>

                    <InfoItem>
                      <ScanLineIcon size={16} />
                      和公众人物
                      <ExternalLink href="https://github.com/WeDaHub/incubator-scan-stars">
                        比较相似度
                      </ExternalLink>
                      的小程序
                    </InfoItem>
                  </div>
                </Grid.Cell>
              </Grid>
            </Grid.System>
          </div>
        </div>
      </Grid.Cell>
    </Grid>
  );
}

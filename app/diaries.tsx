import type { PostData } from "@/components/blog/post-card";
import { DiaryCover } from "@/app/diary/cover";

/** 日记期次元数据；列表页已改为信息流，此处仅作归档兼容 */
export const diaries: PostData[] = [
  {
    slug: "2026-08",
    href: "/diary",
    title: "2026 年 8 月日记",
    date: "2026-08",
    tag: "2026",
    summary: "记录本月读到、看到与使用过的内容，按条目持续补充。",
    cover: <DiaryCover year={2026} month={8} />,
    coverShape: "square",
  },
  {
    slug: "2026-07",
    href: "/diary",
    title: "2026 年 7 月日记",
    date: "2026-07",
    tag: "2026",
    summary: "记录本月读到、看到与使用过的内容，按条目持续补充。",
    cover: <DiaryCover year={2026} month={7} />,
    coverShape: "square",
  },
];

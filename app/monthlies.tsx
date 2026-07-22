import type { PostData } from "@/components/blog/post-card";
import { MonthlyCover } from "@/app/monthly/cover";

export const monthlies: PostData[] = [
  {
    slug: "2026-07",
    href: "/monthly/2026-07",
    title: "2026 年 7 月刊",
    date: "2026-07",
    tag: "2026",
    summary: "记录本月读到、看到与使用过的内容，按条目持续补充。",
    cover: <MonthlyCover year={2026} month={7} />,
    coverShape: "square",
  },
];

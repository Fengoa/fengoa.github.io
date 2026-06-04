"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// =============================================================================
// 热门召回计分演示：评分人数 × 均分 = 热度分
// =============================================================================

const MOVIES = [
  { name: "肖申克的救赎", viewers: 3100, rating: 4.2 },
  { name: "搏击俱乐部",   viewers: 2400, rating: 4.2 },
  { name: "冷门佳作",     viewers:  500, rating: 4.5 },
];

export function PopularRecallScore() {
  return (
    <VisualFrame title="热门召回计分：评分人数 × 均分 = 热度分">
      <div className="max-w-md mx-auto">
        <motion.table
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full text-xs"
        >
          <thead>
            <tr className="font-mono text-muted-foreground border-b border-neutral-200 dark:border-neutral-800">
              <th className="text-left py-1.5 pr-2 font-normal">电影</th>
              <th className="text-right py-1.5 px-2 font-normal tabular-nums">评分人数</th>
              <th className="text-center py-1.5 px-2 font-normal">×</th>
              <th className="text-right py-1.5 px-2 font-normal tabular-nums">均分</th>
              <th className="text-right py-1.5 pl-2 font-normal tabular-nums">= 热度分</th>
            </tr>
          </thead>
          <tbody>
            {MOVIES.map((m, i) => {
              const score = m.viewers * m.rating;
              const top = i === 0;

              return (
                <tr
                  key={m.name}
                  className="border-b last:border-0 border-neutral-100 dark:border-neutral-900 font-mono tabular-nums"
                >
                  <td
                    className={cn(
                      "py-2 pr-2",
                      top
                        ? "text-emerald-700 dark:text-emerald-300 font-medium"
                        : "text-foreground/70",
                    )}
                  >
                    {m.name}
                  </td>
                  <td className="py-2 px-2 text-right text-foreground/70">
                    {m.viewers.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-center text-muted-foreground/40">
                    ×
                  </td>
                  <td className="py-2 px-2 text-right text-foreground/70">
                    {m.rating}
                  </td>
                  <td
                    className={cn(
                      "py-2 pl-2 text-right tabular-nums",
                      top
                        ? "text-emerald-700 dark:text-emerald-300 font-medium"
                        : "text-foreground/70",
                    )}
                  >
                    {score.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </motion.table>
      </div>
    </VisualFrame>
  );
}

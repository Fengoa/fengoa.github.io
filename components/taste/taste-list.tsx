"use client";

import { useState } from "react";
import { TasteCard, type TasteItem, type TasteCategory } from "./taste-card";
import { Grid } from "@/components/ui/grid";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: TasteCategory[] = [
  "文章",
  "工具",
  "设计",
  "开源",
  "播客",
  "视频",
];

const COLUMNS = 2;

export function TasteList({ items }: { items: TasteItem[] }) {
  const [activeCategory, setActiveCategory] = useState<
    TasteCategory | "全部"
  >("全部");
  const [showCount, setShowCount] = useState(10);

  const existingCategories = ALL_CATEGORIES.filter((cat) =>
    items.some((item) => item.category === cat)
  );

  const filtered =
    activeCategory === "全部"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const displayed = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  const rows = Math.ceil(displayed.length / COLUMNS);

  return (
    <div>
      {/* 分类筛选栏 */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8">
        <button
          onClick={() => {
            setActiveCategory("全部");
            setShowCount(10);
          }}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-sm transition-colors",
            activeCategory === "全部"
              ? "bg-foreground text-background font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          所有帖子
        </button>
        {existingCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setShowCount(10);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm transition-colors",
              activeCategory === cat
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid 列表 */}
      {displayed.length > 0 ? (
        <Grid rows={rows} columns={COLUMNS}>
          <AnimatedBackground
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.6,
            }}
            enableHover
            className="bg-black/2 dark:bg-white/4"
          >
            {displayed.map((item, index) => {
              const col = (index % COLUMNS) + 1;
              const row = Math.floor(index / COLUMNS) + 1;
              return (
                <div
                  key={item.id}
                  data-id={item.id}
                  className="taste-grid-cell"
                  style={{
                    gridRow: `${row} / span 1`,
                    gridColumn: `${col} / span 1`,
                  }}
                >
                  <TasteCard item={item} />
                </div>
              );
            })}
          </AnimatedBackground>
        </Grid>
      ) : (
        <div className="py-20 text-center text-muted-foreground text-sm border border-border">
          暂无内容
        </div>
      )}

      {/* 显示更多 */}
      {hasMore && (
        <div className="pt-10 text-center">
          <button
            onClick={() => setShowCount((prev) => prev + 10)}
            className="px-6 py-2.5 rounded-full text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
          >
            显示更多
          </button>
        </div>
      )}
    </div>
  );
}

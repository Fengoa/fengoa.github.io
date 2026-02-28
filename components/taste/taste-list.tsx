"use client";

import { useState } from "react";
import { TasteCard, type TasteCategory } from "./taste-card";
import { Grid } from "@/components/ui/grid";
import { cn } from "@/lib/utils";
import type { TasteCategoryGroup } from "./taste-data";

const ALL_CATEGORIES: TasteCategory[] = [
  "文章",
  "工具",
  "设计",
  "开源",
  "播客",
  "视频",
];

const COLUMNS = 2;

export function TasteList({
  categories,
}: {
  categories: TasteCategoryGroup[];
}) {
  const [activeCategory, setActiveCategory] = useState<
    TasteCategory | "全部"
  >("全部");
  const [showCount, setShowCount] = useState(10);

  const allItems = categories.flatMap((cat) => cat.items);

  const existingCategories = ALL_CATEGORIES.filter((cat) =>
    allItems.some((item) => item.category === cat)
  );

  const filtered =
    activeCategory === "全部"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  const displayed = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  const rows = Math.ceil(displayed.length / COLUMNS);

  return (
    <div>
      {/* 分类筛选栏 */}
      <Grid rows={1} columns={12}>
        <Grid.Cell row={1} column={1} colSpan={12}>
          <div className="flex flex-wrap items-center gap-1.5 mb-8 px-6 sm:px-8 lg:px-10">
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
              全部
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
        </Grid.Cell>
      </Grid>

      {/* Grid 列表 */}
      {displayed.length > 0 ? (
        <Grid rows={rows} columns={COLUMNS}>
          {displayed.map((item, index) => {
            const col = (index % COLUMNS) + 1;
            const row = Math.floor(index / COLUMNS) + 1;
            return (
              <Grid.Cell
                key={item.id}
                data-id={item.id}
                row={row}
                column={col}
              >
                <TasteCard item={item} />
              </Grid.Cell>
            );
          })}
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

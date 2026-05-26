import { Grid } from "@/components/ui/grid";
import { cn } from "@/lib/utils";

// 每个标签选中时的颜色
const TAG_COLORS: Record<string, string> = {
  "全部": "bg-neutral-100 dark:bg-neutral-800/60",
  "推荐": "bg-orange-100 dark:bg-orange-900/40",
  "大模型": "bg-violet-100 dark:bg-violet-900/40",
  "推荐系统": "bg-cyan-100 dark:bg-cyan-900/40",
  "机器学习": "bg-sky-100 dark:bg-sky-900/40",
  "数学": "bg-amber-100 dark:bg-amber-900/40",
  "资源": "bg-emerald-100 dark:bg-emerald-900/40",
  "建站": "bg-rose-100 dark:bg-rose-900/40",
  "生活": "bg-pink-100 dark:bg-pink-900/40",
};

interface BlogHeroProps {
  tags?: string[];
  activeTag?: string;
  onTagChange?: (tag: string) => void;
  /** 每个标签对应的文章数量 */
  tagCounts?: Record<string, number>;
}

export function BlogHero({ tags, activeTag, onTagChange, tagCounts }: BlogHeroProps) {
  // 计算居中偏移：6个标签占6格，从第4列开始（12列中居中）
  const tagCount = tags?.length ?? 0;
  const startCol = Math.floor((12 - tagCount) / 2) + 1;

  return (
    <>
      {/* 第 1 行：12 列空格子 */}
      <Grid rows={1} columns={12}>
        {Array.from({ length: 12 }, (_, i) => (
          <Grid.Cell
            key={`r1-${i}`}
            row={1}
            column={i + 1}
            className="aspect-square"
          />
        ))}
        <Grid.Cross row={1} column={1} />
      </Grid>

      {/* 第 2 行：12 列，左 1 空 + 中间 10 格放文字 + 右 1 空 */}
      <Grid
        rows={1}
        columns={12}
        mergedAreas={[{ row: 1, column: 2, colSpan: 10 }]}
      >
        <Grid.Cell row={1} column={1} />
        <Grid.Cell row={1} column={12} />
      </Grid>

      {/* 第 3 行：标签筛选 */}
      {/* 移动端：横向滚动 flex */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-y border-border/40">
        <div className="flex items-center gap-0 min-w-max">
          {tags?.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange?.(tag)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-3",
                "text-xs font-mono transition-colors duration-200 whitespace-nowrap",
                activeTag === tag
                  ? cn(TAG_COLORS[tag] || "bg-neutral-100 dark:bg-neutral-800/60", "text-foreground")
                  : "text-muted-foreground"
              )}
            >
              <span>{tag}</span>
              {tagCounts && (
                <span className="text-[10px] opacity-60">
                  {tagCounts[tag] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 桌面端：Grid 格子 */}
      <div className="hidden md:block">
        <Grid rows={1} columns={12}>
          {tags && tags.length > 0 ? (
            <>
              {/* 左侧空格子 */}
              {Array.from({ length: startCol - 1 }, (_, i) => (
                <Grid.Cell
                  key={`r3-left-${i}`}
                  row={1}
                  column={i + 1}
                  className="aspect-square"
                />
              ))}
              {/* 标签格子 */}
              {tags.map((tag, i) => (
                <Grid.Cell
                  key={tag}
                  row={1}
                  column={startCol + i}
                  className="aspect-square"
                >
                  <button
                    onClick={() => onTagChange?.(tag)}
                    className={cn(
                      "size-full flex flex-col items-center justify-center gap-1",
                      "text-xs font-mono transition-colors duration-200",
                      "hover:bg-foreground/[0.03] dark:hover:bg-foreground/[0.05]",
                      activeTag === tag
                        ? cn(TAG_COLORS[tag] || "bg-neutral-100 dark:bg-neutral-800/60", "text-foreground")
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{tag}</span>
                    {tagCounts && (
                      <span className="text-[10px] opacity-60">
                        {tagCounts[tag] ?? 0}
                      </span>
                    )}
                  </button>
                </Grid.Cell>
              ))}
              {/* 右侧空格子 */}
              {Array.from({ length: 12 - (startCol - 1) - tagCount }, (_, i) => (
                <Grid.Cell
                  key={`r3-right-${i}`}
                  row={1}
                  column={startCol + tagCount + i}
                  className="aspect-square"
                />
              ))}
            </>
          ) : (
            Array.from({ length: 12 }, (_, i) => (
              <Grid.Cell
                key={`r3-${i}`}
                row={1}
                column={i + 1}
                className="aspect-square"
              />
            ))
          )}
          <Grid.Cross row={1} column={12} anchor="bottom-right" />
        </Grid>
      </div>
    </>
  );
}

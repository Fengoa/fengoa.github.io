import { Grid } from "@/components/ui/grid";
import { cn } from "@/lib/utils";

// 每个标签选中时的颜色（按 id）
const TAG_COLORS: Record<string, string> = {
  "all": "bg-neutral-100 dark:bg-neutral-800/60",
  "picks": "bg-orange-100 dark:bg-orange-900/40",
  "llm": "bg-violet-100 dark:bg-violet-900/40",
  "recsys": "bg-cyan-100 dark:bg-cyan-900/40",
  "ml": "bg-sky-100 dark:bg-sky-900/40",
  "math": "bg-amber-100 dark:bg-amber-900/40",
  "resources": "bg-emerald-100 dark:bg-emerald-900/40",
  "dev": "bg-rose-100 dark:bg-rose-900/40",
};

export interface TagItem {
  id: string;
  label: string;
}

interface BlogHeroProps {
  tags?: TagItem[];
  activeTag?: string;
  onTagChange?: (id: string) => void;
  /** 每个标签 id 对应的文章数量 */
  tagCounts?: Record<string, number>;
}

export function BlogHero({ tags, activeTag, onTagChange, tagCounts }: BlogHeroProps) {
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

      {/* 第 2 行 */}
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
      <div className="md:hidden overflow-x-auto scrollbar-hide border-x border-b border-border">
        <div className="flex items-center gap-0 min-w-max">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagChange?.(tag.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-3",
                "text-xs font-mono transition-colors duration-200 whitespace-nowrap",
                "border-r border-border last:border-r-0",
                activeTag === tag.id
                  ? cn(TAG_COLORS[tag.id] || "bg-neutral-100 dark:bg-neutral-800/60", "text-foreground")
                  : "text-muted-foreground"
              )}
            >
              <span>{tag.label}</span>
              {tagCounts && (
                <span className="text-xs opacity-60">
                  {tagCounts[tag.id] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 桌面端：Grid 格子 */}
      <div className="hidden md:block">
        <Grid rows={1} columns={12} hideTopBorder>
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
                  key={tag.id}
                  row={1}
                  column={startCol + i}
                  className="aspect-square"
                >
                  <button
                    onClick={() => onTagChange?.(tag.id)}
                    className={cn(
                      "size-full flex flex-col items-center justify-center gap-1",
                      "text-xs font-mono transition-colors duration-200",
                      "hover:bg-foreground/[0.03] dark:hover:bg-foreground/[0.05]",
                      activeTag === tag.id
                        ? cn(TAG_COLORS[tag.id] || "bg-neutral-100 dark:bg-neutral-800/60", "text-foreground")
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{tag.label}</span>
                    {tagCounts && (
                      <span className="text-xs opacity-60">
                        {tagCounts[tag.id] ?? 0}
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

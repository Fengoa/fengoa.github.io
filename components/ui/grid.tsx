import { type ReactNode, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Grid.System — 页面根级容器，通过 CSS 变量继承传递 guideWidth        */
/* ------------------------------------------------------------------ */

interface GridSystemProps {
  guideWidth?: number;
  children: ReactNode;
  className?: string;
}

function GridSystem({
  guideWidth = 1,
  children,
  className,
}: GridSystemProps) {
  return (
    <div
      className={cn("flex flex-col [&>.grid+.grid]:mt-[calc(var(--guide-width)*-1)]", className)}
      style={{ "--guide-width": `${guideWidth}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid — 网格容器，自动生成参考线                                     */
/* ------------------------------------------------------------------ */

/** 描述一个合并区域，参考线层会隐藏其内部边框 */
export interface MergedArea {
  row: number;
  column: number;
  rowSpan?: number;
  colSpan?: number;
}

interface GridProps {
  rows: number;
  columns: number;
  children?: ReactNode;
  className?: string;
  guideWidth?: number;
  /** 合并区域列表，参考线层会自动隐藏这些区域内部的边框线 */
  mergedAreas?: MergedArea[];
}

/**
 * 判断格子 (x, y) 在合并区域内时，哪些边框需要隐藏。
 * 隐藏规则：合并区域内部的竖线和横线都不画，但区域最右列的右边框和最底行的底边框保留。
 */
function getHiddenBorders(
  x: number,
  y: number,
  areas: MergedArea[]
): { hideRight: boolean; hideBottom: boolean } {
  let hideRight = false;
  let hideBottom = false;
  for (const area of areas) {
    const rs = area.rowSpan ?? 1;
    const cs = area.colSpan ?? 1;
    const colStart = area.column;
    const colEnd = area.column + cs - 1;
    const rowStart = area.row;
    const rowEnd = area.row + rs - 1;

    if (x >= colStart && x <= colEnd && y >= rowStart && y <= rowEnd) {
      // 不是最右列 → 隐藏右边框
      if (x < colEnd) hideRight = true;
      // 不是最底行 → 隐藏底边框
      if (y < rowEnd) hideBottom = true;
    }
  }
  return { hideRight, hideBottom };
}

export function Grid({
  rows,
  columns,
  children,
  className,
  guideWidth,
  mergedAreas,
}: GridProps) {
  const gw = guideWidth != null ? `${guideWidth}px` : "var(--guide-width, 1px)";

  return (
    <div
      className={cn("grid relative", className)}
      style={
        {
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, auto)`,
          borderTop: `${gw} solid var(--border)`,
          borderLeft: `${gw} solid var(--border)`,
          "--gw": gw,
        } as CSSProperties
      }
    >
      {/* 参考线层 — display:contents 让子元素直接参与 Grid 布局 */}
      <div className="contents">
        {Array.from({ length: rows * columns }, (_, index) => {
          const x = (index % columns) + 1;
          const y = Math.floor(index / columns) + 1;

          const { hideRight, hideBottom } = mergedAreas
            ? getHiddenBorders(x, y, mergedAreas)
            : { hideRight: false, hideBottom: false };

          return (
            <div
              key={index}
              className="absolute inset-0 z-[2] pointer-events-none"
              style={
                {
                  gridColumnStart: x,
                  gridColumnEnd: "span 1",
                  gridRowStart: y,
                  gridRowEnd: "span 1",
                  borderRight: hideRight ? "none" : `var(--gw, 1px) solid var(--border)`,
                  borderBottom: hideBottom ? "none" : `var(--gw, 1px) solid var(--border)`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid.Cell — 内容单元格，指定行列位置                                */
/* ------------------------------------------------------------------ */

interface GridCellProps extends HTMLAttributes<HTMLDivElement> {
  row: number | "auto";
  column: number | "auto";
  rowSpan?: number;
  colSpan?: number;
  children?: ReactNode;
  className?: string;
}

function GridCell({
  row,
  column,
  rowSpan = 1,
  colSpan = 1,
  children,
  className,
  style,
  ...rest
}: GridCellProps) {
  return (
    <div
      className={cn("relative z-[1] min-w-0", className)}
      style={{
        gridRow:
          row === "auto" ? "auto" : `${row} / span ${rowSpan}`,
        gridColumn:
          column === "auto" ? "auto" : `${column} / span ${colSpan}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid.Cross — 网格交叉点的十字装饰                                   */
/* ------------------------------------------------------------------ */

type CrossAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface GridCrossProps {
  row: number;
  column: number;
  anchor?: CrossAnchor;
  className?: string;
}

const anchorStyles: Record<CrossAnchor, { position: CSSProperties; translate: string }> = {
  "top-left": {
    position: { top: "calc(var(--gw, 1px) * -0.5)", left: "calc(var(--gw, 1px) * -0.5)" },
    translate: "-translate-x-1/2 -translate-y-1/2",
  },
  "top-right": {
    position: { top: "calc(var(--gw, 1px) * -0.5)", right: "calc(var(--gw, 1px) * 0.5)" },
    translate: "translate-x-1/2 -translate-y-1/2",
  },
  "bottom-left": {
    position: { bottom: "calc(var(--gw, 1px) * 0.5)", left: "calc(var(--gw, 1px) * -0.5)" },
    translate: "-translate-x-1/2 translate-y-1/2",
  },
  "bottom-right": {
    position: { bottom: "calc(var(--gw, 1px) * 0.5)", right: "calc(var(--gw, 1px) * 0.5)" },
    translate: "translate-x-1/2 translate-y-1/2",
  },
};

function GridCross({ row, column, anchor = "top-left", className }: GridCrossProps) {
  const { position, translate } = anchorStyles[anchor];

  return (
    <div
      className={cn(
        "absolute inset-0 z-3 pointer-events-none text-secondary-foreground",
        className
      )}
      style={{ gridRow: row, gridColumn: column } as CSSProperties}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        className={cn("absolute", translate)}
        style={position}
      >
        <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  复合导出                                                            */
/* ------------------------------------------------------------------ */

Grid.System = GridSystem;
Grid.Cell = GridCell;
Grid.Cross = GridCross;

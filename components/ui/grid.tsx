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

function GridSystem({ guideWidth = 1, children, className }: GridSystemProps) {
  return (
    <div
      className={cn(
        "flex flex-col [&>.grid+.grid]:mt-[calc(var(--guide-width)*-1)]",
        className
      )}
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
  /** 移动端列数（< md），不传则与 columns 相同 */
  smColumns?: number;
  /** 移动端行数（< md），不传则根据内容自动 */
  smRows?: number;
  /** 移动端合并区域 */
  smMergedAreas?: MergedArea[];
  children?: ReactNode;
  className?: string;
  guideWidth?: number;
  /** 合并区域列表，参考线层会自动隐藏这些区域内部的边框线 */
  mergedAreas?: MergedArea[];
}

/**
 * 判断格子 (x, y) 在合并区域内时，哪些边框需要隐藏。
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
      if (x < colEnd) hideRight = true;
      if (y < rowEnd) hideBottom = true;
    }
  }
  return { hideRight, hideBottom };
}

function generateGuides(
  rows: number,
  columns: number,
  mergedAreas?: MergedArea[]
) {
  return Array.from({ length: rows * columns }, (_, index) => {
    const x = (index % columns) + 1;
    const y = Math.floor(index / columns) + 1;

    const { hideRight, hideBottom } = mergedAreas
      ? getHiddenBorders(x, y, mergedAreas)
      : { hideRight: false, hideBottom: false };

    return { x, y, hideRight, hideBottom };
  });
}

export function Grid({
  rows,
  columns,
  smColumns,
  smRows,
  smMergedAreas,
  children,
  className,
  guideWidth,
  mergedAreas,
}: GridProps) {
  const gw = guideWidth != null ? `${guideWidth}px` : "var(--guide-width, 1px)";
  const hasResponsive = smColumns != null && smColumns !== columns;

  // 桌面端参考线
  const desktopGuides = generateGuides(rows, columns, mergedAreas);
  // 移动端参考线
  const mobileGuides = hasResponsive
    ? generateGuides(smRows ?? rows, smColumns!, smMergedAreas)
    : null;

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
          ...(hasResponsive
            ? {
                "--sm-cols": smColumns,
                "--sm-rows": smRows ?? rows,
              }
            : {}),
        } as CSSProperties
      }
    >
      {/* 桌面端参考线 */}
      <div className={cn("contents", hasResponsive && "max-md:hidden")}>
        {desktopGuides.map(({ x, y, hideRight, hideBottom }, i) => (
          <div
            key={`d-${i}`}
            className="absolute inset-0 z-2 pointer-events-none"
            style={
              {
                gridColumnStart: x,
                gridColumnEnd: "span 1",
                gridRowStart: y,
                gridRowEnd: "span 1",
                borderRight: hideRight
                  ? "none"
                  : `var(--gw, 1px) solid var(--border)`,
                borderBottom: hideBottom
                  ? "none"
                  : `var(--gw, 1px) solid var(--border)`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* 移动端参考线 */}
      {mobileGuides && (
        <div className="contents md:hidden">
          {mobileGuides.map(({ x, y, hideRight, hideBottom }, i) => (
            <div
              key={`m-${i}`}
              className="absolute inset-0 z-2 pointer-events-none"
              style={
                {
                  gridColumnStart: x,
                  gridColumnEnd: "span 1",
                  gridRowStart: y,
                  gridRowEnd: "span 1",
                  borderRight: hideRight
                    ? "none"
                    : `var(--gw, 1px) solid var(--border)`,
                  borderBottom: hideBottom
                    ? "none"
                    : `var(--gw, 1px) solid var(--border)`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* 响应式 gridTemplateColumns 覆盖 — 用 style 标签注入媒体查询 */}
      {hasResponsive && (
        <style>{`
          @media (max-width: 767px) {
            .grid:has(> [data-responsive="${smColumns}-${smRows ?? rows}"]) {
              grid-template-columns: repeat(${smColumns}, minmax(0, 1fr)) !important;
              grid-template-rows: repeat(${smRows ?? rows}, auto) !important;
            }
          }
        `}</style>
      )}
      {hasResponsive && (
        <div
          data-responsive={`${smColumns}-${smRows ?? rows}`}
          className="hidden"
        />
      )}

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
  /** 移动端行位置 */
  smRow?: number | "auto";
  /** 移动端列位置 */
  smColumn?: number | "auto";
  /** 移动端行跨度 */
  smRowSpan?: number;
  /** 移动端列跨度 */
  smColSpan?: number;
  children?: ReactNode;
  className?: string;
}

function GridCell({
  row,
  column,
  rowSpan = 1,
  colSpan = 1,
  smRow,
  smColumn,
  smRowSpan,
  smColSpan,
  children,
  className,
  style,
  ...rest
}: GridCellProps) {
  const hasResponsive =
    smRow != null || smColumn != null || smRowSpan != null || smColSpan != null;

  const mRow = smRow ?? row;
  const mCol = smColumn ?? column;
  const mRowSpan = smRowSpan ?? rowSpan;
  const mColSpan = smColSpan ?? colSpan;

  // 如果有响应式，用 CSS 变量 + 媒体查询
  const cellId = hasResponsive
    ? `cell-${mRow}-${mCol}-${row}-${column}`
    : undefined;

  return (
    <>
      {hasResponsive && (
        <style>{`
          @media (max-width: 767px) {
            [data-cell-id="${cellId}"] {
              grid-row: ${
                mRow === "auto" ? "auto" : `${mRow} / span ${mRowSpan}`
              } !important;
              grid-column: ${
                mCol === "auto" ? "auto" : `${mCol} / span ${mColSpan}`
              } !important;
            }
          }
        `}</style>
      )}
      <div
        data-cell-id={cellId}
        className={cn("relative z-1 min-w-0", className)}
        style={{
          gridRow: row === "auto" ? "auto" : `${row} / span ${rowSpan}`,
          gridColumn:
            column === "auto" ? "auto" : `${column} / span ${colSpan}`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </>
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

const anchorStyles: Record<
  CrossAnchor,
  { position: CSSProperties; translate: string }
> = {
  "top-left": {
    position: {
      top: "calc(var(--gw, 1px) * -0.5)",
      left: "calc(var(--gw, 1px) * -0.5)",
    },
    translate: "-translate-x-1/2 -translate-y-1/2",
  },
  "top-right": {
    position: {
      top: "calc(var(--gw, 1px) * -0.5)",
      right: "calc(var(--gw, 1px) * 0.5)",
    },
    translate: "translate-x-1/2 -translate-y-1/2",
  },
  "bottom-left": {
    position: {
      bottom: "calc(var(--gw, 1px) * 0.5)",
      left: "calc(var(--gw, 1px) * -0.5)",
    },
    translate: "-translate-x-1/2 translate-y-1/2",
  },
  "bottom-right": {
    position: {
      bottom: "calc(var(--gw, 1px) * 0.5)",
      right: "calc(var(--gw, 1px) * 0.5)",
    },
    translate: "translate-x-1/2 translate-y-1/2",
  },
};

function GridCross({
  row,
  column,
  anchor = "top-left",
  className,
}: GridCrossProps) {
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
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={cn("absolute", translate)}
        style={position}
      >
        <path d="M10 0V20M0 10H20" stroke="currentColor" strokeWidth="0.6" />
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

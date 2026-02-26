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
      className={className}
      style={{ "--guide-width": `${guideWidth}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid — 网格容器，自动生成参考线                                     */
/* ------------------------------------------------------------------ */

interface GridProps {
  rows: number;
  columns: number;
  children?: ReactNode;
  className?: string;
  guideWidth?: number;
}

export function Grid({
  rows,
  columns,
  children,
  className,
  guideWidth,
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
                  borderRight: `var(--gw, 1px) solid var(--border)`,
                  borderBottom: `var(--gw, 1px) solid var(--border)`,
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

interface GridCrossProps {
  row: number;
  column: number;
  className?: string;
}

function GridCross({ row, column, className }: GridCrossProps) {
  return (
    <div
      className={cn(
        "relative z-2 flex items-start justify-start pointer-events-none",
        className
      )}
      style={{ gridRow: row, gridColumn: column } as CSSProperties}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        className="absolute text-border -translate-x-1/2 -translate-y-1/2"
        style={
          {
            top: "calc(var(--gw, 1px) * -0.5)",
            left: "calc(var(--gw, 1px) * -0.5)",
          } as CSSProperties
        }
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

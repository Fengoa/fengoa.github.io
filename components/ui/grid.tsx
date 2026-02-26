import { type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Grid                                                               */
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
  guideWidth = 1,
}: GridProps) {
  return (
    <div
      className={cn("taste-grid", className)}
      style={
        {
          "--rows": rows,
          "--columns": columns,
          "--guide-width": `${guideWidth}px`,
        } as CSSProperties
      }
    >
      {/* Guide layer — uses display:contents so guides participate
          in the parent grid without adding a wrapper level */}
      <div className="taste-grid-guides">
        {Array.from({ length: rows * columns }, (_, index) => {
          const x = (index % columns) + 1;
          const y = Math.floor(index / columns) + 1;
          return (
            <div
              key={index}
              className="taste-grid-guide"
              style={{ "--x": x, "--y": y } as CSSProperties}
            />
          );
        })}
      </div>
      {/* Content cells render here */}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid.Cell                                                          */
/* ------------------------------------------------------------------ */

interface GridCellProps {
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
}: GridCellProps) {
  return (
    <div
      className={cn("taste-grid-cell", className)}
      style={{
        gridRow:
          row === "auto"
            ? "auto"
            : `${row} / span ${rowSpan}`,
        gridColumn:
          column === "auto"
            ? "auto"
            : `${column} / span ${colSpan}`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid.Cross                                                         */
/* ------------------------------------------------------------------ */

interface GridCrossProps {
  row: number;
  column: number;
  className?: string;
}

function GridCross({ row, column, className }: GridCrossProps) {
  return (
    <div
      className={cn("taste-grid-cross", className)}
      style={
        {
          gridRow: row,
          gridColumn: column,
        } as CSSProperties
      }
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        className="text-border"
      >
        <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compound export                                                    */
/* ------------------------------------------------------------------ */

Grid.Cell = GridCell;
Grid.Cross = GridCross;

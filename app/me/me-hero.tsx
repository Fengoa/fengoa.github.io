"use client";

import { Grid } from "@/components/ui/grid";
import { DownloadButton } from "./download-button";

interface MeHeroProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
}

export function MeHero({ resumeRef }: MeHeroProps) {
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
      </Grid>

      {/* 第 2 行：12 列，左 1 空 + 中间 10 格放文字 + 右 1 空 */}
      <Grid
        rows={1}
        columns={12}
        mergedAreas={[{ row: 1, column: 2, colSpan: 10 }]}
      >
        <Grid.Cross row={1} column={2} />
        <Grid.Cross row={2} column={12} />
        <Grid.Cell row={1} column={1} />
        <Grid.Cell row={1} column={2} colSpan={10}>
          <div className="flex items-center flex-col justify-center p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Oriensx.
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              我在做出伟大产品的路上持续耕耘。
            </p>
            <DownloadButton targetRef={resumeRef} />
          </div>
        </Grid.Cell>
        <Grid.Cell row={1} column={12} />
      </Grid>
    </>
  );
}

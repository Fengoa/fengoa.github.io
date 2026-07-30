import { Grid } from "@/components/ui/grid";

export function ProductHero() {
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
        <Grid.Cell row={1} column={2} colSpan={10}>
          <div className="flex flex-col items-center justify-center py-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground text-center">
              一些小玩意
            </h1>
            <p className="text-secondary-foreground text-center max-w-md mt-4">
              独立项目与开源工具。
            </p>
          </div>
        </Grid.Cell>
        <Grid.Cell row={1} column={12} />
      </Grid>

      {/* 第 3 行：12 列空格子 */}
      <Grid rows={1} columns={12}>
        {Array.from({ length: 12 }, (_, i) => (
          <Grid.Cell
            key={`r3-${i}`}
            row={1}
            column={i + 1}
            className="aspect-square"
          />
        ))}
        <Grid.Cross row={1} column={12} anchor="bottom-right" />
      </Grid>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Grid } from "@/components/ui/grid";
import { CodeBlock } from "./code-block";

const INSTALL = "go install github.com/oriensx/create-gin-api@latest";
const GITHUB = "https://github.com/oriensx/create-gin-api";

export function CreateGinApiHero() {
  const reduce = useReducedMotion();

  return (
    <>
      <Link
        href="/product"
        className="mb-10 -ml-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        返回产品列表
      </Link>
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

      <Grid
        rows={1}
        columns={12}
        mergedAreas={[{ row: 1, column: 2, colSpan: 10 }]}
      >
        <Grid.Cell row={1} column={1} />
        <Grid.Cell row={1} column={2} colSpan={10}>
          <div className="flex flex-col items-center py-10 md:py-14">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full max-w-2xl flex-col items-center"
            >
              <p className="mb-3 font-mono text-xs text-muted-foreground">
                CLI · Go 1.25+ · MIT
              </p>

              <h1 className="text-center font-mono text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                create-gin-api
              </h1>

              <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-secondary-foreground md:text-base text-pretty">
                生成 Gin API 项目骨架。模板含{" "}
                <strong>GORM / Postgres</strong>、Redis、Zap、Air、Swagger 与
                Docker Compose；支持交互式填写与本地 / 容器两种启动方式。
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded border bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
                >
                  GitHub
                  <ArrowUpRight className="size-3.5" />
                </a>
                <a
                  href="#install"
                  className="inline-flex items-center gap-1.5 rounded border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  安装与用法
                </a>
              </div>

              <div className="mt-6 w-full">
                <CodeBlock code={INSTALL} language="bash" />
              </div>
            </motion.div>
          </div>
        </Grid.Cell>
        <Grid.Cell row={1} column={12} />
      </Grid>

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

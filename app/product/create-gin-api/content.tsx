"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CodeBlock } from "./code-block";

const STACK = [
  "Gin",
  "GORM / Postgres",
  "Redis",
  "Zap",
  "Air",
  "Swagger",
  "Docker",
] as const;

const FLAGS = [
  {
    flag: "-module",
    def: "<name>",
    meaning: "Go module path",
  },
  {
    flag: "-out",
    def: ".",
    meaning: "父目录，新项目写在其下",
  },
  {
    flag: "-title",
    def: "由 name 推导",
    meaning: "Swagger / API 标题",
  },
  {
    flag: "-desc",
    def: "Gin API server for <name>",
    meaning: "Swagger 描述",
  },
] as const;

const ENDPOINTS = [
  {
    method: "GET",
    path: "/health",
    desc: "存活探针；已配置 Redis 时会 Ping",
  },
  {
    method: "GET",
    path: "/hello",
    desc: "示例业务接口，经 service 层返回问候语",
  },
  {
    method: "GET",
    path: "/swagger/index.html",
    desc: "Swagger UI",
  },
] as const;

const LAYOUT = `cmd/server/               # 入口（package main）
docs/                     # swag 生成的 OpenAPI
internal/
  config/                 # 环境变量
  database/               # GORM + Postgres
  redis/                  # go-redis
  handler/                # HTTP handlers
  logger/                 # Zap
  router/                 # 路由组装
  service/                # 业务逻辑
Dockerfile                # 多阶段镜像
docker-compose.yml        # api + Postgres + Redis
Makefile / .air.toml / .env.example`;

const CLI_SAMPLE = `✔ Creating project in /path/my-api
✔ Downloading Go modules
✔ Generating Swagger docs

Success! Created my-api at /path/my-api
  module  my-api
  title   My Api API

Inside that directory, you can run several commands:

  make run
    Start the API server locally.

  make docker-up
    Build and start api + Postgres + Redis.

We suggest that you begin by typing:

  cd my-api
  cp .env.example .env
  make run`;

function Section({
  id,
  title,
  children,
  delay = 0,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="scroll-mt-24 border-t py-10 md:py-12"
    >
      <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl text-balance">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-secondary-foreground md:text-base text-pretty">
        {children}
      </div>
    </motion.section>
  );
}

export function CreateGinApiContent() {
  return (
    <div className="mx-auto max-w-2xl px-1 md:px-2">
      <Section title="这是什么" delay={0.05}>
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            create-gin-api
          </code>{" "}
          是 Go CLI 脚手架。写出可直接编译的 Gin API
          目录：handler → service → database / redis
          分层已搭好，并带上环境变量、Makefile、Air、Swagger 与 Docker
          Compose。
        </p>
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            DATABASE_URL
          </code>{" "}
          与{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            REDIS_URL
          </code>{" "}
          在本地运行时可选；Compose 启动时会注入 Postgres 与 Redis
          服务地址。
        </p>
      </Section>

      <Section id="install" title="安装" delay={0.08}>
        <p>需要 Go 1.25 及以上。安装最新 semver tag：</p>
        <CodeBlock code="go install github.com/oriensx/create-gin-api@latest" />
        <p>
          打完新 tag 并{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            git push origin vX.Y.Z
          </code>{" "}
          后，本机需再执行一次{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            go install …@latest
          </code>
          ；已装二进制不会自动替换。急用可{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            GOPROXY=direct
          </code>
          。
        </p>
        <p>或克隆仓库本地执行：</p>
        <CodeBlock
          code={`git clone https://github.com/oriensx/create-gin-api.git
cd create-gin-api
go install .
# 或：go run . <name>`}
        />
      </Section>

      <Section title="用法" delay={0.1}>
        <p>
          <strong>TTY 下不带项目名</strong>
          ，进入交互模式：依次询问 name、module、父目录、title、description；回车采用括号内默认值。已传 flag 会作为默认值。
        </p>
        <CodeBlock
          code={`create-gin-api
create-gin-api my-api
create-gin-api -module github.com/acme/my-api my-api
create-gin-api -out ~/work -title "Order Service API" order-svc`}
        />
        <p>
          Flag 写在{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            &lt;name&gt;
          </code>{" "}
          之前。项目名须匹配{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            ^[a-z][a-z0-9-]*$
          </code>
          。非 TTY 且无{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            &lt;name&gt;
          </code>{" "}
          时打印 Usage 并退出。
        </p>

        <div className="overflow-x-auto rounded border">
          <table className="w-full min-w-lg text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Flag</th>
                <th className="px-3 py-2 font-medium">默认</th>
                <th className="px-3 py-2 font-medium">含义</th>
              </tr>
            </thead>
            <tbody>
              {FLAGS.map((row) => (
                <tr key={row.flag} className="border-b last:border-0">
                  <td className="px-3 py-2.5 font-mono text-xs text-foreground">
                    {row.flag}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {row.def}
                  </td>
                  <td className="px-3 py-2.5 text-secondary-foreground">
                    {row.meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="生成之后" delay={0.12}>
        <CodeBlock
          code={`cd my-api
cp .env.example .env
make run              # 本地启动
make docker-up        # api + Postgres + Redis
make swagger          # 若生成时 PATH 中没有 swag
make docker-down      # 停止 Compose`}
        />
        <p>可选开发工具：</p>
        <CodeBlock
          code={`go install github.com/air-verse/air@latest
go install github.com/swaggo/swag/cmd/swag@latest`}
        />
        <p className="text-muted-foreground">
          写入文件后执行{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            go mod tidy
          </code>
          ；若已安装{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            swag
          </code>
          ，继续生成 docs。任一步失败则退出非零，不打印 Success。子进程日志默认静默，失败时再输出。
        </p>
      </Section>

      <Section title="CLI 输出" delay={0.13}>
        <p>
          进度与 Success 文案接近 create-next-app：勾选步骤、命令说明、建议的{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            cd
          </code>{" "}
          /{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            make run
          </code>
          。设置{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            NO_COLOR
          </code>{" "}
          可关闭颜色。
        </p>
        <CodeBlock code={CLI_SAMPLE} language="text" />
      </Section>

      <Section title="生成项目结构" delay={0.14}>
        <p>默认目录大致如下：</p>
        <CodeBlock code={LAYOUT} language="text" />
        <p>
          Make 目标：{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            tidy
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            build
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            run
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            dev
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            swagger
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            test
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docker-build
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docker-up
          </code>
          、{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docker-down
          </code>
          。
        </p>
      </Section>

      <Section title="Docker" delay={0.15}>
        <p>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            make docker-up
          </code>{" "}
          构建 API 镜像，并启动 Postgres 16 与 Redis 7；健康检查通过后再起
          api。Compose 内{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            DATABASE_URL
          </code>{" "}
          /{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            REDIS_URL
          </code>{" "}
          指向服务名{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            postgres
          </code>{" "}
          /{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            redis
          </code>
          。宿主端口默认{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            8080
          </code>
          （可用环境变量{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            PORT
          </code>{" "}
          覆盖发布映射）。
        </p>
      </Section>

      <Section title="预置接口" delay={0.16}>
        <div className="overflow-x-auto rounded border">
          <table className="w-full min-w-md text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">方法</th>
                <th className="px-3 py-2 font-medium">路径</th>
                <th className="px-3 py-2 font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((row) => (
                <tr key={row.path} className="border-b last:border-0">
                  <td className="px-3 py-2.5 font-mono text-xs text-foreground">
                    {row.method}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {row.path}
                  </td>
                  <td className="px-3 py-2.5 text-secondary-foreground">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="技术栈" delay={0.18}>
        <ul className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="rounded border px-3 py-1.5 font-mono text-xs text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground">
          改生成物：编辑脚手架仓库{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            internal/scaffold/template/
          </code>
          。维护说明见{" "}
          <a
            href="https://github.com/oriensx/create-gin-api/blob/main/DEVELOP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            DEVELOP.md
          </a>
          。
        </p>
      </Section>

      <Section title="许可" delay={0.2}>
        <p>
          MIT。源码：{" "}
          <a
            href="https://github.com/oriensx/create-gin-api"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs underline underline-offset-2 transition-colors hover:text-foreground"
          >
            github.com/oriensx/create-gin-api
          </a>
        </p>
      </Section>
    </div>
  );
}

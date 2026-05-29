"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualFrame } from "./frame";

// 4 层架构：
// 1. Client（手机/Web）
// 2. Nginx 负载均衡
// 3. vLLM 三个实例（GPU 1/2/3）
// 4. 共享存储（模型权重）

const W = 600;
const H = 360;

export function DeploymentArchitectureDiagram() {
  const [reqIdx, setReqIdx] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  // 模拟一个请求每隔 800ms 来一次，轮流落到 3 个 GPU
  useEffect(() => {
    const timer = setInterval(() => {
      setReqIdx((i) => (i + 1) % 6);
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  // 当前请求落在哪个 GPU
  const targetGpu = reqIdx % 3;

  // 节点位置
  const NODES = {
    client: { x: 90, y: 60, w: 110, h: 40, label: "Client", desc: "Web / App" },
    nginx: {
      x: 90,
      y: 160,
      w: 110,
      h: 40,
      label: "Nginx",
      desc: "负载均衡 / TLS / Rate Limit",
    },
    gpu0: { x: 280, y: 100, w: 140, h: 40, label: "vLLM #1", desc: "GPU L4 24G" },
    gpu1: { x: 280, y: 160, w: 140, h: 40, label: "vLLM #2", desc: "GPU L4 24G" },
    gpu2: { x: 280, y: 220, w: 140, h: 40, label: "vLLM #3", desc: "GPU L4 24G" },
    storage: {
      x: 470,
      y: 160,
      w: 110,
      h: 40,
      label: "S3 / NFS",
      desc: "模型权重共享",
    },
    monitor: {
      x: 90,
      y: 280,
      w: 220,
      h: 40,
      label: "Prometheus + Grafana",
      desc: "QPS · TTFT · 显存",
    },
  };

  type NK = keyof typeof NODES;

  // 边
  const EDGES: { from: NK; to: NK; label?: string }[] = [
    { from: "client", to: "nginx", label: "HTTPS" },
    { from: "nginx", to: "gpu0" },
    { from: "nginx", to: "gpu1" },
    { from: "nginx", to: "gpu2" },
    { from: "gpu0", to: "storage" },
    { from: "gpu1", to: "storage" },
    { from: "gpu2", to: "storage" },
    { from: "gpu0", to: "monitor" },
    { from: "gpu1", to: "monitor" },
    { from: "gpu2", to: "monitor" },
  ];

  function side(n: NK, dir: "right" | "left" | "bottom" | "top") {
    const node = NODES[n];
    if (dir === "right") return [node.x + node.w, node.y + node.h / 2];
    if (dir === "left") return [node.x, node.y + node.h / 2];
    if (dir === "bottom") return [node.x + node.w / 2, node.y + node.h];
    return [node.x + node.w / 2, node.y];
  }

  function pathFor(from: NK, to: NK) {
    // 简单贝塞尔
    const [x1, y1] = side(from, "right");
    const [x2, y2] = side(to, "left");
    const dx = (x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  }

  function pathDown(from: NK, to: NK) {
    const [x1, y1] = side(from, "bottom");
    const [x2, y2] = side(to, "top");
    return `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
  }

  return (
    <VisualFrame title="生产部署的最小架构：负载均衡 + 多副本 + 共享权重 + 监控">
      <div className="space-y-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* 边 */}
          {EDGES.map((e, i) => {
            const isHorizontal = !["monitor"].includes(e.to);
            const d = isHorizontal ? pathFor(e.from, e.to) : pathDown(e.from, e.to);
            const isLive =
              (e.from === "client" && e.to === "nginx" && reqIdx >= 0) ||
              (e.from === "nginx" && e.to === `gpu${targetGpu}`) ||
              (e.from === `gpu${targetGpu}` && e.to === "storage");
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                  strokeWidth={1}
                />
                {isLive && (
                  <motion.circle
                    key={`pulse-${reqIdx}-${i}`}
                    r={3.5}
                    fill="#8b5cf6"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                      offsetPath: `path("${d}")`,
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* 节点 */}
          {(Object.entries(NODES) as [NK, (typeof NODES)[NK]][]).map(
            ([key, n]) => {
              const isActive =
                hover === key ||
                (key === `gpu${targetGpu}` && reqIdx >= 0);
              const isGpu = key.startsWith("gpu");

              return (
                <g
                  key={key}
                  onMouseEnter={() => setHover(key)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx={6}
                    fill={isActive ? "#8b5cf615" : "white"}
                    stroke={isActive ? "#8b5cf6" : "currentColor"}
                    strokeWidth={isActive ? 1.6 : 1}
                    className={cn(
                      !isActive && "text-neutral-300 dark:text-neutral-700",
                      "dark:fill-neutral-950"
                    )}
                  />
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + 18}
                    textAnchor="middle"
                    className="text-xs font-mono font-semibold fill-foreground"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + 32}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-muted-foreground"
                  >
                    {n.desc}
                  </text>
                  {isGpu && isActive && (
                    <circle cx={n.x + n.w - 8} cy={n.y + 8} r={3} fill="#10b981">
                      <animate
                        attributeName="r"
                        values="3;5;3"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            }
          )}

          {/* 分层标签 */}
          <text x={20} y={80} className="text-[10px] font-mono fill-muted-foreground">
            入口
          </text>
          <text x={20} y={180} className="text-[10px] font-mono fill-muted-foreground">
            网关
          </text>
          <text x={490} y={250} className="text-[10px] font-mono fill-muted-foreground">
            存储
          </text>
        </svg>

        <div className="text-xs font-mono text-muted-foreground text-center">
          多副本能在某个 GPU 出故障时自动 fail-over，权重落在 S3 启新实例只要拉一下
        </div>
      </div>
    </VisualFrame>
  );
}

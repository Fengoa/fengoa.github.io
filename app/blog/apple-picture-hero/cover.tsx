import { cn } from "@/lib/utils";

/**
 * 苹果 Hero <picture> 封面：以「代码卡片」形式把每个模块的功能列出，
 * 不做插画，直接在深色底上排布等宽小字清单。
 */
export function ApplePictureHeroCover({ className }: { className?: string }) {
  const modules = [
    { name: "small", desc: "窄屏：仅保留产品细节" },
    { name: "mediumtall", desc: "矮屏：给足纵向空间" },
    { name: "medium", desc: "高受限：压缩纵向，防溢出" },
    { name: "largetall", desc: "大屏：完整构图冲击力" },
    { name: "large", desc: "大屏较矮：优先横向完整" },
    { name: "srcset · 2x", desc: "Retina：按 DPR 取高清图" },
    { name: "<img>", desc: "兜底图 + 规范 alt 文本" },
  ];

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "bg-[#0a0e1a]",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id="aph-card" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#0b1228" />
            <stop offset="100%" stopColor="#132348" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#aph-card)" />

        {/* 顶部标题行 */}
        <text
          x="8"
          y="13"
          className="font-mono text-[3.6px] font-bold"
          fill="#7dd3fc"
          letterSpacing="0.3"
        >
          &lt;picture&gt; HERO · 模块拆解
        </text>
        <line x1="8" y1="17" x2="92" y2="17" stroke="#27406e" strokeWidth="0.4" />

        {/* 模块清单 */}
        {modules.map((m, i) => {
          const y = 28 + i * 9.5;
          return (
            <g key={m.name}>
              <rect x="8" y={y - 2.4} width="1.8" height="1.8" rx="0.4" fill="#7dd3fc" />
              <text
                x="12.5"
                y={y - 0.4}
                className="font-mono text-[3.6px] font-semibold"
                fill="#e6eefc"
              >
                {m.name}
              </text>
              <text
                x="12.5"
                y={y + 3.4}
                className="font-mono text-[3px]"
                fill="#9fb4d8"
              >
                {m.desc}
              </text>
            </g>
          );
        })}

        {/* 外框 */}
        <rect
          x="3" y="3" width="94" height="94" rx="2"
          fill="none" stroke="#27406e" strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

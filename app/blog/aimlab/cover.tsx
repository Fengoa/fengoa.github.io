import { cn } from "@/lib/utils";

/**
 * 3D 瞄准训练器封面：以「准星射线命中靶球」的几何意象，
 * 用印刷海报式版式（色场 + 细描边画框 + 等宽小字标号）表现。
 */
export function AimlabCover({ className }: { className?: string }) {
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
          {/* 背景色场：深空蓝到暖橙的对角渐变，制造纵深 */}
          <linearGradient id="aimlab-field" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#0b1228" />
            <stop offset="58%" stopColor="#0d1b3a" />
            <stop offset="100%" stopColor="#3a2410" />
          </linearGradient>

          {/* 靶球的径向高光 */}
          <radialGradient id="aimlab-target" cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#bfe3ff" />
            <stop offset="42%" stopColor="#4f9bff" />
            <stop offset="100%" stopColor="#1b54b8" />
          </radialGradient>

          {/* 准星射线的线性衰减 */}
          <linearGradient id="aimlab-beam" x1="50" y1="50" x2="82" y2="26">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </linearGradient>

          {/* 细颗粒噪点，增加印刷质感 */}
          <pattern
            id="aimlab-grain"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0.6" cy="0.6" r="0.18" fill="#ffffff" opacity="0.05" />
          </pattern>

          <clipPath id="aimlab-frame">
            <rect x="6" y="6" width="88" height="88" rx="1.5" />
          </clipPath>
        </defs>

        {/* 底色场 */}
        <rect width="100" height="100" fill="url(#aimlab-field)" />

        {/* 噪点叠层 */}
        <rect width="100" height="100" fill="url(#aimlab-grain)" />

        <g clipPath="url(#aimlab-frame)">
          {/* 极细同心圆网格，暗示球面参考点（SpawnGrid） */}
          <g stroke="#5b7bb5" strokeWidth="0.25" opacity="0.18" fill="none">
            <circle cx="50" cy="50" r="14" />
            <circle cx="50" cy="50" r="24" />
            <circle cx="50" cy="50" r="34" />
            <circle cx="50" cy="50" r="44" />
          </g>

          {/* 准星射线：从中心射向命中靶球 */}
          <line
            x1="50" y1="50"
            x2="82" y2="26"
            stroke="url(#aimlab-beam)"
            strokeWidth="0.9"
          />
          <circle cx="50" cy="50" r="0.9" fill="#7dd3fc" />

          {/* 主靶球（被命中） */}
          <circle cx="82" cy="26" r="9" fill="url(#aimlab-target)" />
          <circle cx="82" cy="26" r="9" fill="none" stroke="#bfe3ff" strokeWidth="0.4" opacity="0.7" />
          {/* 命中光环 */}
          <circle cx="82" cy="26" r="12.5" fill="none" stroke="#fbbf24" strokeWidth="0.7" opacity="0.85" />

          {/* 次靶球（散布于球面） */}
          <circle cx="30" cy="70" r="4.6" fill="url(#aimlab-target)" opacity="0.92" />
          <circle cx="38" cy="34" r="3.2" fill="url(#aimlab-target)" opacity="0.8" />
          <circle cx="64" cy="64" r="2.4" fill="url(#aimlab-target)" opacity="0.7" />

          {/* 中心准星（四芒 + 中心点） */}
          <g stroke="#e2e8f0" strokeWidth="0.55" strokeLinecap="round">
            <line x1="50" y1="45.5" x2="50" y2="48" />
            <line x1="50" y1="52" x2="50" y2="54.5" />
            <line x1="45.5" y1="50" x2="48" y2="50" />
            <line x1="52" y1="50" x2="54.5" y2="50" />
          </g>
          <circle cx="50" cy="50" r="0.7" fill="#e2e8f0" />

          {/* 角标：等宽小字 + 索引号（印刷海报语言） */}
          <text
            x="10"
            y="14"
            className="font-mono text-[3px] font-semibold"
            fill="#93a8d4"
            letterSpacing="0.4"
          >
            R3F · AIM
          </text>
          <text
            x="90"
            y="14"
            textAnchor="end"
            className="font-mono text-[3px] font-semibold"
            fill="#93a8d4"
          >
            07
          </text>

          {/* 主标题排版：大号衬线/无衬线黑体，压在底部色带上 */}
          <rect x="6" y="60" width="88" height="34" fill="#060912" />
          <text
            x="50"
            y="76"
            textAnchor="middle"
            className="font-sans text-[15px] font-black"
            fill="#f1f5ff"
            letterSpacing="-0.4"
          >
            AIM
          </text>
          <text
            x="50"
            y="88"
            textAnchor="middle"
            className="font-mono text-[4.4px] font-semibold"
            fill="#7dd3fc"
            letterSpacing="0.3"
          >
            SHOOT · GEOMETRY · STATE
          </text>
        </g>

        {/* 画框细描边 */}
        <rect
          x="6" y="6" width="88" height="88" rx="1.5"
          fill="none" stroke="#93a8d4" strokeWidth="0.7" opacity="0.55"
        />
      </svg>
    </div>
  );
}

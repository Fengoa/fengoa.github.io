import { cn } from "@/lib/utils";

/**
 * AI 原生组织封面：以高对比印刷海报表现组织学习率。
 */
export function AiNativeOrganizationCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "bg-[#ff4b1f]",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <pattern
            id="ai-company-grid"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0.8" cy="0.8" r="0.28" fill="#120d0b" opacity="0.22" />
          </pattern>
          <clipPath id="ai-company-frame">
            <rect x="6" y="6" width="88" height="88" rx="1.5" />
          </clipPath>
        </defs>

        <rect width="100" height="100" fill="url(#ai-company-grid)" />
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="1.5"
          fill="none"
          stroke="#120d0b"
          strokeWidth="0.8"
        />

        <g clipPath="url(#ai-company-frame)">
          <circle cx="88" cy="18" r="18" fill="#ffd7c9" />
          <circle cx="88" cy="18" r="10.5" fill="#fff0eb" />
          <path
            d="M88 4 A14 14 0 0 1 98 8"
            fill="none"
            stroke="#ff4b1f"
            strokeWidth="2.2"
          />

          <text
            x="10"
            y="15"
            className="font-mono text-[3.2px] font-semibold"
            fill="#120d0b"
            letterSpacing="0.55"
          >
            AI NATIVE ORGANIZATION / IDEAS
          </text>

          <text
            x="7.5"
            y="48"
            className="font-sans text-[43px] font-black"
            fill="#120d0b"
            letterSpacing="-2.8"
          >
            AI
          </text>
          <text
            x="9.5"
            y="61"
            className="font-sans text-[8.5px] font-black"
            fill="#120d0b"
            letterSpacing="-0.35"
          >
            LEARNING RATE
          </text>

          <rect x="6" y="68" width="88" height="26" fill="#120d0b" />
          <text
            x="10"
            y="76"
            className="font-mono text-[3.2px] font-semibold"
            fill="#ff4b1f"
            letterSpacing="0.35"
          >
            OBSERVE × TEST × ADAPT
          </text>
          <text
            x="10"
            y="87"
            className="font-sans text-[8.5px] font-bold"
            fill="#fff5f0"
            letterSpacing="-0.35"
          >
            LEARN / ADAPT
          </text>

          <g fill="#fff5f0">
            <rect x="75" y="73" width="3" height="3" />
            <rect x="80" y="73" width="3" height="3" opacity="0.7" />
            <rect x="85" y="73" width="3" height="3" opacity="0.45" />
            <rect x="90" y="73" width="3" height="3" opacity="0.2" />
          </g>
          <g fill="#ff4b1f">
            <rect x="75" y="81" width="18" height="1" />
            <rect x="75" y="84" width="12" height="1" />
            <rect x="75" y="87" width="15" height="1" />
          </g>

          <text
            x="91"
            y="64"
            textAnchor="end"
            className="font-mono text-[3px] font-semibold"
            fill="#120d0b"
          >
            01 / ∞
          </text>
        </g>

        <text
          x="96.5"
          y="52"
          textAnchor="middle"
          transform="rotate(90 96.5 52)"
          className="font-mono text-[2.6px] font-semibold"
          fill="#120d0b"
          letterSpacing="0.4"
        >
          OBSERVE → TEST → ADAPT
        </text>
      </svg>
    </div>
  );
}

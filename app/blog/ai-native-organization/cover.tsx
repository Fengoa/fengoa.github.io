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
          <circle cx="88" cy="16" r="16" fill="#ffd7c9" />
          <circle cx="88" cy="16" r="9.5" fill="#fff0eb" />
          <path
            d="M88 3 A13 13 0 0 1 97 7"
            fill="none"
            stroke="#ff4b1f"
            strokeWidth="2.2"
          />

          <text
            x="10"
            y="14"
            className="font-mono text-[3px] font-semibold"
            fill="#120d0b"
            letterSpacing="0.4"
          >
            AINO · Theory
          </text>

          <text
            x="91"
            y="14"
            textAnchor="end"
            className="font-mono text-[3px] font-semibold"
            fill="#120d0b"
          >
            01
          </text>

          <text
            x="13"
            y="50"
            className="font-sans text-[36px] font-black"
            fill="#120d0b"
            letterSpacing="-1"
          >
            OLR
          </text>

          <rect x="6" y="54" width="88" height="40" fill="#120d0b" />

          <text
            x="10"
            y="76.8"
            className="font-mono text-[8px] font-semibold"
            fill="#ff4b1f"
            letterSpacing="0.2"
          >
            ∝
          </text>

          <text
            x="54"
            y="68"
            textAnchor="middle"
            className="font-mono text-[6px] font-semibold"
            fill="#ff4b1f"
            letterSpacing="0.08"
          >
            Insight × Adoption
          </text>

          <line
            x1="20"
            y1="74"
            x2="88"
            y2="74"
            stroke="#ff4b1f"
            strokeWidth="0.7"
          />

          <text
            x="54"
            y="84"
            textAnchor="middle"
            className="font-mono text-[6px] font-semibold"
            fill="#ff4b1f"
            letterSpacing="0.08"
          >
            Cycle Time
          </text>
        </g>
      </svg>
    </div>
  );
}

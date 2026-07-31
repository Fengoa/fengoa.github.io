import { cn } from "@/lib/utils";

/**
 * AEO 实践封面：答案引擎可见度示意。
 */
export function AeoGoosePracticeCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl",
        "bg-[#0f1419]",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <defs>
          <linearGradient id="aeo-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="#0f1419" />
        <circle cx="78" cy="22" r="18" fill="#134e4a" opacity="0.45" />
        <circle cx="18" cy="82" r="22" fill="#0c4a6e" opacity="0.35" />

        <rect
          x="14"
          y="28"
          width="72"
          height="44"
          rx="4"
          fill="#1a2332"
          stroke="#334155"
          strokeWidth="0.6"
        />

        <text
          x="20"
          y="40"
          className="font-mono text-[4px] font-semibold"
          fill="#94a3b8"
        >
          AEO
        </text>
        <text
          x="20"
          y="48"
          className="font-mono text-[3.2px]"
          fill="#e2e8f0"
        >
          Answer Engine
        </text>
        <text
          x="20"
          y="54"
          className="font-mono text-[3.2px]"
          fill="#e2e8f0"
        >
          Optimization
        </text>

        <rect
          x="20"
          y="60"
          width="40"
          height="3.5"
          rx="1"
          fill="#1e293b"
        />
        <rect
          x="20"
          y="60"
          width="26"
          height="3.5"
          rx="1"
          fill="url(#aeo-glow)"
        />

        <circle cx="72" cy="50" r="8" fill="none" stroke="#5eead4" strokeWidth="0.7" />
        <line
          x1="77.5"
          y1="55.5"
          x2="82"
          y2="60"
          stroke="#5eead4"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

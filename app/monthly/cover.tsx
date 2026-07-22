import { cn } from "@/lib/utils";

export function MonthlyCover({
  year,
  month,
  className,
}: {
  year: number;
  month: number;
  className?: string;
}) {
  const monthText = String(month).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative aspect-square size-full overflow-hidden rounded-2xl bg-[#111114]",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <pattern
            id={`monthly-grid-${year}-${month}`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path d="M5 0H0V5" fill="none" stroke="#34343b" strokeWidth="0.35" />
          </pattern>
          <clipPath id={`monthly-frame-${year}-${month}`}>
            <rect x="7" y="7" width="86" height="86" rx="2" />
          </clipPath>
        </defs>
        <rect width="100" height="100" fill="url(#monthly-grid-${year}-${month})" />
        <rect
          x="7"
          y="68"
          width="86"
          height="25"
          fill="#ff5038"
          clipPath={`url(#monthly-frame-${year}-${month})`}
        />
        <rect x="7" y="7" width="86" height="86" rx="2" fill="none" stroke="#f2efe7" strokeWidth="0.8" />

        <text x="11" y="16" fill="#f2efe7" className="font-mono text-[3.5px] font-semibold" letterSpacing="0.5">
          MONTHLY NOTES / {year}
        </text>
        <text x="8" y="65" fill="#f2efe7" className="font-sans text-[54px] font-black" letterSpacing="1">
          {monthText}
        </text>
        <text x="12" y="78" fill="#111114" className="font-sans text-[7px] font-black">
          月刊
        </text>
        <text x="12" y="87" fill="#111114" className="font-mono text-[3px] font-semibold" letterSpacing="0.35">
          READ · WATCH · USE · KEEP
        </text>

        <circle cx="82" cy="19" r="8" fill="#ff5038" />
        <circle cx="82" cy="19" r="3" fill="#111114" />
        <text x="88" y="88" textAnchor="end" fill="#111114" className="font-mono text-[3px] font-bold">
          {year}.{monthText}
        </text>
      </svg>
    </div>
  );
}

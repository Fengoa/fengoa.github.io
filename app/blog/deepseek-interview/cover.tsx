import { cn } from "@/lib/utils";

export function DeepSeekCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl bg-[#ff5038]",
        className
      )}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        <text
          x="11"
          y="15"
          className="font-mono text-[3.4px] font-semibold"
          fill="#1a0d09"
          letterSpacing="0.4"
        >
          DeepSeek · 梁文锋
        </text>

        {/* AG，I 用阶梯代替 */}
        <text
          x="12"
          y="64"
          className="font-sans text-[32px] font-black"
          fill="#fff7f4"
          letterSpacing="1"
        >
          AG
        </text>
        <g fill="#fff7f4">
          <rect x="64" y="58" width="5" height="6" />
          <rect x="69" y="52" width="5" height="12" />
          <rect x="74" y="42" width="5" height="22" />
        </g>

        <text
          x="12"
          y="86"
          className="font-mono text-[3.6px] font-semibold"
          fill="#1a0d09"
          letterSpacing="0.3"
        >
          开源 · 克制 · AGI
        </text>
      </svg>
    </div>
  );
}

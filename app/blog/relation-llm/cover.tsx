import { cn } from "@/lib/utils";

export function RelationLLMCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-[#2926e8]",
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
            id="relation-paper-lines"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke="#ffffff"
              strokeWidth="0.5"
              opacity="0.12"
            />
          </pattern>
          <filter id="relation-card-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="1.5"
              floodColor="#0d0b57"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <circle cx="50" cy="50" r="50" fill="url(#relation-paper-lines)" />

        <text
          x="3"
          y="34"
          className="font-sans text-[42px] font-black"
          fill="#a9a7ff"
          opacity="0.55"
        >
          “
        </text>

        <g
          transform="rotate(-5 50 29)"
          filter="url(#relation-card-shadow)"
        >
          <rect x="13" y="13" width="75" height="33" rx="3" fill="#fff4dc" />
          <text
            x="19"
            y="25"
            className="font-sans text-[5px] font-semibold"
            fill="#171334"
          >
            老高的生日是
          </text>
          <text
            x="19"
            y="37"
            className="font-sans text-[9px] font-black"
            fill="#171334"
            letterSpacing="-0.25"
          >
            农历六月初八
          </text>
          <path
            d="M19 40 C31 38.8 44 41.2 61 39.8"
            fill="none"
            stroke="#ff4b45"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="80" cy="20" r="3" fill="#ff4b45" />
          <path
            d="M78.5 20 L79.6 21.2 L81.7 18.8"
            fill="none"
            stroke="#fff4dc"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <path
          d="M63 43 C69 49 60 51 66 57"
          fill="none"
          stroke="#ff4b45"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />

        <g
          transform="rotate(4 52 66)"
          filter="url(#relation-card-shadow)"
        >
          <rect x="20" y="52" width="65" height="27" rx="3" fill="#bdf6c8" />
          <rect x="25" y="58" width="13" height="8" rx="1.5" fill="#171334" />
          <text
            x="31.5"
            y="63.6"
            textAnchor="middle"
            className="font-sans text-[4px] font-bold"
            fill="#bdf6c8"
          >
            小张
          </text>
          <text
            x="41"
            y="63.8"
            className="font-sans text-[4.5px] font-semibold"
            fill="#171334"
          >
            是老高介绍来的
          </text>
          <line x1="25" y1="71" x2="78" y2="71" stroke="#171334" strokeWidth="0.5" />
          <text
            x="25"
            y="76"
            className="font-mono text-[2.8px] font-semibold"
            fill="#171334"
            letterSpacing="0.25"
          >
            RELATIONSHIP / CONFIRMED
          </text>
        </g>

        <rect x="14" y="84" width="72" height="9" rx="4.5" fill="#171334" />
        <text
          x="50"
          y="90.2"
          textAnchor="middle"
          className="font-sans text-[4.6px] font-bold"
          fill="#ffffff"
          letterSpacing="0.2"
        >
          口语记录 → 可查询记忆
        </text>
      </svg>
    </div>
  );
}

const frameClass =
  "my-8 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950";
const captionClass =
  "border-t border-neutral-200 px-4 py-3 text-center text-xs text-muted-foreground dark:border-neutral-800";

export function CoordinationShift() {
  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-label="传统层级组织与 AI 原生能力调度结构对比"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="coordination-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="#f3efe7" />
        <rect width="800" height="420" fill="url(#coordination-dots)" />
        <rect x="22" y="22" width="756" height="376" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />
        <path
          d="M0 70H800M0 140H800M0 210H800M0 280H800M0 350H800"
          stroke="#120d0b"
          opacity="0.08"
        />
        <path
          d="M100 0V420M200 0V420M300 0V420M400 0V420M500 0V420M600 0V420M700 0V420"
          stroke="#120d0b"
          opacity="0.08"
        />

        <text x="58" y="58" fill="#120d0b" className="font-mono text-[17px] font-bold">
          固定汇报链
        </text>
        <text x="416" y="58" fill="#120d0b" className="font-mono text-[17px] font-bold">
          动态能力场
        </text>

        <g fill="none" stroke="#120d0b" strokeWidth="3">
          <path d="M205 105V145M205 145H130V180M205 145H280V180" />
          <path d="M130 224V252M130 252H88V285M130 252H172V285" />
          <path d="M280 224V252M280 252H238V285M280 252H322V285" />
        </g>
        <g fill="#fff0eb" stroke="#120d0b" strokeWidth="2">
          <rect x="165" y="76" width="80" height="38" rx="4" />
          <rect x="92" y="180" width="76" height="44" rx="4" opacity="0.82" />
          <rect x="242" y="180" width="76" height="44" rx="4" opacity="0.82" />
        </g>
        <g fill="#ffd7c9" stroke="#120d0b" strokeWidth="2">
          <rect x="58" y="285" width="60" height="34" rx="3" />
          <rect x="142" y="285" width="60" height="34" rx="3" />
          <rect x="208" y="285" width="60" height="34" rx="3" />
          <rect x="292" y="285" width="60" height="34" rx="3" />
        </g>
        <text x="205" y="100" textAnchor="middle" fill="#101014" className="font-mono text-[13px] font-bold">
          CEO
        </text>
        <text x="130" y="207" textAnchor="middle" fill="#101014" className="font-mono text-[13px] font-bold">
          部门
        </text>
        <text x="280" y="207" textAnchor="middle" fill="#101014" className="font-mono text-[13px] font-bold">
          部门
        </text>

        <circle cx="595" cy="205" r="67" fill="#120d0b" />
        <circle cx="595" cy="205" r="30" fill="#fff0eb" />
        <text x="595" y="211" textAnchor="middle" fill="#120d0b" className="font-mono text-[16px] font-bold">
          目标
        </text>

        <g stroke="#120d0b" strokeWidth="5">
          <line x1="595" y1="138" x2="595" y2="89" />
          <line x1="653" y1="171" x2="704" y2="140" />
          <line x1="653" y1="239" x2="704" y2="270" />
          <line x1="595" y1="272" x2="595" y2="326" />
          <line x1="537" y1="239" x2="486" y2="270" />
          <line x1="537" y1="171" x2="486" y2="140" />
        </g>
        <g fill="#ffd7c9" stroke="#120d0b" strokeWidth="2">
          <circle cx="595" cy="78" r="25" />
          <circle cx="720" cy="131" r="25" />
          <circle cx="720" cy="279" r="25" />
          <circle cx="595" cy="339" r="25" />
          <circle cx="470" cy="279" r="25" />
          <circle cx="470" cy="131" r="25" />
        </g>
        <g fill="#120d0b" className="font-mono text-[11px] font-bold">
          <text x="595" y="82" textAnchor="middle">研究</text>
          <text x="720" y="135" textAnchor="middle">开发</text>
          <text x="720" y="283" textAnchor="middle">设计</text>
          <text x="595" y="343" textAnchor="middle">分析</text>
          <text x="470" y="283" textAnchor="middle">销售</text>
          <text x="470" y="135" textAnchor="middle">内容</text>
        </g>

        <path d="M385 85V335" stroke="#120d0b" strokeWidth="2" strokeDasharray="5 7" />
        <path d="M371 210H399" stroke="#120d0b" strokeWidth="5" />
      </svg>
      <figcaption className={captionClass}>
        层级组织沿汇报链分配任务；AI 原生结构围绕目标即时组合能力。
      </figcaption>
    </figure>
  );
}

export function LearningRateLoop() {
  const stages = [
    { x: 58, title: "感知变化", detail: "OBSERVE", color: "#fff0eb", dark: false },
    { x: 232, title: "提出判断", detail: "DECIDE", color: "#ffd7c9", dark: false },
    { x: 406, title: "取得证据", detail: "TEST", color: "#120d0b", dark: true },
    { x: 580, title: "改变组织", detail: "ADAPT", color: "#ff4b1f", dark: true },
  ];

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 500"
        role="img"
        aria-label="组织从感知环境变化到改变自身的学习率循环"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="learning-rate-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.1" />
          </pattern>
          <marker
            id="learning-rate-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="6.5"
            refY="3.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0L7 3.5L0 7Z" fill="#120d0b" />
          </marker>
        </defs>

        <rect width="800" height="500" fill="#f3efe7" />
        <rect width="800" height="500" fill="url(#learning-rate-dots)" />
        <rect x="22" y="22" width="756" height="456" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />

        <rect x="48" y="48" width="704" height="62" rx="4" fill="#120d0b" />
        <text x="68" y="73" fill="#ff4b1f" className="font-mono text-[13px] font-bold">
          ENVIRONMENT
        </text>
        <text x="68" y="94" fill="#fff0eb" className="font-sans text-[11px]">
          用户 · 市场 · 竞争 · 技术 · 政策
        </text>
        <text x="732" y="83" textAnchor="end" fill="#ffd7c9" className="font-mono text-[11px] font-bold">
          CHANGE SIGNALS
        </text>

        <path
          d="M111 110V159"
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          markerEnd="url(#learning-rate-arrow)"
        />

        <path
          d="M174 205H220M348 205H394M522 205H568"
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          markerEnd="url(#learning-rate-arrow)"
        />

        {stages.map((stage) => (
          <g key={stage.title}>
            <rect
              x={stage.x}
              y="165"
              width="116"
              height="80"
              rx="4"
              fill={stage.color}
              stroke="#120d0b"
              strokeWidth="2.5"
            />
            <text
              x={stage.x + 58}
              y="198"
              textAnchor="middle"
              fill={stage.dark ? "#fff0eb" : "#120d0b"}
              className="font-sans text-[13px] font-bold"
            >
              {stage.title}
            </text>
            <text
              x={stage.x + 58}
              y="222"
              textAnchor="middle"
              fill={stage.dark ? "#ffd7c9" : "#6f3528"}
              className="font-mono text-[9px] font-bold"
            >
              {stage.detail}
            </text>
          </g>
        ))}

        <path
          d="M638 245V290Q638 304 624 304H126Q111 304 111 289V258"
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          markerEnd="url(#learning-rate-arrow)"
        />
        <text x="400" y="328" textAnchor="middle" fill="#120d0b" className="font-mono text-[10px] font-bold">
          一次完整、可靠的组织修正
        </text>

        <rect x="48" y="360" width="704" height="70" rx="4" fill="#120d0b" />
        <text x="68" y="389" fill="#ff4b1f" className="font-mono text-[13px] font-bold">
          ORGANIZATION LEARNING RATE
        </text>
        <text x="68" y="413" fill="#fff0eb" className="font-sans text-[11px]">
          单位时间内完成可靠组织修正的速度
        </text>
      </svg>
      <figcaption className={captionClass}>
        Learning Rate 衡量整个循环完成得多快，以及循环产生的结论是否可靠。
      </figcaption>
    </figure>
  );
}


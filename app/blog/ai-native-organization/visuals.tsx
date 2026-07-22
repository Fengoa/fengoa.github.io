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
  const boxW = 108;
  const boxH = 72;
  const topY = 140;
  const botY = 280;
  const topMidY = topY + boxH / 2;
  const botMidY = botY + boxH / 2;

  const top = [
    { x: 92, title: "感知变化", detail: "Observe", color: "#fff0eb", dark: false },
    { x: 256, title: "提出判断", detail: "Decide", color: "#ffd7c9", dark: false },
    { x: 410, title: "设计实验", detail: "Experiment", color: "#120d0b", dark: true },
    { x: 584, title: "评估结果", detail: "Evaluate", color: "#120d0b", dark: true },
  ];
  const bottom = [
    { x: 584, title: "改变组织", detail: "Adapt", color: "#ff4b1f", dark: true },
    { x: 256, title: "沉淀能力", detail: "Memory", color: "#ffd7c9", dark: false },
  ];

  const observeCx = top[0].x + boxW / 2;
  const evaluateCx = top[3].x + boxW / 2;
  const MemoryCx = bottom[1].x + boxW / 2;

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 540"
        role="img"
        aria-label="组织学习循环：从环境感知到实验评估、组织改变与能力沉淀"
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

        <rect width="800" height="540" fill="#f3efe7" />
        <rect width="800" height="540" fill="url(#learning-rate-dots)" />
        <rect x="22" y="22" width="756" height="496" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />

        <rect x="48" y="42" width="704" height="56" rx="4" fill="#120d0b" />
        <text x="68" y="65" fill="#ff4b1f" className="font-mono text-[13px] font-bold">
          Environment
        </text>
        <text x="68" y="84" fill="#fff0eb" className="font-sans text-[11px]">
          用户 · 市场 · 竞争 · 技术 · 政策
        </text>
        <text x="732" y="74" textAnchor="end" fill="#ffd7c9" className="font-mono text-[11px] font-bold">
          Change Signals
        </text>

        <path
          d={`M${observeCx} 98V${topY - 6}`}
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          markerEnd="url(#learning-rate-arrow)"
        />

        {top.slice(0, -1).map((stage, index) => {
          const next = top[index + 1];
          return (
            <path
              key={`top-arrow-${stage.detail}`}
              d={`M${stage.x + boxW} ${topMidY}H${next.x - 6}`}
              fill="none"
              stroke="#120d0b"
              strokeWidth="2.5"
              markerEnd="url(#learning-rate-arrow)"
            />
          );
        })}

        <path
          d={`M${evaluateCx} ${topY + boxH}V${botY - 6}`}
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          markerEnd="url(#learning-rate-arrow)"
        />

        <path
          d={`M${bottom[0].x} ${botMidY}H${bottom[1].x + boxW + 6}`}
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          markerEnd="url(#learning-rate-arrow)"
        />

        <path
          d={`M${MemoryCx} ${botY}V${topY + boxH + 20}H${observeCx}V${topY + boxH + 6}`}
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          markerEnd="url(#learning-rate-arrow)"
        />

        <text x="320" y="254" fill="#6f3528" className="font-mono text-[14px] font-bold">
          New Goal
        </text>

        {[...top, ...bottom].map((stage) => (
          <g key={stage.detail}>
            <rect
              x={stage.x}
              y={stage.detail === "Adapt" || stage.detail === "Memory" ? botY : topY}
              width={boxW}
              height={boxH}
              rx="4"
              fill={stage.color}
              stroke="#120d0b"
              strokeWidth="2.5"
            />
            <text
              x={stage.x + boxW / 2}
              y={(stage.detail === "Adapt" || stage.detail === "Memory" ? botY : topY) + 30}
              textAnchor="middle"
              fill={stage.dark ? "#fff0eb" : "#120d0b"}
              className="font-sans text-[13px] font-bold"
            >
              {stage.title}
            </text>
            <text
              x={stage.x + boxW / 2}
              y={(stage.detail === "Adapt" || stage.detail === "Memory" ? botY : topY) + 52}
              textAnchor="middle"
              fill={stage.dark ? "#ffd7c9" : "#6f3528"}
              className="font-mono text-[12px] font-bold"
            >
              {stage.detail}
            </text>
          </g>
        ))}

        <rect x="48" y="400" width="704" height="98" rx="4" fill="#120d0b" />
        <text x="68" y="432" fill="#ff4b1f" className="font-mono text-[13px] font-bold">
          Organization Learning Rate
        </text>
        <text x="68" y="456" fill="#fff0eb" className="font-sans text-[11px]">
          衡量一次可靠组织修正完成的速度，以及修正是否固化为可重复能力
        </text>
        <text x="68" y="476" fill="#ffd7c9" className="font-mono text-[10px] font-bold">
          Valid Insight × Adoption Rate / Cycle Time
        </text>
      </svg>
      <figcaption className={captionClass}>
        组织学习循环完成适应；Memory 沉淀能力后进入下一轮 Goal。OLR 衡量循环的速度与质量。
      </figcaption>
    </figure>
  );
}


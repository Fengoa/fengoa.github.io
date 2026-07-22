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

export function CoreOperatingLoop() {
  const stages = [
    { x: 48, title: "目标", detail: "Goal", color: "#fff0eb" },
    { x: 166, title: "实验", detail: "Experiment", color: "#ffd7c9" },
    { x: 284, title: "能力", detail: "Capability", color: "#fff0eb" },
    { x: 402, title: "结果", detail: "Result", color: "#ffd7c9" },
    { x: 520, title: "评估", detail: "Evaluation", color: "#120d0b" },
    { x: 638, title: "学习", detail: "Learning", color: "#ff4b1f" },
  ];

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 460"
        role="img"
        aria-label="AI 原生组织以目标、实验、能力、结果、评估与学习构成最小学习循环"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="operating-loop-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.1" />
          </pattern>
          <marker
            id="operating-loop-arrow"
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

        <rect width="800" height="460" fill="#f3efe7" />
        <rect width="800" height="460" fill="url(#operating-loop-dots)" />
        <rect x="22" y="22" width="756" height="416" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />

        <rect x="48" y="48" width="704" height="52" rx="4" fill="#120d0b" />
        <text x="68" y="70" fill="#ff4b1f" className="font-mono text-[12px] font-bold">
          MISSION
        </text>
        <text x="68" y="88" fill="#fff0eb" className="font-sans text-[11px]">
          规定存在理由与不可越过的边界
        </text>
        <text x="732" y="70" textAnchor="end" fill="#ffd7c9" className="font-mono text-[12px] font-bold">
          STRATEGY
        </text>
        <text x="732" y="88" textAnchor="end" fill="#fff0eb" className="font-sans text-[11px]">
          决定实验组合的选择原则
        </text>

        {stages.slice(0, -1).map((stage, index) => (
          <line
            key={`arrow-${stage.title}`}
            x1={stage.x + 94}
            y1="176"
            x2={stages[index + 1].x - 5}
            y2="176"
            stroke="#120d0b"
            strokeWidth="2"
            markerEnd="url(#operating-loop-arrow)"
          />
        ))}

        {stages.map((stage, index) => (
          <g key={stage.title}>
            <rect
              x={stage.x}
              y="136"
              width="90"
              height="80"
              rx="4"
              fill={stage.color}
              stroke="#120d0b"
              strokeWidth="2.5"
            />
            <text
              x={stage.x + 45}
              y="169"
              textAnchor="middle"
              fill={index >= 4 ? "#fff0eb" : "#120d0b"}
              className="font-sans text-[13px] font-bold"
            >
              {stage.title}
            </text>
            <text
              x={stage.x + 45}
              y="193"
              textAnchor="middle"
              fill={index >= 4 ? "#ffd7c9" : "#6f3528"}
              className="font-mono text-[8px] font-bold"
            >
              {stage.detail}
            </text>
          </g>
        ))}

        <path
          d="M683 216V330Q683 344 669 344H108Q93 344 93 329V229"
          fill="none"
          stroke="#120d0b"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          markerEnd="url(#operating-loop-arrow)"
        />
        <path
          d="M683 216V276Q683 290 669 290H343Q329 290 329 276V229"
          fill="none"
          stroke="#7c2414"
          strokeWidth="2.5"
          strokeDasharray="7 6"
          markerEnd="url(#operating-loop-arrow)"
        />

        <text x="116" y="368" fill="#120d0b" className="font-mono text-[11px] font-bold">
          更新目标与策略
        </text>
        <text x="420" y="314" fill="#7c2414" className="font-mono text-[11px] font-bold">
          升级能力与组织记忆
        </text>

        <rect x="252" y="382" width="296" height="32" fill="#ffd7c9" stroke="#120d0b" strokeWidth="2" />
        <text x="400" y="403" textAnchor="middle" fill="#120d0b" className="font-mono text-[11px] font-bold">
          ORGANIZATION LEARNING RATE
        </text>
      </svg>
      <figcaption className={captionClass}>
        目标驱动实验，实验调用能力并产生结果；评估形成学习，再更新目标、能力与组织记忆。
      </figcaption>
    </figure>
  );
}


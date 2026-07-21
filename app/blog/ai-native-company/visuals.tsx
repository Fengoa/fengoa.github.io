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
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="#ff4b1f" />
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
          GOAL
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

export function OpenAIOrganizationMap() {
  const squads = [
    { x: 338, label: "CHATGPT" },
    { x: 468, label: "API" },
    { x: 598, label: "ENTERPRISE" },
  ];

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 450"
        role="img"
        aria-label="OpenAI 研究、共享平台与端到端产品小队的协作示意"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="openai-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="800" height="450" fill="#ff4b1f" />
        <rect width="800" height="450" fill="url(#openai-dots)" />
        <rect x="22" y="22" width="756" height="406" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />

        <text x="48" y="62" fill="#120d0b" className="font-sans text-[28px] font-black">
          OPENAI
        </text>
        <text x="680" y="58" textAnchor="end" fill="#120d0b" className="font-mono text-[12px] font-bold">
          PUBLIC SIGNALS / 01
        </text>

        <rect x="48" y="86" width="238" height="212" rx="5" fill="#fff0eb" stroke="#120d0b" strokeWidth="3" />
        <text x="68" y="116" fill="#120d0b" className="font-mono text-[14px] font-bold">
          RESEARCH
        </text>
        <text x="68" y="140" fill="#6f3528" className="font-sans text-[12px]">
          前沿模型与行为边界
        </text>
        {[
          { y: 162, label: "训练" },
          { y: 202, label: "评测" },
          { y: 242, label: "安全阈值" },
        ].map((item, index) => (
          <g key={item.label}>
            <rect x="68" y={item.y} width="196" height="28" fill={index === 1 ? "#ffd7c9" : "#120d0b"} />
            <text
              x="82"
              y={item.y + 19}
              fill={index === 1 ? "#120d0b" : "#fff0eb"}
              className="font-mono text-[11px] font-bold"
            >
              {item.label}
            </text>
          </g>
        ))}

        <rect x="316" y="86" width="436" height="212" rx="5" fill="#ffd7c9" stroke="#120d0b" strokeWidth="3" />
        <text x="336" y="116" fill="#120d0b" className="font-mono text-[14px] font-bold">
          END-TO-END SQUADS
        </text>
        <text x="336" y="140" fill="#6f3528" className="font-sans text-[12px]">
          围绕产品结果纵向推进
        </text>
        {squads.map((squad) => (
          <g key={squad.label}>
            <rect x={squad.x} y="160" width="108" height="112" fill="#fff0eb" stroke="#120d0b" strokeWidth="2" />
            <text x={squad.x + 54} y="184" textAnchor="middle" fill="#120d0b" className="font-mono text-[10px] font-bold">
              {squad.label}
            </text>
            <path d={`M${squad.x + 12} 198H${squad.x + 96}M${squad.x + 12} 222H${squad.x + 96}`} stroke="#120d0b" />
            <g fill="#6f3528" className="font-mono text-[9px]">
              <text x={squad.x + 16} y="214">R · 研究</text>
              <text x={squad.x + 16} y="238">E · 工程</text>
              <text x={squad.x + 16} y="260">P · 产品</text>
            </g>
            <circle cx={squad.x + 94} cy="174" r="8" fill="#ff4b1f" stroke="#120d0b" strokeWidth="2" />
          </g>
        ))}

        <path d="M167 298V330M534 298V330" stroke="#120d0b" strokeWidth="4" />
        <rect x="48" y="330" width="704" height="64" rx="4" fill="#120d0b" />
        <text x="70" y="358" fill="#ff4b1f" className="font-mono text-[13px] font-bold">
          SHARED MODEL + COMPUTE PLATFORM
        </text>
        <text x="70" y="380" fill="#ffd7c9" className="font-sans text-[11px]">
          训练、推理、实时能力与基础设施跨产品复用
        </text>
        <g fill="#fff0eb">
          <rect x="654" y="349" width="18" height="18" />
          <rect x="680" y="349" width="18" height="18" opacity="0.65" />
          <rect x="706" y="349" width="18" height="18" opacity="0.3" />
        </g>
      </svg>
      <figcaption className={captionClass}>
        公开线索可抽象为研究、端到端产品小队与共享平台三类协作面；该图不代表完整内部组织表。
      </figcaption>
    </figure>
  );
}

export function AnthropicOrganizationMap() {
  const domains = [
    { x: 54, label: "ALIGNMENT" },
    { x: 194, label: "INTERPRETABILITY" },
    { x: 334, label: "RED TEAM" },
    { x: 474, label: "SOCIETAL" },
    { x: 614, label: "ECONOMIC" },
  ];

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 450"
        role="img"
        aria-label="Anthropic 研究问题域、Claude 产品交付链与安全评测协作示意"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="anthropic-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="800" height="450" fill="#ff4b1f" />
        <rect width="800" height="450" fill="url(#anthropic-dots)" />
        <rect x="22" y="22" width="756" height="406" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />

        <text x="48" y="62" fill="#120d0b" className="font-sans text-[28px] font-black">
          ANTHROPIC
        </text>
        <text x="680" y="58" textAnchor="end" fill="#120d0b" className="font-mono text-[12px] font-bold">
          PUBLIC SIGNALS / 02
        </text>

        <text x="48" y="98" fill="#120d0b" className="font-mono text-[12px] font-bold">
          RESEARCH PROBLEM DOMAINS
        </text>
        {domains.map((domain, index) => (
          <g key={domain.label}>
            <rect
              x={domain.x}
              y="116"
              width="124"
              height="54"
              rx="3"
              fill={index % 2 === 0 ? "#fff0eb" : "#ffd7c9"}
              stroke="#120d0b"
              strokeWidth="2"
            />
            <text
              x={domain.x + 62}
              y="147"
              textAnchor="middle"
              fill="#120d0b"
              className="font-mono text-[9px] font-bold"
            >
              {domain.label}
            </text>
            <path d={`M${domain.x + 62} 170V205`} stroke="#120d0b" strokeWidth="2" />
          </g>
        ))}

        <rect x="54" y="205" width="684" height="52" rx="4" fill="#120d0b" />
        <text x="76" y="237" fill="#fff0eb" className="font-mono text-[13px] font-bold">
          MODEL BEHAVIOR · TRAINING · ALIGNMENT
        </text>
        <circle cx="706" cy="231" r="11" fill="#ff4b1f" />

        <g stroke="#120d0b" strokeWidth="3">
          <path d="M186 257V294" />
          <path d="M400 257V294" />
          <path d="M614 257V294" />
          <path d="M186 326H614" />
        </g>
        {[
          { x: 82, width: 208, title: "CLAUDE", detail: "模型与对话产品" },
          { x: 296, width: 208, title: "API", detail: "开发者与企业接入" },
          { x: 510, width: 208, title: "DEPLOYMENT", detail: "规模化行为检验" },
        ].map((item, index) => (
          <g key={item.title}>
            <rect
              x={item.x}
              y="294"
              width={item.width}
              height="64"
              rx="4"
              fill={index === 1 ? "#ffd7c9" : "#fff0eb"}
              stroke="#120d0b"
              strokeWidth="3"
            />
            <text x={item.x + 18} y="320" fill="#120d0b" className="font-mono text-[12px] font-bold">
              {item.title}
            </text>
            <text x={item.x + 18} y="343" fill="#6f3528" className="font-sans text-[11px]">
              {item.detail}
            </text>
          </g>
        ))}

        <rect x="82" y="382" width="636" height="28" fill="#120d0b" />
        <text x="400" y="401" textAnchor="middle" fill="#ff4b1f" className="font-mono text-[11px] font-bold">
          SAFETY + EVALUATION THROUGHOUT
        </text>
      </svg>
      <figcaption className={captionClass}>
        研究侧按安全相关问题域切分，模型训练、Claude 产品与部署反馈构成交付链；安全评测贯穿其中。
      </figcaption>
    </figure>
  );
}

export function OrganizationStack() {
  const layers = [
    { y: 56, width: 300, color: "#fff0eb", title: "MISSION", detail: "定义方向与边界" },
    { y: 126, width: 430, color: "#ffd7c9", title: "STRATEGY", detail: "选择路径与资源" },
    { y: 196, width: 560, color: "#fff0eb", title: "CAPABILITY PLATFORM", detail: "组合研究、内容、开发与分析能力" },
    { y: 266, width: 680, color: "#120d0b", title: "EXECUTION", detail: "连接渠道、工具与业务系统" },
  ];

  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 390"
        role="img"
        aria-label="AI 原生公司的四层组织结构"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="stack-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="800" height="390" fill="#ff4b1f" />
        <rect width="800" height="390" fill="url(#stack-dots)" />
        <rect x="22" y="22" width="756" height="346" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />
        <circle cx="400" cy="44" r="17" fill="#120d0b" />
        <path d="M400 61V340" stroke="#120d0b" strokeWidth="3" strokeDasharray="4 6" />
        {layers.map((layer) => {
          const x = (800 - layer.width) / 2;
          return (
            <g key={layer.title}>
              <rect
                x={x}
                y={layer.y}
                width={layer.width}
                height="54"
                rx="5"
                fill={layer.color}
                stroke="#120d0b"
                strokeWidth="3"
              />
              <text
                x={x + 20}
                y={layer.y + 23}
                fill={layer.title === "EXECUTION" ? "#fff0eb" : "#120d0b"}
                className="font-mono text-[14px] font-bold"
              >
                {layer.title}
              </text>
              <text
                x={x + 20}
                y={layer.y + 42}
                fill={layer.title === "EXECUTION" ? "#ffd7c9" : "#5a2b20"}
                className="font-sans text-[12px]"
              >
                {layer.detail}
              </text>
              <circle
                cx={x + layer.width - 24}
                cy={layer.y + 27}
                r="6"
                fill={layer.title === "EXECUTION" ? "#ff4b1f" : "#120d0b"}
              />
            </g>
          );
        })}
        <g fill="#120d0b" className="font-mono text-[10px] font-bold">
          <text x="60" y="362">抽象</text>
          <text x="705" y="362">执行</text>
        </g>
        <path d="M95 358H690" stroke="#120d0b" strokeWidth="2" />
        <path d="M690 358L679 352V364Z" fill="#120d0b" />
      </svg>
      <figcaption className={captionClass}>
        上层确定方向，中层编排能力，执行层连接真实业务系统。
      </figcaption>
    </figure>
  );
}

export function ExperimentEngine() {
  return (
    <figure className={frameClass}>
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-label="实验评估与资源再分配形成学习循环"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="experiment-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.8" fill="#120d0b" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="#ff4b1f" />
        <rect width="800" height="420" fill="url(#experiment-dots)" />
        <rect x="22" y="22" width="756" height="376" rx="8" fill="none" stroke="#120d0b" strokeWidth="4" />
        <circle cx="112" cy="210" r="49" fill="#fff0eb" stroke="#120d0b" strokeWidth="4" />
        <text x="112" y="206" textAnchor="middle" fill="#120d0b" className="font-mono text-[13px] font-bold">
          增长目标
        </text>
        <text x="112" y="226" textAnchor="middle" fill="#7c3323" className="font-mono text-[11px]">
          +10×
        </text>

        <g fill="none" strokeWidth="9" strokeLinecap="round">
          <path d="M164 190C250 95 355 84 470 106" stroke="#120d0b" />
          <path d="M164 204C270 166 367 169 470 176" stroke="#ffd7c9" />
          <path d="M164 218C275 253 365 248 470 246" stroke="#fff0eb" />
          <path d="M164 232C250 330 358 328 470 316" stroke="#7c2414" />
        </g>
        <g className="font-mono text-[11px] font-bold">
          <text x="286" y="91" fill="#120d0b">实验 A</text>
          <text x="305" y="159" fill="#120d0b">实验 B</text>
          <text x="305" y="276" fill="#120d0b">实验 C</text>
          <text x="286" y="343" fill="#120d0b">实验 D</text>
        </g>

        <rect x="470" y="66" width="170" height="290" rx="7" fill="#120d0b" stroke="#120d0b" strokeWidth="3" />
        <text x="495" y="98" fill="#ff4b1f" className="font-mono text-[12px] font-bold">EVALUATION</text>
        <g>
          <rect x="495" y="123" width="105" height="16" fill="#4c2118" />
          <rect x="495" y="123" width="28" height="16" fill="#ff4b1f" />
          <rect x="495" y="173" width="105" height="16" fill="#4c2118" />
          <rect x="495" y="173" width="55" height="16" fill="#ffd7c9" />
          <rect x="495" y="223" width="105" height="16" fill="#4c2118" />
          <rect x="495" y="223" width="94" height="16" fill="#fff0eb" />
          <rect x="495" y="273" width="105" height="16" fill="#4c2118" />
          <rect x="495" y="273" width="39" height="16" fill="#9e321d" />
        </g>
        <text x="495" y="326" fill="#fff0eb" className="font-mono text-[12px] font-bold">
          增加 C 的资源权重
        </text>

        <path
          d="M640 252C740 252 749 381 604 382H164C93 382 64 338 81 280"
          fill="none"
          stroke="#120d0b"
          strokeWidth="3"
          strokeDasharray="7 7"
        />
        <path d="M76 289L80 273L91 284" fill="#120d0b" />
        <text x="340" y="402" textAnchor="middle" fill="#120d0b" className="font-mono text-[11px] font-bold">
          结果写回下一轮规划
        </text>
      </svg>
      <figcaption className={captionClass}>
        实验结果进入独立评估，资源随效果调整，经验再写回下一轮规划。
      </figcaption>
    </figure>
  );
}

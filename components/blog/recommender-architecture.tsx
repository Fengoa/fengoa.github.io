"use client";

/**
 * 推荐系统架构图：构建时 → similarity.json → 运行时
 */
export function RecommenderArchitecture() {
  return (
    <div className="my-8 overflow-x-auto">
      <svg
        viewBox="0 0 720 380"
        className="w-full min-w-[600px] font-mono"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 标题 */}
        <text x="80" y="30" className="text-[14px] font-medium" fill="currentColor">
          构建时 (prebuild)
        </text>
        <text x="460" y="30" className="text-[14px] font-medium" fill="currentColor">
          运行时 (client)
        </text>

        {/* 左侧大框 - 构建时 */}
        <rect x="30" y="45" width="280" height="310" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* 右侧大框 - 运行时 */}
        <rect x="420" y="45" width="270" height="150" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <rect x="420" y="215" width="270" height="140" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* ===== 构建时步骤 ===== */}
        {/* 读取 MDX */}
        <rect x="50" y="60" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="80" textAnchor="middle" className="text-[12px]" fill="currentColor">读取 31 篇 MDX</text>

        {/* 箭头 */}
        <line x1="140" y1="90" x2="140" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        {/* 清洗+分词 */}
        <rect x="50" y="110" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="130" textAnchor="middle" className="text-[12px]" fill="currentColor">清洗 + 分词</text>

        <line x1="140" y1="140" x2="140" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        {/* TF-IDF */}
        <rect x="50" y="160" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="180" textAnchor="middle" className="text-[12px]" fill="currentColor">TF-IDF 向量</text>

        <line x1="140" y1="190" x2="140" y2="210" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        {/* 余弦相似度 */}
        <rect x="50" y="210" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="230" textAnchor="middle" className="text-[12px]" fill="currentColor">余弦相似度矩阵</text>

        <line x1="140" y1="240" x2="140" y2="260" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        {/* top-8 + tag boost */}
        <rect x="50" y="260" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="280" textAnchor="middle" className="text-[12px]" fill="currentColor">top-8 + tag boost</text>

        <line x1="140" y1="290" x2="140" y2="310" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        {/* 手动覆盖 */}
        <rect x="50" y="310" width="180" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="140" y="330" textAnchor="middle" className="text-[12px]" fill="currentColor">+ 手动覆盖</text>

        {/* ===== 中间连接：similarity.json ===== */}
        <line x1="230" y1="275" x2="340" y2="275" stroke="currentColor" strokeWidth="1.2" opacity="0.5" strokeDasharray="4 3" />
        <rect x="330" y="258" width="80" height="34" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <text x="370" y="272" textAnchor="middle" className="text-[10px]" fill="currentColor">similarity</text>
        <text x="370" y="286" textAnchor="middle" className="text-[10px]" fill="currentColor">.json</text>

        {/* similarity.json → 右侧上 */}
        <line x1="370" y1="258" x2="370" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeDasharray="4 3" />
        <line x1="370" y1="120" x2="420" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowRight)" />

        {/* similarity.json → 右侧下 */}
        <line x1="410" y1="275" x2="420" y2="275" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowRight)" />

        {/* ===== 运行时上半：文章详情页 ===== */}
        <rect x="440" y="60" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="80" textAnchor="middle" className="text-[12px]" fill="currentColor">文章详情页</text>

        <line x1="555" y1="90" x2="555" y2="107" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        <rect x="440" y="107" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="127" textAnchor="middle" className="text-[12px]" fill="currentColor">→ similarity[slug]</text>

        <line x1="555" y1="137" x2="555" y2="154" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        <rect x="440" y="154" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="174" textAnchor="middle" className="text-[12px]" fill="currentColor">→ 展示推荐列表</text>

        {/* ===== 运行时下半：首页推荐 tab ===== */}
        <rect x="440" y="230" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="250" textAnchor="middle" className="text-[12px]" fill="currentColor">{"首页「推荐」tab"}</text>

        <line x1="555" y1="260" x2="555" y2="277" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        <rect x="440" y="277" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="297" textAnchor="middle" className="text-[12px]" fill="currentColor">→ 读 localStorage</text>

        <line x1="555" y1="307" x2="555" y2="324" stroke="currentColor" strokeWidth="1" opacity="0.4" markerEnd="url(#arrowDown)" />

        <rect x="440" y="324" width="230" height="30" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
        <text x="555" y="344" textAnchor="middle" className="text-[12px]" fill="currentColor">→ 已读×相似度 排序 → 个性化列表</text>

        {/* 箭头 marker 定义 */}
        <defs>
          <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
            <path d="M1 1 L4 5 L7 1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
          </marker>
          <marker id="arrowRight" markerWidth="6" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1 1 L5 4 L1 7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

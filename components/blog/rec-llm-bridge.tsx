"use client";

/**
 * 推荐系统 × 大模型：技术重叠全景 + LLM4Rec 五大范式
 * 合并 rec_llm_overlap_map.html 和 llm4rec_paradigm_map.html
 */

export function RecLLMBridge() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: COMBINED_HTML,
      }}
    />
  );
}

const COMBINED_HTML = `
<style>
.rlb-wrap { padding: 4px 0 16px; font-family: var(--font-sans); }

/* === Overlap Map === */
.ov-cat { margin-bottom: 24px; }
.ov-cat-head {
  font-size: 12px; font-weight: 500; letter-spacing: 0.6px;
  padding: 5px 12px; border-radius: 8px;
  margin-bottom: 10px; display: inline-flex; align-items: center; gap: 7px;
}
.head-purple { background: #EEEDFE; color: #3C3489; border: 0.5px solid #AFA9EC; }
.head-teal   { background: #E1F5EE; color: #085041; border: 0.5px solid #5DCAA5; }
.head-blue   { background: #E6F1FB; color: #0C447C; border: 0.5px solid #85B7EB; }
.head-coral  { background: #FAECE7; color: #712B13; border: 0.5px solid #F0997B; }
.ov-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
@media (max-width: 640px) { .ov-grid { grid-template-columns: 1fr; } }
.ov-card {
  background: var(--color-background-primary, hsl(0,0%,98%));
  border: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
  border-radius: 10px;
  padding: 11px 13px 10px;
}
.ov-card-title { font-size: 13px; font-weight: 500; color: var(--color-text-primary, #111); margin-bottom: 8px; }
.ov-sides { display: flex; align-items: stretch; gap: 0; }
.ov-side {
  flex: 1; font-size: 10.5px; line-height: 1.65;
  padding: 6px 8px; border-radius: 6px;
}
.ov-side-rec  { background: #E6F1FB; color: #0C447C; }
.ov-side-llm  { background: #EEEDFE; color: #3C3489; }
.ov-side-label { font-size: 9.5px; font-weight: 600; letter-spacing: 0.4px; opacity: 0.7; margin-bottom: 2px; }
.ov-bridge {
  display: flex; align-items: center; justify-content: center;
  padding: 0 6px; color: var(--color-text-tertiary, #999); font-size: 13px; flex-shrink: 0;
}
.highlight-border { border-color: #AFA9EC; border-width: 1px; }

/* === Paradigm Map === */
.tension {
  display: flex; align-items: center; gap: 0;
  border: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
  border-radius: 10px;
  overflow: hidden; margin-bottom: 18px;
}
.t-side {
  flex: 1; padding: 10px 14px; font-size: 12px; font-weight: 500;
  line-height: 1.5;
}
.t-rec { background: #E6F1FB; color: #0C447C; }
.t-mid {
  padding: 10px 14px; font-size: 11px; color: var(--color-text-tertiary, #999);
  border-left: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
  border-right: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
  text-align: center; white-space: nowrap;
}
.t-llm { background: #EEEDFE; color: #3C3489; }
.t-sub { font-size: 10.5px; font-weight: 400; opacity: 0.8; }
.paradigm { display: flex; flex-direction: column; gap: 7px; }
.pd {
  background: var(--color-background-primary, hsl(0,0%,98%));
  border: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
  border-radius: 10px;
  overflow: hidden;
}
.pd-head {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px 9px; border-bottom: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
}
.depth-bar { width: 4px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
.d1 { background: #B4B2A9; } .d2 { background: #85B7EB; } .d3 { background: #5DCAA5; } .d4 { background: #AFA9EC; } .d5 { background: #EF9F27; }
.pd-level { font-size: 10px; font-weight: 600; letter-spacing: 0.4px; padding: 2px 7px; border-radius: 3px; flex-shrink: 0; }
.lv1 { background: #F1EFE8; color: #5F5E5A; }
.lv2 { background: #E6F1FB; color: #185FA5; }
.lv3 { background: #E1F5EE; color: #0F6E56; }
.lv4 { background: #EEEDFE; color: #534AB7; }
.lv5 { background: #FAEEDA; color: #854F0B; }
.pd-name { font-size: 13px; font-weight: 500; color: var(--color-text-primary, #111); flex: 1; }
.pd-tagline { font-size: 10.5px; color: var(--color-text-secondary, #666); }
.pd-body { display: flex; gap: 0; }
@media (max-width: 640px) { .pd-body { flex-direction: column; } }
.pd-mech {
  flex: 1.4; padding: 10px 14px; font-size: 11px;
  color: var(--color-text-secondary, #666); line-height: 1.75;
  border-right: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
}
@media (max-width: 640px) { .pd-mech { border-right: none; border-bottom: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%)); } }
.pd-papers {
  flex: 1; padding: 10px 14px; font-size: 10.5px;
  color: var(--color-text-tertiary, #999); line-height: 1.75;
}
.pd-mech b, .pd-papers b { color: var(--color-text-primary, #111); font-weight: 500; }
.pain { color: #993C1D; } .win { color: #0F6E56; }
.paper-tag {
  display: inline-block; font-size: 9.5px; padding: 1px 6px;
  border-radius: 3px; margin: 1px 2px 1px 0;
  background: var(--color-background-secondary, #f5f5f5);
  color: var(--color-text-secondary, #666);
  border: 0.5px solid var(--color-border-tertiary, hsl(0,0%,90%));
}
.section-label {
  font-size: 10.5px; color: var(--color-text-tertiary, #999);
  margin-bottom: 6px; margin-top: 24px; letter-spacing: 0.3px;
}

/* Dark mode */
:is(.dark) .ov-side-rec { background: #1a2a3a; color: #7fb8e8; }
:is(.dark) .ov-side-llm { background: #1e1d3a; color: #b0a8f0; }
:is(.dark) .t-rec { background: #1a2a3a; color: #7fb8e8; }
:is(.dark) .t-llm { background: #1e1d3a; color: #b0a8f0; }
:is(.dark) .head-purple { background: #2a2850; color: #b0a8f0; }
:is(.dark) .head-teal { background: #162e26; color: #6dc4a0; }
:is(.dark) .head-blue { background: #1a2a3a; color: #7fb8e8; }
:is(.dark) .head-coral { background: #2d1a14; color: #f0997b; }
:is(.dark) .pain { color: #f0997b; }
:is(.dark) .win { color: #6dc4a0; }
:is(.dark) .lv4 { background: #2a2850; color: #b0a8f0; }
:is(.dark) .lv5 { background: #2d2010; color: #f0c060; }
</style>

<div class="rlb-wrap">

<!-- Part 1: 四层重叠全景 -->
<div class="ov-cat">
  <div class="ov-cat-head head-purple">第一层：完全共享 — 同一套技术，两边都在用</div>
  <div class="ov-grid">
    <div class="ov-card highlight-border">
      <div class="ov-card-title">Transformer / Attention</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>BST / SASRec / BERT4Rec<br>DIN Target-Attention</div>
        <div class="ov-bridge">=</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>GPT / LLaMA / Qwen<br>MHA → GQA → MLA</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">Embedding 向量化</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>Item/User Embedding<br>Field Value Emb</div>
        <div class="ov-bridge">=</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>Token Embedding<br>Position Embedding</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">ANN 近似最近邻检索</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>召回层向量检索<br>Faiss / HNSW / Milvus</div>
        <div class="ov-bridge">=</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>RAG 文档检索<br>Faiss / HNSW / pgvector</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">知识蒸馏 / 模型压缩</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>轻量粗排蒸馏<br>Teacher→Student</div>
        <div class="ov-bridge">=</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>Alpaca / Vicuna 蒸馏<br>QLoRA 压缩部署</div>
      </div>
    </div>
  </div>
</div>

<div class="ov-cat">
  <div class="ov-cat-head head-teal">第二层：范式共享 — 同一思路，不同实例化</div>
  <div class="ov-grid">
    <div class="ov-card">
      <div class="ov-card-title">序列建模（核心交叉）</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>GRU4Rec / SASRec<br>BERT4Rec（行为序列）</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>GPT（Token序列）<br>BERT（双向语言模型）</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">混合专家 MoE</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>MMoE / PLE<br>多目标 Gate 路由</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>Mixtral / DeepSeekMoE<br>Token级稀疏路由</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">自监督预训练</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>行为掩码预测<br>对比学习增强</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>MLM / CLM 预训练<br>万亿 Token 语料</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">对比学习 / 双塔</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>DSSM 双塔召回<br>In-batch Negative</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>SimCSE / E5<br>文本向量表示学习</div>
      </div>
    </div>
  </div>
</div>

<div class="ov-cat">
  <div class="ov-cat-head head-blue">第三层：目标共享 — 优化同类问题</div>
  <div class="ov-grid">
    <div class="ov-card">
      <div class="ov-card-title">偏好预测（结构几乎相同）</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>CTR 预估模型<br>点击=偏好信号</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>RLHF Reward Model<br>人类偏好打分</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">Scaling Laws</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>参数 × 数据最优配比<br>竞赛 $45K 奖项方向</div>
        <div class="ov-bridge">?</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>Kaplan / Chinchilla<br>计算最优 N∝D</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">多任务学习</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>CTR + CVR + GMV<br>共享底层特征塔</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>指令微调多任务<br>FLAN / T0</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">因果推断 / 去偏</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>曝光偏差 IPW / DR<br>位置偏差修正</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>对齐偏差去除<br>奖励模型偏差修正</div>
      </div>
    </div>
  </div>
</div>

<div class="ov-cat">
  <div class="ov-cat-head head-coral">第四层：LLM → 推荐 直接融合（最前沿，单向流动）</div>
  <div class="ov-grid">
    <div class="ov-card">
      <div class="ov-card-title">LLM 直接做推荐</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐视角</div>P5 / LLMRec / TALLRec<br>LLM4Rec 精排器</div>
        <div class="ov-bridge">→</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">LLM能力</div>文本推理 + 世界知识<br>Zero-shot 泛化</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">冷启动 × 语义理解</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>新用户/新物品冷启<br>无行为数据困境</div>
        <div class="ov-bridge">→</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">LLM能力</div>语义 Emb 补全特征<br>文本描述理解物品</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">RAG ↔ 召回 + 排序</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>召回（retrieve）<br>精排（rank）两阶段</div>
        <div class="ov-bridge">≈</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">大语言模型</div>RAG：检索 + 生成<br>Re-ranker 重排</div>
      </div>
    </div>
    <div class="ov-card">
      <div class="ov-card-title">合成数据生成</div>
      <div class="ov-sides">
        <div class="ov-side ov-side-rec"><div class="ov-side-label">推荐系统</div>数据增强 / 负样本<br>用户行为模拟</div>
        <div class="ov-bridge">→</div>
        <div class="ov-side ov-side-llm"><div class="ov-side-label">LLM能力</div>生成偏好数据<br>用户 Profile 描述</div>
      </div>
    </div>
  </div>
</div>

<!-- Part 2: 第四层展开 — 五大范式 -->
<div class="section-label">第四层展开：LLM 做推荐的五大范式（浅→深）</div>

<div class="tension">
  <div class="t-side t-rec">传统推荐<br><span class="t-sub">协同过滤 ID · 点击行为 · CF信号</span></div>
  <div class="t-mid">← ID vs Text →</div>
  <div class="t-side t-llm" style="text-align:right">大语言模型<br><span class="t-sub">文本语义 · 世界知识 · 推理能力</span></div>
</div>

<div class="paradigm">
  <div class="pd">
    <div class="pd-head">
      <div class="depth-bar d1"></div>
      <span class="pd-level lv1">浅层 ①</span>
      <span class="pd-name">LLM 作为零样本排序器</span>
      <span class="pd-tagline">无微调，直接提示</span>
    </div>
    <div class="pd-body">
      <div class="pd-mech">
        <b>机制：</b>把用户历史行为转成自然语言 prompt，让 LLM 直接输出推荐结果。无需推荐数据微调。<br><br>
        <span class="win">✓ 零样本泛化，冷启动友好</span><br>
        <span class="win">✓ 利用世界知识</span><br>
        <span class="pain">✗ 完全忽略协同过滤信号</span><br>
        <span class="pain">✗ 延迟极高，无法在线服务</span>
      </div>
      <div class="pd-papers">
        <b>代表</b><br>
        <span class="paper-tag">ChatRec 2023</span>
        <span class="paper-tag">LLMRank 2023</span>
        <span class="paper-tag">GPT4Rec 2023</span>
      </div>
    </div>
  </div>

  <div class="pd">
    <div class="pd-head">
      <div class="depth-bar d2"></div>
      <span class="pd-level lv2">浅层 ②</span>
      <span class="pd-name">LLM 作为语义特征编码器</span>
      <span class="pd-tagline">冻结 LLM，提取 Embedding</span>
    </div>
    <div class="pd-body">
      <div class="pd-mech">
        <b>机制：</b>用冻结的 LLM 把物品标题/描述编码成语义向量，替代或增强传统 ID Embedding。<br><br>
        <span class="win">✓ 语义 Emb 解决冷启动</span><br>
        <span class="win">✓ LLM 只做离线推断，延迟可控</span><br>
        <span class="pain">✗ 冻结 LLM 无法学习推荐偏好</span><br>
        <span class="pain">✗ 语义相似 ≠ 用户偏好相似</span>
      </div>
      <div class="pd-papers">
        <b>代表</b><br>
        <span class="paper-tag">UniSRec 2022</span>
        <span class="paper-tag">MoRec 2023</span>
        <span class="paper-tag">RLMRec 2024</span>
      </div>
    </div>
  </div>

  <div class="pd">
    <div class="pd-head">
      <div class="depth-bar d3"></div>
      <span class="pd-level lv3">中层 ③</span>
      <span class="pd-name">统一文本生成框架 (P5)</span>
      <span class="pd-tagline">微调 LLM，推荐任务→文本生成</span>
    </div>
    <div class="pd-body">
      <div class="pd-mech">
        <b>机制：</b>把评分预测、序列推荐、解释生成等全部转成 Seq2Seq 任务，用推荐数据微调 T5/LLaMA。<br><br>
        <span class="win">✓ 统一框架，多任务联合</span><br>
        <span class="win">✓ 可生成推荐理由</span><br>
        <span class="pain">✗ 物品 ID 对 LLM 无语义意义</span><br>
        <span class="pain">✗ 生成速度慢，难工业落地</span>
      </div>
      <div class="pd-papers">
        <b>代表</b><br>
        <span class="paper-tag">P5 2022</span>
        <span class="paper-tag">TALLRec 2023</span>
        <span class="paper-tag">LLaRA 2023</span>
      </div>
    </div>
  </div>

  <div class="pd" style="border-color: #AFA9EC;">
    <div class="pd-head">
      <div class="depth-bar d4"></div>
      <span class="pd-level lv4">深层 ④ — 分水岭</span>
      <span class="pd-name">语义 ID：让 LLM 真正"认识"物品</span>
    </div>
    <div class="pd-body">
      <div class="pd-mech">
        <b>机制：</b>用 RQ-VAE 把物品编码成离散语义 token（如 [42, 7, 156]），既有语义含义又捕获协同信号，直接进 LLM 词表。<br><br>
        <span class="win">✓ 同时捕获语义 + 协同过滤信号</span><br>
        <span class="win">✓ LLM 可生成新物品 token（泛化）</span><br>
        <span class="win">✓ 与 LLM 预训练框架完全兼容</span><br>
        <span class="pain">✗ 量化训练复杂，token 数量爆炸</span><br>
        <span class="pain">✗ 推理延迟仍是瓶颈</span>
      </div>
      <div class="pd-papers">
        <b>代表</b><br>
        <span class="paper-tag">TIGER 2023</span>
        <span class="paper-tag">VQ-Rec 2023</span>
        <span class="paper-tag">LCRec 2023</span>
        <span class="paper-tag">LETTER 2024</span>
      </div>
    </div>
  </div>

  <div class="pd" style="border-color: #EF9F27;">
    <div class="pd-head">
      <div class="depth-bar d5"></div>
      <span class="pd-level lv5">前沿 ⑤</span>
      <span class="pd-name">端到端统一 Backbone</span>
      <span class="pd-tagline">序列行为 + 多字段特征 → 同一架构</span>
    </div>
    <div class="pd-body">
      <div class="pd-mech">
        <b>机制：</b>统一 token 化方案，行为序列、类别特征、目标物品进入同一个同构可堆叠 Backbone，一次前向传播完成所有交互。<br><br>
        <span class="win">✓ 消除粗排/精排结构割裂</span><br>
        <span class="win">✓ 遵循 Scaling Law，可系统扩展</span><br>
        <span class="pain">✗ 工业落地延迟挑战极大</span><br>
        <span class="pain">✗ 尚无成熟范式</span>
      </div>
      <div class="pd-papers">
        <b>代表</b><br>
        <span class="paper-tag">HSTU Meta 2024</span>
        <span class="paper-tag">FEARec</span>
        <span class="paper-tag">UniBlock竞赛</span>
      </div>
    </div>
  </div>
</div>

</div>
`;

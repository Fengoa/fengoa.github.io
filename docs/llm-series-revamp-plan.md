# LLM 系列博客优化规划

基于已完成的 `minimal-llm`（标杆）和 `llm-tokenizer`（已优化）两篇，对剩余 11 篇博客逐一规划内容改写和可视化补充。

## 标杆范式（minimal-llm 的"四件套"）

每篇都需要对齐这套结构：

1. **开头 hook**：具象生活场景 + 主可视化组件（如 `NextTokenPrediction` 在文章开头第一屏）
2. **正文穿插 4–7 个动画/交互组件**：每个核心概念配一张可交互图，替代 ASCII 框图
3. **公式用 `<Math block>`**：LaTeX 渲染，模板字符串包裹
4. **结尾三件套**：「和工业界的距离」对比表 + Colab 链接 + 参考论文表
5. **不用 `---` 分隔线**：靠 `##` 自然分节
6. **散文化叙述**：避免内联粗体冒号列表（`**xxx：** yyy`）、三段式排比、过度列表化

---

## 全系列共性问题（必须批量处理）

1. **代码块污染（高优先级 bug）**
   - `llm-transformer/page.mdx`: 第 65、70、120 行
   - `llm-inference/page.mdx`: 第 100、106、109 行
   - `llm-rag/page.mdx`: 第 130、136、145 行
   - `llm-deploy/page.mdx`: 第 33、38、90、152、157 行
   - 现象：代码块或 YAML 块中混入了 `<SeriesNav series="llm" />`，导致渲染破损
   - 修复：第一轮先全局检查所有 13 篇，把所有错位的 `<SeriesNav>` 删除，只在文章 H1 之后保留一处

2. **可视化覆盖率**
   - 仅 `minimal-llm`、`llm-tokenizer`、`llm-landscape` 有 React 组件
   - 其余 10 篇全部依赖 ASCII 框图和 markdown 表格
   - 目标：每篇至少 3 个组件，核心算法篇（attention / transformer / scaling-law）补到 5–6 个

3. **`---` 分隔线泛滥**：每篇 8–12 处，全部删除，改用 `##` 二级标题

4. **粗体冒号列表**：`**xxx：** yyy` 这种 humanizer-zh 第 15 条要改的模式，每篇都有

5. **Math 公式缺失**：除 `scaling-law` 外几乎无 `<Math block>`

6. **Colab 链接缺失**：所有 11 篇都没有，需要补「动手跑一遍」入口

---

## 逐篇规划

### 1. llm-attention：Attention 到底在做什么

**现状**：0 组件 / 0 Math 公式 / 无 Colab。所有可视化都是 ASCII，包括四个 head 的注意力模式表格——最该可视化却没可视化的部分。

**核心问题**：
- 开头三段式列表 + 粗体冒号 + 大量 `---`
- Step 1–5 的并列子标题让叙事支离
- 「在真实模型上看 Attention」四个干巴巴的 ASCII 表格
- 和 minimal-llm 的 MiniGPT 一节内容重叠，定位需要从「重新介绍 Q/K/V」改为「深入展开」

**新增组件**（4 个）：
1. `qkv-projection` — 一个 token embedding 通过 W_q/W_k/W_v 三个矩阵投影成 Q/K/V，hover 高亮三个角色
2. `attention-score-matrix` — `I am a cat` 4×4 注意力矩阵，可切换「加 mask 前/后」「softmax 前/后」，点击行高亮该 token 的注意力分布
3. `multi-head-patterns` — 真实 MiniGPT 的多个 head 注意力热力图，tab 切换 layer，hover head 看 top-3 关注位置
4. `mlp-vs-attention` — 左右分屏：换不同输入句子，MLP 权重不变 vs Attention 权重重新分布

**改写要点**：
- 开头改为「输入一句话，看 cat 这个 token 在生成时看了哪些字」的具象切入
- Step 1–5 散文化，参考 minimal-llm 的 MiniGPT 节奏
- 所有 ```text``` 里的公式改成 `<Math block>`
- 补 Colab：跑 `visualize_attention.py`

---

### 2. llm-transformer：搭一个完整的 Transformer

**现状**：0 组件 / 0 Math 公式 / 无 Colab。Block 结构图、消融对比表、Cosine LR 曲线、参数量计算全是 ASCII。**有 SeriesNav 误插入 bug**。

**核心问题**：
- 「消融实验四件套」模板感强，每节都以 `**去掉后果：loss +X.XX**` 起手
- 9 处 `---` 分隔线
- LayerNorm 的「音量旋钮」类比挺好，其它三节没有同等水平的具象类比，节奏不平衡
- 完整结构 ASCII 大图横跨 30 行，移动端不友好

**新增组件**（5 个）：
1. `ablation-bar-chart` — 消融变体的 val loss 柱状图，hover 看训练曲线对比
2. `transformer-block-flow` — 一个 Block 内 x → LayerNorm → Attention → +x → LayerNorm → FFN → +x 的动画分步播放
3. `layernorm-effect` — 张量经过 LayerNorm 前后的分布直方图，调节「前一层 scale」滑块看不归一化时数值如何爆炸
4. `ffn-expansion` — 128 → 512 → 128 的维度扩张-收缩，可视化 GELU 非线性
5. `param-breakdown-pie` — MiniGPT 42 万参数的饼图（embedding/attention/ffn/lm_head），可切换到 GPT-2 Small 124M 看比例几乎不变

**改写要点**：
- 修复 SeriesNav bug
- 消融四节合并散文化，删 `**去掉后果**` 模板
- 参数量计算用饼图替代 ASCII 表格
- 完整结构改为 `transformer-block-flow` 主动画

---

### 3. llm-rope：位置编码 RoPE

**现状**：0 组件 / 0 Math 公式（虽然 RoPE 全是数学）/ 无 Colab。

**核心问题**：
- 「绝对位置编码的问题」一节用 ```text``` 框写「ctx=64，第 65 个 token 没法处理」，缺直观示例
- 「旋转的直觉」用「时钟秒针/时针」做类比，但没有可视化呈现
- 实验对比表是静态数字
- 缺少「外推能力」的核心卖点演示

**新增组件**（4 个）：
1. `position-embedding-failure` — 训练 ctx=64 的模型，输入第 65 个 token 时位置 embedding 表越界，loss 爆炸的对比可视化
2. `rope-2d-rotation` — 2D 平面上一个向量按位置角度旋转的动画，不同维度对应不同频率（多个旋转向量并排）
3. `rope-frequency-clock` — 类比时钟，秒针（高频，短周期）+ 时针（低频，长周期）+ 中间频率，组合后能唯一确定时间点
4. `extrapolation-comparison` — 三种位置编码（绝对学习 / 正弦 / RoPE）在训练长度外的 loss 对比折线

**改写要点**：
- 开头 hook：训好的模型遇到比训练长度更长的输入直接崩，引出「外推」诉求
- RoPE 公式必须用 `<Math block>`：`q_m · k_n = f(q, k, m-n)`
- 「旋转的直觉」用 `rope-2d-rotation` 替代文字描述
- 补 Colab：在小模型上对比三种位置编码

---

### 4. llm-efficient-attention：高效 Attention（KV Cache、GQA、Flash）

**现状**：根据现有目录，应该和 inference 优化部分有重叠，需要重点处理 KV Cache、Grouped Query Attention、Flash Attention 三个主题。

**新增组件**（4 个）：
1. `kv-cache-growth` — 序列长度增加时 KV Cache 显存占用的增长曲线，对比 GQA 减少多少
2. `gqa-head-grouping` — MHA / MQA / GQA 三种 head 分组方式的可视化对比，参数量同步显示
3. `flash-attention-tiling` — 注意力矩阵分块计算的动画，对比朴素实现 O(N²) 显存 vs Flash 的 O(N) 显存
4. `attention-memory-roofline` — 不同序列长度下，朴素 / KV Cache / GQA / Flash 四种方案的显存 + 速度对比

**改写要点**：
- 四个优化技术按「问题—方案—效果」的统一节奏组织
- 每个技术配一张可视化
- 工业界对比表强调 LLaMA、Mistral、DeepSeek 用了哪些

---

### 5. llm-training：训练，让模型学会说话

**现状**：0 组件 / 0 Math / 无 Colab。Loss 曲线只有文本表格。

**核心问题**：
- 训练技巧 4 个并列子标题堆砌（warmup / cosine decay / weight decay / gradient clip）
- 过拟合的 train/val gap 没有视觉冲击
- AdamW 的 β/weight decay 只列参数无直觉解释

**新增组件**（4 个）：
1. `loss-curve-chart` — 交互式 train/val 双曲线 + 最佳点标记 + early stopping 区间高亮
2. `generation-evolution-slider` — 拖动训练 step 看生成文本演变（step 0 / 1k / 5k / 10k / 50k 的样例）
3. `lr-schedule-plot` — warmup + cosine decay 实时曲线，可调超参
4. `params-vs-data-ratio` — N/D 比值条形图（这个项目 vs Chinchilla 最优 vs LLaMA 实际）

**改写要点**：
- 训练技巧改为「有/没有该技巧」的 loss 曲线对比图（可视化驱动）
- 用一段连贯叙事替代加粗冒号列表
- 补 Colab：「5 分钟跑过拟合实验」

---

### 6. llm-scaling-law：更大一定更好吗

**现状**：0 组件 / ✅Math / 无 Colab。三组实验全是 ASCII 表格——最适合做曲线却浪费了。

**核心问题**：
- 每节「规律：xxx——yyy」句式重复
- 涌现能力段落突兀
- GPT-3 vs Chinchilla 对比表信息密度低

**新增组件**（4 个）：
1. `scaling-law-loglog-plot` — log-log 坐标三条幂律曲线（N/D/C），可切换轴
2. `compute-optimal-frontier` — 固定 FLOPs 等高线 + 参数/数据配比最优点
3. `emergence-vs-smooth-chart` — 平滑能力（accuracy）vs 涌现能力（突跃）的对比双面板
4. `chinchilla-ratio-calculator` — 输入参数量自动算所需 token，提示 GPT-3 多大程度上数据不足

**改写要点**：
- 三个实验合并为一张可切 tab 的交互图
- 涌现能力可视化替代列表
- 补 Colab：拖动滑块复现 Chinchilla 配比

---

### 7. llm-sft：SFT，教模型听话

**现状**：篇幅偏短（约 100 行）。LoRA 这个核心概念只用 10 行带过。0 组件 / ⚠️文本式 LoRA 公式 / 无 Colab。

**核心问题**：
- LoRA 的低秩分解只有文本，最该有矩阵分解可视化
- 灾难性遗忘只有 4 行 + 3 条 bullet
- 没有 SFT 前后实际效果对比（关键卖点缺失）

**新增组件**（4 个）：
1. `before-after-sft-demo` — 同一 prompt 在 base 模型 vs SFT 后的输出对比（左右卡片）
2. `lora-matrix-decomposition` — W + BA 矩阵分解动画，参数量随 r 变化
3. `chat-template-comparator` — Alpaca / ChatML / LLaMA-2 三种模板 side-by-side
4. `catastrophic-forgetting-plot` — 通用能力 vs 指令遵循随训练步数变化的双曲线

**改写要点**：
- 扩充 LoRA 章节：秩 r 选择实验、QLoRA 简介
- 开篇加 `before-after-sft-demo` 直观切入
- 补 Colab：用 LoRA 在小数据集上微调

---

### 8. llm-dpo：让模型对齐人类偏好

**现状**：0 组件（连 import 都没有） / ❌核心 DPO loss 没用 `<Math block>` / 无 Colab。

**核心问题**：
- 「翻译成人话」后跟三个粗体冒号短句列表
- RLHF 三步整段塞进 ```text``` 框
- β 含义节用 ```text``` 框装「β 大 / β 小」列表
- 11 处 `---` 分隔线

**新增组件**（4 个）：
1. `preference-pair-example` — 同一 prompt 下 chosen / rejected 两个回答的对比卡片，DPO 训练前后概率分化动画
2. `rlhf-vs-dpo-pipeline` — 上下两条 pipeline，RLHF 4 个模型方块 vs DPO 2 个，标显存占用对比
3. `dpo-loss-landscape` — 二维 sigmoid 曲面，横轴 chosen log-prob ratio，纵轴 rejected，β slider 调陡峭度
4. `beta-tradeoff` — β 数轴，下面同步显示不同 β 下的回答样例

**改写要点**：
- 开头用具象 prompt（如「我难过的时候该怎么办」）展示 chosen/rejected
- DPO loss 必须用 `<Math block>` 渲染
- β 一节散文化，去掉 ```text``` 框和粗体冒号
- 补 Colab：toy 例子上跑 DPO

---

### 9. llm-inference：推理优化

**现状**：0 组件 / 0 Math / 无 Colab。**有 SeriesNav 误插入 bug**。

**核心问题**：
- 三个核心优化（量化 / 投机解码 / 连续批处理）每个不到 20 行解释
- 「效果汇总」表把 KV Cache、GQA、Flash 混进来，对读者信息超载
- 「思路：1. 2. 3.」数字列表 + 粗体词

**新增组件**（5 个）：
1. `quantization-bits` — 同一权重在 FP32 / FP16 / INT8 / INT4 下的二进制位数和还原误差，整个权重矩阵色块图四种精度并排
2. `weight-distribution-histogram` — 真实 LLaMA 权重直方图，证明大部分集中在 [-0.1, 0.1]，叠加 INT4 的 16 个量化点
3. `speculative-decoding-flow` — 上下两条时间轴，普通自回归 vs 投机解码的总耗时对比动画
4. `continuous-batching-timeline` — 时间步 × 请求槽位，static vs continuous 的填充对比
5. `latency-throughput-tradeoff` — 不同 batch size 下的延迟-吞吐曲线

**改写要点**：
- 修复 SeriesNav bug
- 「效果汇总」拆开，KV/GQA/Flash 划归 efficient-attention 篇
- 量化的 scale/zero-point 用 `<Math block>`

---

### 10. llm-rag：给模型外接知识

**现状**：0 组件 / 0 Math / 无 Colab。**有 SeriesNav 误插入 bug**（行 130、136、145）。

**核心问题**：
- 三个「常见问题」都是「问题/解法」句式，三个解法都是 bullet list
- 流程图是 ASCII 竖线箭头
- 没有 embedding 相似度的可视化（RAG 最核心的语义检索没图）

**新增组件**（4 个）：
1. `rag-pipeline-flow` — 交互式流程图（query → embed → retrieve → augment → generate），点击节点查看中间状态
2. `embedding-2d-projection` — query 和文档 chunk 投影到 2D，高亮 top-k 检索结果
3. `chunk-strategy-comparator` — 同一文档 4 种切分策略的可视对比
4. `rag-vs-finetune-decision-tree` — 决策树替代对比表

**改写要点**：
- 修复 SeriesNav bug
- 三个常见问题改成一个真实 case study（query 走错检索 → 多种修复手段递进）
- 补 Colab：50 行跑通最小 RAG

---

### 11. llm-deploy：部署上线

**现状**：0 组件 / 0 Math / 无 Colab。**有 SeriesNav 误插入 bug**（行 33、38、90、152、157）。

**核心问题**：
- 每节都是「xxx：…然后代码块」，缺乏叙事
- 成本估算只有静态数字，最适合做计算器
- API 兼容部分只列 endpoint，缺真实请求/响应对比

**新增组件**（4 个）：
1. `streaming-vs-batch-demo` — 实时打字机效果 vs 一次性返回，TTFT 对比
2. `cost-calculator-self-vs-api` — 滑块输入月 token 量，自动算自部署 vs API 成本拐点
3. `inference-framework-radar` — vLLM / TGI / llama.cpp / Ollama 五维雷达图（吞吐/延迟/易用/资源/生态）
4. `deployment-architecture-diagram` — Docker → Nginx → vLLM 集群分层架构

**改写要点**：
- 修复 SeriesNav bug
- 「就这样。」式短句改散文
- 补一个真实压测数据小节（QPS / P99）

---

### 12. llm-landscape：大模型全景图（收官）

**现状**：1 个组件（`LLMSystemLandscape`）/ 0 Math / 无 Colab。**「这张图怎么看」小节是空的**。

**核心问题**：
- 空白小节需要补全或删除
- 技术演进时间线是 ASCII 列表
- 前沿方向 4 小节回到「标题 + 短描述 + 代码块」老套路
- 收官篇缺少全系列回顾的可视化（学习路径图）
- 无总参考论文清单

**新增组件**（4 个）：
1. `llm-timeline-interactive` — 可缩放时间轴，节点点击查看模型详情和代表论文
2. `series-learning-path-map` — 14 篇文章的知识依赖图谱
3. `open-source-models-scatter` — 参数量 × 发布时间散点图，气泡大小 = 社区影响
4. `moe-routing-animation` — token 路由到不同 expert 的动画

**改写要点**：
- 补全或删除空白「这张图怎么看」
- 时间线改交互组件
- 「和推荐系统对比」可扩展为独立可视化（双领域并列架构图）
- 补全系列总参考清单

---

## 执行优先级建议

### Wave 1：紧急修复（~30 分钟）
- 批量删除所有代码块中误插入的 `<SeriesNav series="llm" />`（4 篇 / 12 处）
- 全局检查脚本：`grep -rn "<SeriesNav" app/blog/llm-*` 确认每篇只在 H1 后出现一次

### Wave 2：核心算法篇（最高 ROI）
按重要性排序：
1. `llm-attention` — 4 组件 + Math 公式 + 散文化
2. `llm-transformer` — 5 组件 + 修复 bug
3. `llm-rope` — 4 组件 + Math 公式（外推数学是核心）
4. `llm-efficient-attention` — 4 组件

### Wave 3：训练对齐篇
5. `llm-training` — 4 组件 + Colab
6. `llm-sft` — 4 组件 + 扩充 LoRA + Colab
7. `llm-dpo` — 4 组件 + Math 公式 + Colab
8. `llm-scaling-law` — 4 组件（曲线）+ Colab

### Wave 4：工程篇
9. `llm-inference` — 5 组件 + 修复 bug
10. `llm-rag` — 4 组件 + 修复 bug + Colab
11. `llm-deploy` — 4 组件 + 修复 bug

### Wave 5：收官
12. `llm-landscape` — 补全空白小节 + 4 组件 + 总参考清单

---

## 复用 / 抽取的组件

部分组件可以跨文章复用，建议提到 `components/blog/llm/` 公共目录：

- `VisualFrame`（已在 `minimal-llm/visuals/frame.tsx`，可提升为公共组件）
- `BeforeAfterCompare`（SFT、Attention、训练技巧多处会用）
- `MetricBarChart`（消融、Scaling Law、训练对比都需要柱状图基础设施）
- `LineChart` / `LogLogChart`（loss 曲线、scaling law、效果对比）

每篇文章自己的 `visuals/` 子目录只放该篇专属组件，公共图表组件抽到 `components/blog/llm/charts/`。

---

## 写作清单（每篇执行前确认）

- [ ] `use_skill humanizer-zh` 校准写作风格
- [ ] 删除全部 `---` 分隔线
- [ ] 删除/改写所有 `**xxx：** yyy` 粗体冒号列表
- [ ] 公式用 `<Math block>{...}`，不要写在代码块里
- [ ] 字号最低 `text-xs`（SVG `<text>` 例外）
- [ ] 配图加 `<figcaption>` 说明
- [ ] 检查是否有遗留的 `<SeriesNav>` 在代码块里
- [ ] 结尾三件套齐全（工业界对比 + Colab + 参考论文）

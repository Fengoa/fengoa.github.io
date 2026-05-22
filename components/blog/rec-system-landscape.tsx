"use client";

import { cn } from "@/lib/utils";

/*
 * Colors directly from rec-system-v2.html
 * Light: original colors. Dark: desaturated + darkened variants.
 */
const themes = {
  data: {
    bg: "bg-[#e6f1fb] dark:bg-[#1a2a3a]",
    cardBg: "bg-white dark:bg-[#1f2f3f]",
    cardBorder: "border-[#b5d4f4] dark:border-[#2d4a6a]",
    title: "text-[#042c53] dark:text-[#a8cef0]",
    name: "text-[#0c447c] dark:text-[#7fb8e8]",
    desc: "text-[#185fa5] dark:text-[#6aa3d6]",
    chip: "bg-[#b5d4f4] text-[#0c447c] dark:bg-[#2d4a6a] dark:text-[#a8cef0]",
  },
  feat: {
    bg: "bg-[#e1f5ee] dark:bg-[#162e26]",
    cardBg: "bg-white dark:bg-[#1b3830]",
    cardBorder: "border-[#9fe1cb] dark:border-[#2a5e4a]",
    title: "text-[#04342c] dark:text-[#8ed8b8]",
    name: "text-[#085041] dark:text-[#6dc4a0]",
    desc: "text-[#0f6e56] dark:text-[#5ab890]",
    chip: "bg-[#9fe1cb] text-[#085041] dark:bg-[#2a5e4a] dark:text-[#8ed8b8]",
  },
  recall: {
    bg: "bg-[#eeedfe] dark:bg-[#1e1d3a]",
    cardBg: "bg-white dark:bg-[#252440]",
    cardBorder: "border-[#afa9ec] dark:border-[#4a4580]",
    title: "text-[#26215c] dark:text-[#c4c0f0]",
    name: "text-[#3c3489] dark:text-[#a8a2e0]",
    desc: "text-[#534ab7] dark:text-[#9590d0]",
    chip: "bg-[#afa9ec] text-[#26215c] dark:bg-[#4a4580] dark:text-[#c4c0f0]",
  },
  rank: {
    bg: "bg-[#faece7] dark:bg-[#2e1c15]",
    cardBg: "bg-white dark:bg-[#38241c]",
    cardBorder: "border-[#f5c4b3] dark:border-[#6a3d2d]",
    title: "text-[#4a1b0c] dark:text-[#f0b8a0]",
    name: "text-[#993c1d] dark:text-[#e09070]",
    desc: "text-[#d85a30] dark:text-[#d07850]",
    chip: "bg-[#f5c4b3] text-[#993c1d] dark:bg-[#6a3d2d] dark:text-[#f0b8a0]",
  },
  rerank: {
    bg: "bg-[#fbeaf0] dark:bg-[#2e1520]",
    cardBg: "bg-white dark:bg-[#381c28]",
    cardBorder: "border-[#f4c0d1] dark:border-[#6a3048]",
    title: "text-[#4b1528] dark:text-[#f0b0c8]",
    name: "text-[#72243e] dark:text-[#e090a8]",
    desc: "text-[#993556] dark:text-[#d07090]",
    chip: "bg-[#f4c0d1] text-[#72243e] dark:bg-[#6a3048] dark:text-[#f0b0c8]",
  },
  strat: {
    bg: "bg-[#eaf3de] dark:bg-[#1c2a14]",
    cardBg: "bg-white dark:bg-[#24351a]",
    cardBorder: "border-[#c0dd97] dark:border-[#4a6830]",
    title: "text-[#173404] dark:text-[#b0d888]",
    name: "text-[#27500a] dark:text-[#90c460]",
    desc: "text-[#3b6d11] dark:text-[#78b040]",
    chip: "bg-[#c0dd97] text-[#27500a] dark:bg-[#4a6830] dark:text-[#b0d888]",
  },
  eval: {
    bg: "bg-[#faeeda] dark:bg-[#2e2210]",
    cardBg: "bg-white dark:bg-[#382c18]",
    cardBorder: "border-[#fac775] dark:border-[#6a5020]",
    title: "text-[#412402] dark:text-[#f0c870]",
    name: "text-[#633806] dark:text-[#e0b050]",
    desc: "text-[#854f0b] dark:text-[#c89830]",
    chip: "bg-[#fac775] text-[#633806] dark:bg-[#6a5020] dark:text-[#f0c870]",
  },
} as const;

type ThemeKey = keyof typeof themes;

/* ─── Sub-components ─── */

function Connector({ label, theme }: { label: string; theme: ThemeKey }) {
  const t = themes[theme];
  return (
    <div className="flex flex-col items-center py-2 gap-1">
      <div className="w-px h-3 bg-[#ccc] dark:bg-[#444]" />
      <span
        className={cn(
          "text-[10px] font-semibold px-3 py-0.5 rounded-full",
          t.chip
        )}
      >
        {label}
      </span>
      <div className="w-px h-3 bg-[#ccc] dark:bg-[#444]" />
    </div>
  );
}

function Card({
  name,
  children,
  theme,
  frontier,
}: {
  name: string;
  children: React.ReactNode;
  theme: ThemeKey;
  frontier?: boolean;
}) {
  const t = themes[theme];
  return (
    <div
      className={cn(
        "flex-1 min-w-[130px] rounded-lg p-2.5 border",
        t.cardBg,
        t.cardBorder,
        frontier && "border-l-2 border-l-[#7F77DD]"
      )}
    >
      <div className={cn("text-[11px] font-semibold mb-1", t.name)}>
        {name}
      </div>
      <div className={cn("text-[10px] leading-[1.7]", t.desc)}>{children}</div>
    </div>
  );
}

function Layer({
  title,
  theme,
  tag,
  children,
}: {
  title: string;
  theme: ThemeKey;
  tag?: "new" | "frontier";
  children: React.ReactNode;
}) {
  const t = themes[theme];
  return (
    <div className={cn("rounded-xl p-4", t.bg)}>
      <div className={cn("text-[13px] font-semibold mb-3 flex items-center gap-2", t.title)}>
        {title}
        {tag === "new" && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#d85a30] text-white">
            NEW
          </span>
        )}
        {tag === "frontier" && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#7F77DD] text-white">
            前沿
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Frontier({ children }: { children: React.ReactNode }) {
  return <span className="text-[#7F77DD] dark:text-[#a8a2e8] italic">{children}</span>;
}

/* ─── Main Component ─── */

export function RecSystemLandscape({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col text-sm", className)}>
      {/* ① Data Layer */}
      <Layer title="① 数据层" theme="data">
        <div className="flex gap-2 flex-wrap">
          <Card name="用户行为" theme="data">
            点击 / 购买 / 评分
            <br />
            停留 / 跳过 / 分享
          </Card>
          <Card name="用户画像" theme="data">
            年龄 / 偏好 / 标签
            <br />
            会员层 / 活跃度
          </Card>
          <Card name="物品特征" theme="data">
            类目 / 标签 / 属性
            <br />
            <Frontier>图文视频多模态</Frontier>
          </Card>
          <Card name="上下文" theme="data">
            时间 / 位置 / 设备
            <br />
            当前 Session 序列
          </Card>
          <Card name="社交" theme="data">
            好友 / 关注关系
            <br />
            互动图谱
          </Card>
        </div>
      </Layer>

      <Connector label="全量数据" theme="data" />

      {/* ② Feature Engineering */}
      <Layer title="② 特征工程层" theme="feat" tag="new">
        <div className="flex gap-2 flex-wrap">
          <Card name="特征存储" theme="feat">
            在线：Redis / Flink
            <br />
            离线：Hive / Spark
            <br />
            Feature Store
          </Card>
          <Card name="Embedding 预计算" theme="feat">
            用户 / 物品 Emb
            <br />
            <Frontier>LLM 语义向量</Frontier>
            <br />
            <Frontier>多模态 Emb（CLIP）</Frontier>
          </Card>
          <Card name="特征交叉" theme="feat">
            Target Attention
            <br />
            用户-物品 Cross
            <br />
            序列池化
          </Card>
          <Card name="样本工程" theme="feat">
            Hard Negative Mining
            <br />
            正负样本比例控制
            <br />
            样本时效性管理
          </Card>
        </div>
      </Layer>

      <Connector label="亿级物品库" theme="recall" />

      {/* ③ Recall */}
      <Layer title="③ 召回层（多路召回）" theme="recall">
        <div className="flex gap-2 flex-wrap">
          <Card name="协同过滤" theme="recall">
            User-CF / Item-CF
            <br />
            Matrix Factorization
            <br />
            ALS / SVD++ / BPR
          </Card>
          <Card name="内容 / 语义" theme="recall">
            TF-IDF / Word2Vec
            <br />
            双塔 DSSM
            <br />
            Faiss / HNSW ANN
            <br />
            <Frontier>LLM 语义召回</Frontier>
          </Card>
          <Card name="图 / 社交" theme="recall">
            DeepWalk / Node2Vec
            <br />
            GCN / GraphSAGE
            <br />
            LightGCN / PinSage
          </Card>
          <Card name="序列 / 规则" theme="recall">
            GRU4Rec / SASRec
            <br />
            BERT4Rec
            <br />
            热门 / 新品召回
          </Card>
          <Card name="多模态" theme="recall" frontier>
            <Frontier>
              CLIP-based 召回
              <br />
              视频帧特征索引
              <br />
              跨模态检索
            </Frontier>
          </Card>
        </div>
      </Layer>

      <Connector label="千级候选集" theme="recall" />

      {/* ④ Ranking */}
      <Layer title="④ 排序层" theme="rank">
        <div className="flex gap-2 flex-wrap">
          <div
            className={cn(
              "flex-1 min-w-[130px] rounded-lg p-2.5 border",
              themes.rank.cardBg,
              themes.rank.cardBorder
            )}
          >
            <div className={cn("text-[11px] font-semibold mb-1", themes.rank.name)}>
              粗排
            </div>
            <div className={cn("text-[10px] leading-[1.7]", themes.rank.desc)}>
              向量点积（轻量双塔）
              <br />
              LR / GBDT / 简单 MLP
              <br />→ 百级候选集
            </div>
          </div>
          <div className="flex items-center text-[#ddd] dark:text-[#555] text-lg px-1">→</div>
          <div
            className={cn(
              "flex-[2] min-w-[200px] rounded-lg p-2.5 border",
              themes.rank.cardBg,
              themes.rank.cardBorder
            )}
          >
            <div className={cn("text-[11px] font-semibold mb-1", themes.rank.name)}>
              精排
            </div>
            <div className={cn("text-[10px] leading-[1.7]", themes.rank.desc)}>
              Wide & Deep / DeepFM / xDeepFM
              <br />
              DIN / DIEN（用户兴趣建模）
              <br />
              DCN v2 / BST / DLRM
              <br />
              多目标排序（MMoE / PLE）
              <br />
              <Frontier>LLM 排序器（LLM4Rec）</Frontier>
            </div>
          </div>
        </div>
      </Layer>

      <Connector label="十级候选集" theme="rerank" />

      {/* ⑤ Reranking */}
      <Layer title="⑤ 重排层" theme="rerank" tag="new">
        <div className="flex gap-2 flex-wrap">
          <Card name="列表级优化" theme="rerank">
            PRM（实用重排模型）
            <br />
            DLCM / SetRank
            <br />
            上下文感知重排
          </Card>
          <Card name="位置 / 曝光去偏" theme="rerank">
            Position Bias 修正
            <br />
            IPW / DR 方法
            <br />
            <Frontier>因果推断（反事实）</Frontier>
          </Card>
          <Card name="打散控制" theme="rerank">
            品类 / 来源打散
            <br />
            相似内容去重
            <br />
            疲劳度衰减
          </Card>
        </div>
      </Layer>

      <Connector label="最终结果集" theme="strat" />

      {/* ⑥ Business Strategy */}
      <Layer title="⑥ 业务策略层" theme="strat">
        <div className="flex gap-2 flex-wrap">
          <Card name="多样性" theme="strat">
            MMR / DPP
            <br />
            内容多样化
          </Card>
          <Card name="去重 / 过滤" theme="strat">
            曝光去重
            <br />
            黑名单 / 违规
          </Card>
          <Card name="探索与利用" theme="strat">
            ε-greedy / UCB
            <br />
            Bandit / RL
          </Card>
          <Card name="冷启动" theme="strat">
            用户 / 物品冷启
            <br />
            <Frontier>LLM 冷启补全</Frontier>
          </Card>
          <Card name="人工干预" theme="strat">
            打压 / 提权
            <br />
            运营约束
          </Card>
        </div>
      </Layer>

      <Connector label="线上曝光" theme="eval" />

      {/* ⑦ Evaluation */}
      <Layer title="⑦ 评估体系" theme="eval">
        <div className="flex gap-2 flex-wrap">
          <Card name="离线评估" theme="eval">
            AUC / NDCG / Recall@K
            <br />
            冷热用户分群
            <br />
            <Frontier>Novelty / Serendipity</Frontier>
          </Card>
          <Card name="在线 A/B" theme="eval">
            CTR / CVR / GMV
            <br />
            时长 / 留存
            <br />
            <Frontier>LTV 长期效果</Frontier>
          </Card>
          <Card name="多样性 / 公平性" theme="eval">
            ILS / Coverage
            <br />
            茧房效应检测
            <br />
            <Frontier>公平性 / 去偏指标</Frontier>
          </Card>
          <Card name="工程指标" theme="eval">
            P99 延迟 / QPS
            <br />
            召回率 / 缓存命中
            <br />
            降级触发频率
          </Card>
        </div>
      </Layer>

      {/* Bottom Notes */}
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="rounded-lg p-3 border border-[#d3d1c7] dark:border-[#3a3835] bg-[#f1efe8] dark:bg-[#1c1b1a] flex gap-3">
          <span className="text-lg shrink-0 text-[#666]">↺</span>
          <div>
            <div className="text-[11px] font-semibold text-[#444441] dark:text-[#ccc] mb-1">
              数据飞轮（反馈闭环）
            </div>
            <div className="text-[10px] text-[#6b6b66] dark:text-[#999] leading-[1.7]">
              用户行为 → 训练样本实时回流 → 特征/模型持续迭代 → 更好的推荐 → 更多高质量行为数据
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3 border border-[#d3d1c7] dark:border-[#3a3835] bg-[#f1efe8] dark:bg-[#1c1b1a] flex gap-3">
          <span className="text-base shrink-0 pt-0.5 text-[#666]">⚙</span>
          <div>
            <div className="text-[11px] font-semibold text-[#444441] dark:text-[#ccc] mb-1.5">
              模型服务 / 工程层（横跨全链路）
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "在线推理：TF Serving / Triton",
                "向量检索：Milvus / Faiss",
                "特征服务：Redis / Feature Store",
                "延迟目标 < 50ms P99",
                "降级：热门兜底",
                "灰度 / 流量分桶",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-[#e6e4dc] dark:bg-[#333] text-[#5f5e5a] dark:text-[#aaa] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3 border border-[#d3d1c7] dark:border-[#3a3835] bg-[#f8f7f4] dark:bg-[#181818] flex gap-3 items-center">
          <span className="text-xs text-[#888] shrink-0">▶</span>
          <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-semibold">
            <span className={cn("px-2 py-0.5 rounded-full", themes.data.chip)}>全量亿级</span>
            <span className="text-[#ccc] dark:text-[#555]">→</span>
            <span className={cn("px-2 py-0.5 rounded-full", themes.recall.chip)}>千级（召回）</span>
            <span className="text-[#ccc] dark:text-[#555]">→</span>
            <span className={cn("px-2 py-0.5 rounded-full", themes.rank.chip)}>百级（粗排）</span>
            <span className="text-[#ccc] dark:text-[#555]">→</span>
            <span className={cn("px-2 py-0.5 rounded-full", themes.rerank.chip)}>十级（精排）</span>
            <span className="text-[#ccc] dark:text-[#555]">→</span>
            <span className={cn("px-2 py-0.5 rounded-full", themes.strat.chip)}>最终展示</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 系列文章配置 */
const SERIES: Record<string, { title: string; posts: { slug: string; title: string }[] }> = {
  recsys: {
    title: "推荐系统系列",
    posts: [
      { slug: "minimal-recommender", title: "从零搭一个推荐系统" },
      { slug: "vector-recall", title: "给推荐系统加上向量召回" },
      { slug: "deepfm-ranking", title: "用模型替代手写公式做排序" },
      { slug: "two-tower-recall", title: "用双塔模型做向量召回" },
      { slug: "hard-negative-eval", title: "负样本策略和离线评估" },
      { slug: "din-sequence", title: "用 DIN 建模用户兴趣序列" },
      { slug: "mmoe-multitask", title: "多目标排序：MMoE" },
      { slug: "reranking-diversity", title: "重排与多样性" },
      { slug: "engineering-recommender", title: "把推荐系统工程化" },
      { slug: "recommender-landscape", title: "推荐系统全景图" },
      { slug: "rec-llm-bridge", title: "推荐系统 × 大模型：四层重叠与五大范式" },
    ],
  },
  llm: {
    title: "大模型系列",
    posts: [
      { slug: "minimal-llm", title: "从零搭一个语言模型" },
      { slug: "llm-tokenizer", title: "Tokenizer：BPE" },
      { slug: "llm-attention", title: "Attention 机制" },
      { slug: "llm-transformer", title: "完整 Transformer" },
      { slug: "llm-training", title: "训练" },
      { slug: "llm-scaling-law", title: "Scaling Law" },
      { slug: "llm-rope", title: "位置编码：RoPE" },
      { slug: "llm-efficient-attention", title: "高效注意力" },
      { slug: "llm-sft", title: "SFT 微调" },
      { slug: "llm-dpo", title: "DPO 对齐" },
      { slug: "llm-inference", title: "推理优化" },
      { slug: "llm-deploy", title: "部署上线" },
      { slug: "llm-rag", title: "RAG" },
      { slug: "llm-landscape", title: "大模型全景图" },
    ],
  },
};

interface SeriesNavProps {
  series: keyof typeof SERIES;
}

export function SeriesNav({ series }: SeriesNavProps) {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const config = SERIES[series];
  if (!config) return null;

  return (
    <div className="mb-8">
      <div className="mb-4 last:mb-0 leading-relaxed text-secondary-foreground">
        本文是「{config.title}」的一部分：
      </div>
      <ol className="mb-4 list-none" style={{ counterReset: "counts 0" }}>
        {config.posts.map((post) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li
              key={post.slug}
              className="flex mb-2 before:content-[counter(counts)_'._'] before:pr-4 before:font-mono before:font-medium before:text-muted-foreground"
              style={{ counterIncrement: "counts 1" }}
            >
              <div className="flex-1 text-secondary-foreground">
                {isCurrent ? (
                  <strong className="font-semibold text-secondary-foreground underline decoration-dotted decoration-current underline-offset-4">
                    {post.title}
                  </strong>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:underline hover:decoration-dotted hover:decoration-current hover:underline-offset-4 transition-all"
                  >
                    {post.title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

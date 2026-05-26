/**
 * 构建时计算文章相似度矩阵
 * 基于 TF-IDF 余弦相似度，纯 Node.js 实现，不依赖外部 NLP 库
 *
 * 运行: npx tsx scripts/build-similarity.ts
 * 输出: public/similarity.json
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "app/blog");
const OUTPUT_PATH = path.join(ROOT, "public/similarity.json");
const TOP_K = 8; // 每篇文章推荐 top-8
const TAG_BOOST = 0.08; // 同 tag 文章相似度加成

// ==============================================================================
// 1. 读取所有文章内容 + 标签
// ==============================================================================

/** 从 lib/posts-data.ts 读取 tag 映射 */
function getTagMap(): Record<string, string> {
  const dataPath = path.join(ROOT, "lib/posts-data.ts");
  const src = fs.readFileSync(dataPath, "utf-8");
  const tagMap: Record<string, string> = {};
  // 匹配 { slug: "xxx", ..., tag: "yyy", ... }
  const re = /slug:\s*"([^"]+)"[\s\S]*?tag:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    tagMap[m[1]] = m[2];
  }
  return tagMap;
}

function getAllPosts(): { slug: string; content: string; tag: string }[] {
  const tagMap = getTagMap();
  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  const posts: { slug: string; content: string; tag: string }[] = [];

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const mdxPath = path.join(BLOG_DIR, dir.name, "page.mdx");
    if (!fs.existsSync(mdxPath)) continue;

    const raw = fs.readFileSync(mdxPath, "utf-8");
    const content = cleanMDX(raw);
    if (content.length > 50) {
      posts.push({ slug: dir.name, content, tag: tagMap[dir.name] || "" });
    }
  }

  return posts;
}

// ==============================================================================
// 2. 文本清洗
// ==============================================================================

function cleanMDX(raw: string): string {
  let text = raw;
  // 去掉 frontmatter / export metadata
  text = text.replace(/^export\s+const\s+metadata[\s\S]*?}\s*\n/m, "");
  // 去掉 import 语句
  text = text.replace(/^import\s+.*$/gm, "");
  // 去掉代码块
  text = text.replace(/```[\s\S]*?```/g, "");
  // 去掉行内代码
  text = text.replace(/`[^`]+`/g, "");
  // 去掉 JSX/HTML 标签
  text = text.replace(/<[^>]+>/g, "");
  // 去掉 Markdown 语法
  text = text.replace(/^#+\s+/gm, "");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/[*_~|]/g, "");
  // 去掉表格分隔线
  text = text.replace(/^\|?[-:]+\|[-:|]+$/gm, "");
  text = text.replace(/\|/g, " ");
  // 去掉多余空白
  text = text.replace(/\n{2,}/g, "\n");
  return text.trim();
}

// ==============================================================================
// 3. 分词（中文 bigram + 英文 word）
// ==============================================================================

function tokenize(text: string): string[] {
  const tokens: string[] = [];

  // 分离中文和非中文部分
  const segments = text.split(/([a-zA-Z0-9]+|[一-鿿]+)/g);

  for (const seg of segments) {
    if (!seg || seg.trim().length === 0) continue;

    if (/[一-鿿]/.test(seg)) {
      // 中文：bigram
      for (let i = 0; i < seg.length - 1; i++) {
        tokens.push(seg.slice(i, i + 2));
      }
      // 也加 unigram（单字）
      for (const ch of seg) {
        tokens.push(ch);
      }
    } else if (/[a-zA-Z]/.test(seg)) {
      // 英文：转小写作为一个 token
      const word = seg.toLowerCase();
      if (word.length >= 2) {
        tokens.push(word);
      }
    }
  }

  return tokens;
}

// ==============================================================================
// 4. TF-IDF 计算
// ==============================================================================

function computeTFIDF(docs: string[][]): Map<string, number>[] {
  const N = docs.length;

  // Document Frequency: 每个词出现在多少篇文章中
  const df = new Map<string, number>();
  for (const doc of docs) {
    const seen = new Set(doc);
    for (const token of seen) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  // TF-IDF for each document
  const tfidfVectors: Map<string, number>[] = [];

  for (const doc of docs) {
    const tf = new Map<string, number>();
    for (const token of doc) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    const tfidf = new Map<string, number>();
    const maxTf = Math.max(...tf.values());

    for (const [token, count] of tf) {
      const tfNorm = count / maxTf; // 归一化 TF
      const idf = Math.log(N / (df.get(token) || 1)); // IDF
      tfidf.set(token, tfNorm * idf);
    }

    tfidfVectors.push(tfidf);
  }

  return tfidfVectors;
}

// ==============================================================================
// 5. 余弦相似度
// ==============================================================================

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [key, val] of a) {
    normA += val * val;
    if (b.has(key)) {
      dot += val * b.get(key)!;
    }
  }
  for (const [, val] of b) {
    normB += val * val;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ==============================================================================
// 7. 手动覆盖（孤立文章或 TF-IDF 效果差的）
// ==============================================================================

const MANUAL_OVERRIDES: Record<string, string[]> = {
  "craft-oriensx": [
    "blog-recommender",       // 同属建站类
    "engineering-recommender", // 都是工程化/搭建
    "llm-deploy",             // 部署上线
    "polar-starry-resources", // 非技术内容
  ],
  "polar-starry-resources": [
    "cs-paper-guide",      // 同属资源类
    "craft-oriensx",       // 非技术内容
    "llm-landscape",       // 全景图/总览类
    "recommender-landscape",
  ],
};

// ==============================================================================
// 8. 主流程（融合 tag boost + 手动覆盖）
// ==============================================================================

function main() {
  console.log("[build-similarity] 开始计算文章相似度...");

  // 读取文章
  const posts = getAllPosts();
  console.log(`  找到 ${posts.length} 篇文章`);

  // 分词
  const tokenized = posts.map((p) => tokenize(p.content));
  console.log(`  分词完成`);

  // 计算 TF-IDF
  const tfidfVectors = computeTFIDF(tokenized);
  console.log(`  TF-IDF 计算完成`);

  // 计算相似度矩阵并取 top-K（加入 tag boost）
  const similarity: Record<string, string[]> = {};

  for (let i = 0; i < posts.length; i++) {
    const scores: { slug: string; score: number }[] = [];

    for (let j = 0; j < posts.length; j++) {
      if (i === j) continue;
      let score = cosineSimilarity(tfidfVectors[i], tfidfVectors[j]);

      // 同 tag 加成
      if (posts[i].tag && posts[j].tag && posts[i].tag === posts[j].tag) {
        score += TAG_BOOST;
      }

      scores.push({ slug: posts[j].slug, score });
    }

    // 按相似度降序排列
    scores.sort((a, b) => b.score - a.score);

    // 如果有手动覆盖，把手动的放在前面，再填充 TF-IDF 结果
    const slug = posts[i].slug;
    if (MANUAL_OVERRIDES[slug]) {
      const manualSlugs = MANUAL_OVERRIDES[slug];
      const tfidfSlugs = scores.map((s) => s.slug).filter((s) => !manualSlugs.includes(s));
      similarity[slug] = [...manualSlugs, ...tfidfSlugs].slice(0, TOP_K);
    } else {
      similarity[slug] = scores.slice(0, TOP_K).map((s) => s.slug);
    }

    if (i < 3) {
      console.log(`  ${slug}: top-3 = ${scores.slice(0, 3).map(s => `${s.slug}(${s.score.toFixed(3)})`).join(", ")}`);
    }
  }

  // 输出
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(similarity, null, 2));
  console.log(`  ✓ 输出到 ${OUTPUT_PATH} (${posts.length} 篇文章的相似度)`);
}

main();

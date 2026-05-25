/**
 * 构建时生成搜索索引
 * 遍历所有 MDX 博客文章，提取纯文本内容，生成 public/search-index.json
 *
 * 运行: npx tsx scripts/generate-search-index.ts
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "app/blog");
const OUTPUT_PATH = path.join(ROOT, "public/search-index.json");

// 从 app/page.tsx 中提取文章元数据
// 由于 page.tsx 包含 JSX，我们直接用正则提取 posts 数组中的关键字段
function extractPostsMetadata(): Map<
  string,
  { title: string; summary: string; tag: string; date: string }
> {
  const pageContent = fs.readFileSync(
    path.join(ROOT, "app/page.tsx"),
    "utf-8"
  );

  const map = new Map<
    string,
    { title: string; summary: string; tag: string; date: string }
  >();

  // 匹配每个 post 对象块
  const postRegex =
    /\{\s*slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"[\s\S]*?tag:\s*"([^"]+)"[\s\S]*?summary:\s*"([^"]+(?:"[^}]*?"[^"]*?)*?)"\s*?,/g;

  // 更简单的逐字段提取
  const blockRegex = /\{\s*slug:\s*"([^"]+)"[^}]*?title:\s*"([^"]+)"[^}]*?date:\s*"([^"]+)"[^}]*?tag:\s*"([^"]+)"[^}]*?summary:\s*(?:"([^"]*)"|([\s\S]*?"))\s*,?\s*(?:cover|$)/g;

  // 用更可靠的方式：逐个找 slug，然后向后找其他字段
  const slugRegex = /slug:\s*"([^"]+)"/g;
  let match;

  while ((match = slugRegex.exec(pageContent)) !== null) {
    const slug = match[1];
    const startIdx = match.index;
    // 找到这个对象块的结束（下一个 slug 或数组结束）
    const nextSlugMatch = /slug:\s*"[^"]+"/g;
    nextSlugMatch.lastIndex = startIdx + match[0].length;
    const nextMatch = nextSlugMatch.exec(pageContent);
    const endIdx = nextMatch ? nextMatch.index : pageContent.length;

    const block = pageContent.slice(startIdx, endIdx);

    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const dateMatch = block.match(/date:\s*"([^"]+)"/);
    const tagMatch = block.match(/tag:\s*"([^"]+)"/);
    // summary 可能跨行
    const summaryMatch = block.match(
      /summary:\s*(?:"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/
    );
    // 处理多行 summary（用模板字符串或字符串拼接的情况）
    let summary = "";
    if (summaryMatch) {
      summary = summaryMatch[1] || summaryMatch[2] || "";
    } else {
      // 尝试匹配带换行的 summary
      const multiLineSummary = block.match(
        /summary:\s*\n?\s*"([\s\S]*?)"\s*,/
      );
      if (multiLineSummary) {
        summary = multiLineSummary[1].replace(/"\s*\+\s*"/g, "");
      }
    }

    if (titleMatch && dateMatch && tagMatch) {
      map.set(slug, {
        title: titleMatch[1],
        summary: summary,
        tag: tagMatch[1],
        date: dateMatch[1],
      });
    }
  }

  return map;
}

// 将 MDX 内容转为纯文本
function mdxToPlainText(content: string): string {
  let text = content;

  // 移除 export 块（如 export const metadata = { ... }）
  text = text.replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}\s*/g, "");

  // 移除 export/import 语句
  text = text.replace(/^(export|import)\s+.*$/gm, "");

  // 移除 JSX 组件标签（自闭合和非自闭合）
  text = text.replace(/<[A-Z][^>]*\/>/g, "");
  text = text.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "");
  text = text.replace(/<[A-Z][^>]*>/g, "");

  // 移除 HTML 标签
  text = text.replace(/<[^>]+>/g, "");

  // 移除代码块（保留代码内容的简短描述）
  text = text.replace(/```[\s\S]*?```/g, "");

  // 移除行内代码的反引号但保留内容
  text = text.replace(/`([^`]+)`/g, "$1");

  // 移除 Markdown 标题符号但保留文本
  text = text.replace(/^#{1,6}\s+/gm, "");

  // 移除 Markdown 链接，保留文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 移除图片
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // 移除粗体/斜体标记
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");

  // 移除水平线
  text = text.replace(/^---+$/gm, "");

  // 移除多余空行
  text = text.replace(/\n{3,}/g, "\n\n");

  // 去首尾空白
  text = text.trim();

  return text;
}

function main() {
  console.log("🔍 Generating search index...\n");

  const metadata = extractPostsMetadata();
  console.log(`  Found ${metadata.size} posts in page.tsx`);

  const index: Array<{
    id: string;
    title: string;
    summary: string;
    tag: string;
    date: string;
    content: string;
  }> = [];

  // 获取所有 blog 目录
  const blogDirs = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const slug of blogDirs) {
    const mdxPath = path.join(BLOG_DIR, slug, "page.mdx");
    if (!fs.existsSync(mdxPath)) continue;

    const mdxContent = fs.readFileSync(mdxPath, "utf-8");
    const plainText = mdxToPlainText(mdxContent);

    const meta = metadata.get(slug);

    index.push({
      id: slug,
      title: meta?.title || slug,
      summary: meta?.summary || "",
      tag: meta?.tag || "",
      date: meta?.date || "",
      content: plainText,
    });
  }

  // 按日期降序排列
  index.sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), "utf-8");

  console.log(`  Generated ${index.length} entries`);
  console.log(`  Output: ${OUTPUT_PATH}`);
  console.log("\n✅ Done!");
}

main();

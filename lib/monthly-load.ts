import fs from "fs";
import path from "path";
import type { MonthlyEntry } from "@/lib/monthly-types";

function parseFrontmatter(block: string): Record<string, string> {
  const meta: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    meta[match[1]] = match[2].trim();
  }
  return meta;
}

function extractTitle(markdown: string): { title: string; body: string } {
  const lines = markdown.trim().split("\n");
  const heading = lines[0]?.match(/^#\s+(.+)$/);
  if (heading) {
    return {
      title: heading[1].trim(),
      body: lines.slice(1).join("\n").trim(),
    };
  }
  return { title: "未命名条目", body: markdown.trim() };
}

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * 按月 Markdown：`app/monthly/(issues)/YYYY-MM/entries.md`
 *
 * ---
 * id: ...
 * date: YYYY-MM-DD
 * time: HH:mm
 * tags: 标签一, 标签二
 * url: https://...
 * ---
 *
 * # 标题把事情讲清楚
 *
 * 正文 Markdown
 */
export function parseMonthlyMarkdown(
  source: string,
  fallbackId: string
): MonthlyEntry[] {
  const pieces = source
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/^---\s*$/m)
    .map((part) => part.trim())
    .filter(Boolean);

  const entries: MonthlyEntry[] = [];

  for (let i = 0; i + 1 < pieces.length; i += 2) {
    const meta = parseFrontmatter(pieces[i]);
    if (!meta.date) continue;

    const { title, body } = extractTitle(pieces[i + 1]);
    const id = meta.id || `${fallbackId}-${entries.length + 1}`;
    const tags = parseTags(meta.tags);

    entries.push({
      id,
      date: meta.date,
      time: meta.time || "00:00",
      tags,
      url: meta.url || undefined,
      title,
      bodyMarkdown: body,
      searchText: [title, body, tags.join(" "), meta.url || ""].join("\n"),
    });
  }

  return entries;
}

export function loadMonthlyEntries(): MonthlyEntry[] {
  const dir = path.join(process.cwd(), "app/monthly/(issues)");
  if (!fs.existsSync(dir)) return [];

  const months = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && /^\d{4}-\d{2}$/.test(entry.name)
    )
    .map((entry) => entry.name)
    .sort()
    .reverse();

  const entries = months.flatMap((slug) => {
    const filePath = path.join(dir, slug, "entries.md");
    if (!fs.existsSync(filePath)) return [];
    const source = fs.readFileSync(filePath, "utf-8");
    return parseMonthlyMarkdown(source, slug);
  });

  return entries.sort((a, b) => {
    const left = `${a.date}T${a.time}`;
    const right = `${b.date}T${b.time}`;
    return right.localeCompare(left);
  });
}

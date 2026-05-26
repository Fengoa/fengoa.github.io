/**
 * 阅读历史管理（localStorage）
 */

const STORAGE_KEY = "oriensx_reading_history";
const MAX_HISTORY = 50;

export interface ReadRecord {
  slug: string;
  timestamp: number;
}

export function recordRead(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    // 去重：如果已有则更新时间戳
    const filtered = history.filter((r) => r.slug !== slug);
    filtered.unshift({ slug, timestamp: Date.now() });
    // 限制最大条数
    const trimmed = filtered.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 不可用时静默失败
  }
}

export function getHistory(): ReadRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReadRecord[];
  } catch {
    return [];
  }
}

export function getReadSlugs(): string[] {
  return getHistory().map((r) => r.slug);
}

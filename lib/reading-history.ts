/**
 * 阅读历史 + 不感兴趣管理（localStorage）
 */

const STORAGE_KEY = "oriensx_reading_history";
const DISLIKE_KEY = "oriensx_disliked";
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

/** 标记不感兴趣 */
export function dislikePost(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getDislikedSlugs();
    set.add(slug);
    localStorage.setItem(DISLIKE_KEY, JSON.stringify([...set]));
  } catch {}
}

/** 取消不感兴趣 */
export function undislikePost(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getDislikedSlugs();
    set.delete(slug);
    localStorage.setItem(DISLIKE_KEY, JSON.stringify([...set]));
  } catch {}
}

/** 获取不感兴趣的 slug 集合 */
export function getDislikedSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DISLIKE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

import MiniSearch, { type SearchResult } from "minisearch";

export interface SearchDocument {
  id: string;
  title: string;
  summary: string;
  tag: string;
  date: string;
  content: string;
}

export interface SearchHit {
  id: string;
  title: string;
  summary: string;
  tag: string;
  date: string;
  score: number;
}

let miniSearch: MiniSearch<SearchDocument> | null = null;
let documents: SearchDocument[] = [];
let loadingPromise: Promise<void> | null = null;

/**
 * 懒加载搜索索引（首次调用时 fetch search-index.json）
 */
async function ensureLoaded(): Promise<void> {
  if (miniSearch) return;

  if (loadingPromise) {
    await loadingPromise;
    return;
  }

  loadingPromise = (async () => {
    const res = await fetch("/search-index.json");
    documents = await res.json();

    miniSearch = new MiniSearch<SearchDocument>({
      fields: ["title", "summary", "content"],
      storeFields: ["title", "summary", "tag", "date"],
      // 中文分词：按空格、标点分割
      tokenize: (text) => {
        // 中英文混合分词：按空格/标点分割 + 中文逐字符 bigram
        const basicTokens = text
          .toLowerCase()
          .split(/[\s\-_,.;:!?，。；：！？、（）()[\]【】{}""'']+/)
          .filter(Boolean);

        const cjkTokens: string[] = [];
        for (const token of basicTokens) {
          // 如果包含 CJK 字符，生成 bigram
          if (/[一-鿿]/.test(token)) {
            const chars = [...token].filter((c) => /[一-鿿]/.test(c));
            // 单字符也保留
            for (const c of chars) {
              cjkTokens.push(c);
            }
            // bigram
            for (let i = 0; i < chars.length - 1; i++) {
              cjkTokens.push(chars[i] + chars[i + 1]);
            }
          }
        }

        return [...basicTokens, ...cjkTokens];
      },
      // 搜索时也用同样的分词
      searchOptions: {
        boost: { title: 3, summary: 2, content: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    miniSearch.addAll(documents);
  })();

  await loadingPromise;
}

/**
 * 搜索文章
 */
export async function search(query: string): Promise<SearchHit[]> {
  if (!query.trim()) return [];

  await ensureLoaded();

  const results: SearchResult[] = miniSearch!.search(query, {
    boost: { title: 3, summary: 2, content: 1 },
    fuzzy: 0.2,
    prefix: true,
  });

  return results.map((r) => ({
    id: r.id as string,
    title: r.title,
    summary: r.summary,
    tag: r.tag,
    date: r.date,
    score: r.score,
  }));
}

/**
 * 获取所有文章（无搜索词时展示）
 */
export async function getAllPosts(): Promise<SearchHit[]> {
  await ensureLoaded();
  return documents.map((d) => ({
    id: d.id,
    title: d.title,
    summary: d.summary,
    tag: d.tag,
    date: d.date,
    score: 0,
  }));
}

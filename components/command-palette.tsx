"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight } from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { search, getAllPosts, type SearchHit } from "@/lib/search";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [allPosts, setAllPosts] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cmd+K / Ctrl+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 打开时加载所有文章
  useEffect(() => {
    if (open && allPosts.length === 0) {
      getAllPosts().then(setAllPosts);
    }
  }, [open, allPosts.length]);

  // 关闭时重置
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // 搜索 debounce
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const hits = await search(value);
      setResults(hits);
      setLoading(false);
    }, 150);
  }, []);

  // 选择结果
  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/blog/${slug}`);
    },
    [router]
  );

  const displayResults = query.trim() ? results : allPosts;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="搜索文章"
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-150"
      contentClassName="fixed z-[201] top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[640px] rounded-xl border border-border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
    >
      <VisuallyHidden.Root>
        <Dialog.Title>搜索文章</Dialog.Title>
      </VisuallyHidden.Root>

      {/* 搜索输入区 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Search className="size-4 text-muted-foreground shrink-0" />
        <Command.Input
          value={query}
          onValueChange={handleSearch}
          placeholder="搜索文章..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
        />
        <kbd className="hidden sm:inline-flex font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
          ESC
        </kbd>
      </div>

      {/* 结果列表 */}
      <Command.List className="max-h-[400px] overflow-y-auto overscroll-contain p-2">
        {loading && (
          <Command.Loading className="py-8 text-center text-sm text-muted-foreground">
            搜索中...
          </Command.Loading>
        )}

        <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
          {query.trim() ? "没有找到相关文章" : "输入关键词开始搜索"}
        </Command.Empty>

        {displayResults.map((hit) => (
          <Command.Item
            key={hit.id}
            value={hit.id}
            onSelect={() => handleSelect(hit.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 text-foreground data-[selected=true]:bg-accent"
          >
            <FileText className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="truncate">{hit.title}</span>
                {hit.tag && (
                  <span className="shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {hit.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {hit.summary}
              </p>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground shrink-0 opacity-0 data-[selected=true]:opacity-100 transition-opacity" />
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  ArrowRight,
  Terminal,
  Sun,
  Moon,
  Monitor,
  Presentation,
  BookOpen,
  LogOut,
} from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useTheme } from "next-themes";
import { search, getAllPosts, type SearchHit } from "@/lib/search";
import { useMode, type ReadingMode } from "@/components/mode-provider";

/** 高亮文本中匹配的关键词 */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;

  // 将搜索词拆成关键字（按空格分割）
  const keywords = query
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0);

  if (keywords.length === 0) return <>{text}</>;

  // 构造正则匹配所有关键词
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-200/60 dark:bg-amber-500/30 text-inherit rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// =============================================================================
// 命令注册表：可后续扩展更多命令
// =============================================================================

type CommandAction = {
  id: string;
  // 用于模糊匹配的关键字（中英文均可）
  keywords: string[];
  // 显示标题
  title: string;
  // 副标题/说明
  subtitle?: string;
  // 分组标签
  group: string;
  icon: React.ReactNode;
  // 执行后是否关闭面板
  closeOnRun?: boolean;
  run: (ctx: CommandContext) => void;
};

type CommandContext = {
  setTheme: (t: string) => void;
  router: ReturnType<typeof useRouter>;
  setMode: (m: ReadingMode) => void;
  currentMode: ReadingMode;
};

function useCommands(currentMode: ReadingMode): CommandAction[] {
  return useMemo(
    () => [
      // ——— 外观 ———
      {
        id: "theme.light",
        keywords: ["theme", "light", "切换主题", "亮色", "白天", "浅色"],
        title: "Theme: 切换为亮色",
        subtitle: "Light mode",
        group: "外观",
        icon: <Sun className="size-4" />,
        run: ({ setTheme }) => setTheme("light"),
      },
      {
        id: "theme.dark",
        keywords: ["theme", "dark", "切换主题", "暗色", "深色", "黑夜"],
        title: "Theme: 切换为暗色",
        subtitle: "Dark mode",
        group: "外观",
        icon: <Moon className="size-4" />,
        run: ({ setTheme }) => setTheme("dark"),
      },
      {
        id: "theme.system",
        keywords: ["theme", "system", "切换主题", "系统", "自动", "跟随"],
        title: "Theme: 跟随系统",
        subtitle: "System default",
        group: "外观",
        icon: <Monitor className="size-4" />,
        run: ({ setTheme }) => setTheme("system"),
      },
      // ——— 阅读模式 ———
      {
        id: "mode.present",
        keywords: [
          "mode",
          "present",
          "presentation",
          "演示",
          "幻灯片",
          "讲解",
          "slide",
        ],
        title: "Mode: 进入演示模式",
        subtitle: "Presentation · 按 h2 切片，← → 翻页",
        group: "阅读模式",
        icon: <Presentation className="size-4" />,
        run: ({ setMode }) => setMode("present"),
      },
      {
        id: "mode.zen",
        keywords: ["mode", "zen", "禅", "专注", "沉浸", "focus"],
        title: "Mode: 进入禅模式",
        subtitle: "Zen · 隐藏导航，放大字号专注阅读",
        group: "阅读模式",
        icon: <BookOpen className="size-4" />,
        run: ({ setMode }) => setMode("zen"),
      },
      // 仅在非 normal 时显示"退出"
      ...(currentMode !== "normal"
        ? [
            {
              id: "mode.exit",
              keywords: ["mode", "exit", "normal", "退出", "正常", "默认"],
              title: "Mode: 退出当前模式",
              subtitle: `回到正常阅读 · 当前: ${currentMode}`,
              group: "阅读模式",
              icon: <LogOut className="size-4" />,
              run: ({ setMode }) => setMode("normal"),
            } satisfies CommandAction,
          ]
        : []),
    ],
    [currentMode]
  );
}

// =============================================================================

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [allPosts, setAllPosts] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { mode: currentMode, setMode } = useMode();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const commands = useCommands(currentMode);

  // 是否处于命令模式（首字符为 ">"）
  const isCommandMode = query.startsWith(">");
  // 去掉 ">" 之后的过滤词
  const commandQuery = isCommandMode ? query.slice(1).trim().toLowerCase() : "";

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

  // 搜索 debounce（仅搜索模式触发）
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // 命令模式不调用文章搜索
    if (value.startsWith(">")) {
      setResults([]);
      setLoading(false);
      return;
    }

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

  // 选择文章
  const handleSelectPost = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/blog/${slug}`);
    },
    [router]
  );

  // 执行命令
  const handleRunCommand = useCallback(
    (cmd: CommandAction) => {
      cmd.run({ setTheme, router, setMode, currentMode });
      if (cmd.closeOnRun !== false) setOpen(false);
    },
    [setTheme, router, setMode, currentMode]
  );

  // 过滤命令
  const filteredCommands = useMemo(() => {
    if (!isCommandMode) return [];
    if (!commandQuery) return commands;
    return commands.filter((c) =>
      c.keywords.some((k) => k.toLowerCase().includes(commandQuery))
    );
  }, [isCommandMode, commandQuery, commands]);

  // 按分组聚合
  const commandGroups = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    for (const c of filteredCommands) {
      (groups[c.group] ??= []).push(c);
    }
    return groups;
  }, [filteredCommands]);

  const displayResults = query.trim() ? results : allPosts;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={isCommandMode ? "运行命令" : "搜索文章"}
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-500 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-150"
      contentClassName="fixed z-501 top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[640px] rounded-xl border border-border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
    >
      <VisuallyHidden.Root>
        <Dialog.Title>{isCommandMode ? "运行命令" : "搜索文章"}</Dialog.Title>
      </VisuallyHidden.Root>

      {/* 输入区 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        {isCommandMode ? (
          <Terminal className="size-4 text-violet-500 shrink-0" />
        ) : (
          <Search className="size-4 text-muted-foreground shrink-0" />
        )}
        <Command.Input
          value={query}
          onValueChange={handleSearch}
          placeholder={
            isCommandMode ? "运行命令... (输入 > 进入命令模式)" : "搜索文章...  按 > 进入命令模式"
          }
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
        />
        <kbd className="hidden sm:inline-flex font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
          ESC
        </kbd>
      </div>

      {/* 结果列表 */}
      <Command.List className="max-h-[400px] overflow-y-auto overscroll-contain p-2">
        {/* —— 命令模式 —— */}
        {isCommandMode ? (
          <>
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              没有匹配的命令
            </Command.Empty>

            {Object.entries(commandGroups).map(([group, cmds]) => (
              <Command.Group
                key={group}
                heading={group}
                className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-muted-foreground"
              >
                {cmds.map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    value={cmd.id}
                    onSelect={() => handleRunCommand(cmd)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 text-foreground data-[selected=true]:bg-accent"
                  >
                    <span className="text-muted-foreground shrink-0">
                      {cmd.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        <Highlight text={cmd.title} query={commandQuery} />
                      </div>
                      {cmd.subtitle && (
                        <div className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground shrink-0 opacity-0 data-[selected=true]:opacity-100 transition-opacity" />
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </>
        ) : (
          /* —— 搜索模式 —— */
          <>
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
                onSelect={() => handleSelectPost(hit.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-100 text-foreground data-[selected=true]:bg-accent"
              >
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="truncate">
                      <Highlight text={hit.title} query={query} />
                    </span>
                    {hit.tag && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {hit.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    <Highlight text={hit.summary} query={query} />
                  </p>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground shrink-0 opacity-0 data-[selected=true]:opacity-100 transition-opacity" />
              </Command.Item>
            ))}
          </>
        )}
      </Command.List>

      {/* 底部提示栏 */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-border text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded bg-muted border border-border">
              ↑↓
            </kbd>{" "}
            选择
          </span>
          <span>
            <kbd className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded bg-muted border border-border">
              ↵
            </kbd>{" "}
            确认
          </span>
        </div>
        <span>
          {isCommandMode ? (
            <>
              <kbd className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded bg-violet-500/15 text-violet-500 border border-violet-500/30">
                &gt;
              </kbd>{" "}
              命令模式
            </>
          ) : (
            <>
              输入{" "}
              <kbd className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded bg-muted border border-border">
                &gt;
              </kbd>{" "}
              运行命令
            </>
          )}
        </span>
      </div>
    </Command.Dialog>
  );
}

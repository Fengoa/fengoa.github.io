"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ReadingMode = "normal" | "zen" | "present";

type ModeContextValue = {
  mode: ReadingMode;
  setMode: (m: ReadingMode) => void;
  toggle: (m: Exclude<ReadingMode, "normal">) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const HASH_KEY = "mode";
const VALID_MODES: ReadingMode[] = ["normal", "zen", "present"];

/** 解析 location.hash 中的 mode，例如 "#mode=present" → "present" */
function parseModeFromHash(): ReadingMode | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const value = params.get(HASH_KEY);
  if (value && (VALID_MODES as string[]).includes(value)) {
    return value as ReadingMode;
  }
  return null;
}

/** 把 mode 写入 location.hash（normal 时清掉），不触发 Next 路由 */
function syncModeToHash(mode: ReadingMode) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const hash = url.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);

  if (mode === "normal") {
    params.delete(HASH_KEY);
  } else {
    params.set(HASH_KEY, mode);
  }

  const next = params.toString();
  const nextHash = next ? `#${next}` : "";
  // 用 replaceState 避免污染浏览器历史
  if (window.location.hash !== nextHash) {
    history.replaceState(
      history.state,
      "",
      url.pathname + url.search + nextHash
    );
  }
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ReadingMode>("normal");

  const setMode = useCallback((next: ReadingMode) => {
    setModeState(next);
  }, []);

  const toggle = useCallback((target: Exclude<ReadingMode, "normal">) => {
    setModeState((cur) => (cur === target ? "normal" : target));
  }, []);

  // 初始化：从 hash 恢复模式（刷新页面时）
  useEffect(() => {
    const parsed = parseModeFromHash();
    if (parsed && parsed !== "normal") {
      setModeState(parsed);
    }
    // 监听 hash 变化（前进/后退 / 用户手动改）
    const onHashChange = () => {
      const next = parseModeFromHash() ?? "normal";
      setModeState(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // 同步到 <html data-mode="..."> + URL hash
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.mode = mode;
    syncModeToHash(mode);
    return () => {
      if (html.dataset.mode === mode) {
        html.dataset.mode = "normal";
      }
    };
  }, [mode]);

  // Esc 退出特殊模式
  useEffect(() => {
    if (mode === "normal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setModeState("normal");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    return {
      mode: "normal" as ReadingMode,
      setMode: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

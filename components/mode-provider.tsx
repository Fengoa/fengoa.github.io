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

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ReadingMode>("normal");

  const setMode = useCallback((next: ReadingMode) => {
    setModeState(next);
  }, []);

  const toggle = useCallback((target: Exclude<ReadingMode, "normal">) => {
    setModeState((cur) => (cur === target ? "normal" : target));
  }, []);

  // 同步到 <html data-mode="..."> 供全局 CSS 使用
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.mode = mode;
    return () => {
      // 卸载时尽量回到 normal，避免遗留样式
      if (html.dataset.mode === mode) {
        html.dataset.mode = "normal";
      }
    };
  }, [mode]);

  // Esc 退出特殊模式（在 normal 时不拦截）
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
    // 容错：未挂 Provider 时返回 no-op，避免命令面板崩溃
    return {
      mode: "normal" as ReadingMode,
      setMode: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

"use client";

import { useTheme } from "next-themes";
import { Monitor, Sun, Moon } from "lucide-react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { useEffect, useState } from "react";

const themes = [
  { id: "system", icon: <Monitor className="size-4" />, label: "系统" },
  { id: "light", icon: <Sun className="size-4" />, label: "亮色" },
  { id: "dark", icon: <Moon className="size-4" />, label: "暗色" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex p-0.5">
      <AnimatedBackground
        defaultValue={theme || "system"}
        className="rounded-lg bg-black/5 dark:bg-white/10"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
        onValueChange={(id) => {
          if (id) setTheme(id);
        }}
      >
        {themes.map((t) => (
          <button
            key={t.id}
            data-id={t.id}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground data-[checked=true]:text-foreground"
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}

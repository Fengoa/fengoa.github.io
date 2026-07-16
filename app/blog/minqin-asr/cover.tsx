"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function MinqinASRCover({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);
  const lines = [
    "民勤话：今儿个天气好得很",
    "普通话：今天天气很好",
  ];

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 2), 2800);
    return () => clearInterval(timer);
  }, []);

  const bars = [0.35, 0.62, 0.48, 0.78, 0.55, 0.7, 0.42, 0.65, 0.5, 0.72];

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#0f1419] via-[#121a22] to-[#0d1820]",
        className
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10">
        <div className="flex h-10 items-end justify-center gap-1">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-amber-400/80"
              animate={{ height: [h * 32, h * 20, h * 36, h * 28] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center font-mono text-sm leading-relaxed text-amber-100/90"
        >
          {lines[phase]}
        </motion.p>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_50px_24px_rgba(0,0,0,0.55)]" />
    </div>
  );
}

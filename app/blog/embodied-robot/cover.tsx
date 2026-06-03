"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function EmbodiedRobotCover({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#0a192f] via-[#0d2137] to-[#0f2d42]",
        className
      )}
    >
      {/* 机器人图标简化表示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* 头部 */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 mx-auto mb-2 shadow-lg shadow-cyan-500/20" />
          
          {/* 身体 */}
          <div className="w-16 h-20 rounded-t-lg bg-gradient-to-b from-slate-700 to-slate-900 mx-auto relative">
            {/* 手臂 */}
            <div className="absolute -left-6 top-2 w-5 h-12 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 origin-top" />
            <div className="absolute -right-6 top-2 w-5 h-12 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 origin-top" />
            
            {/* 腿部 */}
            <div className="absolute -bottom-8 left-2 w-4 h-10 rounded-b-lg bg-gradient-to-b from-slate-700 to-slate-900" />
            <div className="absolute -bottom-8 right-2 w-4 h-10 rounded-b-lg bg-gradient-to-b from-slate-700 to-slate-900" />
          </div>
        </motion.div>
      </div>

      {/* 传感器光线效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
          style={{ left: "30%" }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          style={{ left: "70%" }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* 底部标注 */}
      <div className="absolute bottom-[10%] left-0 right-0 text-center">
        <span className="text-xs font-black font-mono text-cyan-400/60">
          EMBODIED AI
        </span>
      </div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(0,255,255,0.03)_4px,rgba(0,255,255,0.03)_8px)]" />
    </div>
  );
}

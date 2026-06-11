"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import {
  TelescopeIcon,
  type TelescopeIconHandle,
} from "@/components/ui/telescope-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface ObsessionCoverProps {
  className?: string;
}

export function ObsessionCover({ className }: ObsessionCoverProps) {
  const iconRef = useRef<TelescopeIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 4000);
    iconRef.current?.startAnimation();
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full bg-white dark:bg-neutral-950",
        className
      )}
    >
      {/* 同心轨道环 */}
      {[28, 44, 62].map((size) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 dark:border-neutral-800"
          style={{ width: `${size}%`, height: `${size}%` }}
        />
      ))}

      {/* 散落星点 */}
      <div className="absolute inset-0">
        {[
          "left-[18%] top-[22%] size-1 opacity-60",
          "left-[72%] top-[16%] size-0.5 opacity-40",
          "left-[80%] top-[55%] size-1 opacity-50",
          "left-[25%] top-[70%] size-0.5 opacity-40",
          "left-[60%] top-[78%] size-1 opacity-60",
          "left-[40%] top-[14%] size-0.5 opacity-30",
        ].map((cls) => (
          <span
            key={cls}
            className={cn(
              "absolute rounded-full bg-neutral-400 dark:bg-neutral-500",
              cls
            )}
          />
        ))}
      </div>

      {/* 光束 */}
      <BorderBeam
        size={60}
        duration={10}
        colorFrom="#67e8f9"
        colorTo="#818cf8"
        borderWidth={2}
      />

      {/* 图标 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <TelescopeIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

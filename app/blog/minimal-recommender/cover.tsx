"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import { BlocksIcon, type BlocksIconHandle } from "@/components/ui/blocks-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface RecommenderCoverProps {
  className?: string;
}

export function RecommenderCover({ className }: RecommenderCoverProps) {
  const iconRef = useRef<BlocksIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 3500);
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
      {/* 网格 + Cross */}
      <Grid rows={6} columns={6} className="absolute inset-0 size-full">
        <Grid.Cross row={3} column={2} />
        <Grid.Cross row={5} column={6} />
      </Grid>

      {/* 光束 */}
      <BorderBeam
        size={60}
        duration={9}
        colorFrom="#f97316"
        colorTo="#06b6d4"
        borderWidth={2}
      />

      {/* 图标 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BlocksIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

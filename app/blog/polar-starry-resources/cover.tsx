"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import {
  TelescopeIcon,
  type TelescopeIconHandle,
} from "@/components/ui/telescope-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AstralResourcesCoverProps {
  className?: string;
}

export function AstralResourcesCover({ className }: AstralResourcesCoverProps) {
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
      {/* 网格 + Cross */}
      <Grid rows={6} columns={6} className="absolute inset-0 size-full">
        <Grid.Cross row={2} column={3} />
        <Grid.Cross row={5} column={5} />
      </Grid>

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

"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import {
  DashboardIcon,
  type DashboardIconHandle,
} from "@/components/ui/dashboard-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface EngineeringCoverProps {
  className?: string;
}

export function EngineeringCover({ className }: EngineeringCoverProps) {
  const iconRef = useRef<DashboardIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 3200);
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
      <Grid rows={6} columns={6} className="absolute inset-0 size-full">
        <Grid.Cross row={3} column={2} />
        <Grid.Cross row={5} column={4} />
      </Grid>

      <BorderBeam
        size={60}
        duration={7}
        colorFrom="#10b981"
        colorTo="#3b82f6"
        borderWidth={2}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <DashboardIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import {
  DashboardIcon,
  type DashboardIconHandle,
} from "@/components/ui/dashboard-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface TwoTowerCoverProps {
  className?: string;
}

export function TwoTowerCover({ className }: TwoTowerCoverProps) {
  const iconRef = useRef<DashboardIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 4200);
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
        <Grid.Cross row={3} column={5} />
        <Grid.Cross row={5} column={3} />
      </Grid>

      <BorderBeam
        size={60}
        duration={12}
        colorFrom="#34d399"
        colorTo="#818cf8"
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

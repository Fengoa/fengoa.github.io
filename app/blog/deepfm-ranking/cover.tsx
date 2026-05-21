"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import {
  ScanLineIcon,
  type ScanLineIconHandle,
} from "@/components/ui/scan-line-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DeepFMCoverProps {
  className?: string;
}

export function DeepFMCover({ className }: DeepFMCoverProps) {
  const iconRef = useRef<ScanLineIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 3800);
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
        <Grid.Cross row={4} column={2} />
        <Grid.Cross row={2} column={5} />
      </Grid>

      <BorderBeam
        size={60}
        duration={10}
        colorFrom="#f472b6"
        colorTo="#facc15"
        borderWidth={2}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <ScanLineIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

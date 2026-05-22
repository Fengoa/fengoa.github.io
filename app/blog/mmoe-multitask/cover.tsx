"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import {
  LoaderCircleIcon,
  type LoaderCircleIconHandle,
} from "@/components/ui/loader-circle-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface MMoECoverProps {
  className?: string;
}

export function MMoECover({ className }: MMoECoverProps) {
  const iconRef = useRef<LoaderCircleIconHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 3000);
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
        <Grid.Cross row={2} column={2} />
        <Grid.Cross row={4} column={5} />
      </Grid>

      <BorderBeam
        size={60}
        duration={7}
        colorFrom="#ec4899"
        colorTo="#14b8a6"
        borderWidth={2}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <LoaderCircleIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

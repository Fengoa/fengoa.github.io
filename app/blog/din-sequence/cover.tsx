"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { Grid } from "@/components/ui/grid";
import { BrainIcon, type BrainHandle } from "@/components/ui/brain-icon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DINSequenceCoverProps {
  className?: string;
}

export function DINSequenceCover({ className }: DINSequenceCoverProps) {
  const iconRef = useRef<BrainHandle>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      iconRef.current?.startAnimation();
    }, 3400);
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
        <Grid.Cross row={3} column={3} />
        <Grid.Cross row={5} column={5} />
      </Grid>

      <BorderBeam
        size={60}
        duration={8}
        colorFrom="#f97316"
        colorTo="#06b6d4"
        borderWidth={2}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <BrainIcon
          ref={iconRef}
          size={64}
          duration={1.5}
          className="text-neutral-300 dark:text-neutral-600"
        />
      </div>
    </div>
  );
}

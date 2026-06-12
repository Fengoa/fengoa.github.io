"use client";

import coverImage from "./images/image01.png";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

interface ObsessionCoverProps {
  className?: string;
}

export function ObsessionCover({ className }: ObsessionCoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-full bg-neutral-950",
        className
      )}
    >
      <img
        src={coverImage.src}
        alt=""
        className="absolute inset-0 size-full object-cover object-[center_45%] scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <BorderBeam
        size={60}
        duration={10}
        colorFrom="#ef4444"
        colorTo="#a855f7"
        borderWidth={2}
      />
    </div>
  );
}

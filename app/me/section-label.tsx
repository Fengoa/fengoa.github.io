"use client";

import { type ReactNode, type Ref } from "react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useHoverSequence } from "@/hooks/use-hover-sequence";

interface AnimationHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SectionLabelProps {
  icon: (ref: Ref<AnimationHandle>) => ReactNode;
  label: string;
}

export function SectionLabel({ icon, label }: SectionLabelProps) {
  const seq = useHoverSequence({ initialDelay: 600, shimmerDelay: 300 });

  return (
    <div
      className="flex flex-col items-start gap-1.5 mb-4 text-foreground w-fit cursor-default"
      onMouseEnter={seq.handleEnter}
      onMouseLeave={seq.handleLeave}
    >
      <div className="size-8 flex items-center justify-center border rounded-md bg-white dark:bg-white/10 shadow-xs">
        {icon(seq.iconRef)}
      </div>
      {seq.isShimmering ? (
        <TextShimmer as="span" className="font-semibold ml-1">
          {label}
        </TextShimmer>
      ) : (
        <span className="font-semibold ml-1">{label}</span>
      )}
    </div>
  );
}

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
      className="flex flex-col items-center gap-1.5 mb-4 text-muted-foreground w-fit"
      onMouseEnter={seq.handleEnter}
      onMouseLeave={seq.handleLeave}
    >
      {icon(seq.iconRef)}
      {seq.isShimmering ? (
        <TextShimmer as="span" className="font-medium" duration={0.8}>
          {label}
        </TextShimmer>
      ) : (
        <span className="font-medium">{label}</span>
      )}
    </div>
  );
}

"use client";

import { BrainIcon } from "@/components/ui/brain-icon";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useHoverSequence } from "@/hooks/use-hover-sequence";

const demoTabs = [
  { id: "blog", label: "博客" },
  { id: "product", label: "产品" },
];

export function NavHoverDemo() {
  const blog = useHoverSequence();
  const product = useHoverSequence();

  const sequences: Record<string, ReturnType<typeof useHoverSequence>> = {
    blog,
    product,
  };

  return (
    <div className="flex flex-row gap-1">
      {demoTabs.map((tab) => {
        const seq = sequences[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            className="group inline-flex font-medium items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-200 text-muted-foreground hover:text-foreground"
            onMouseEnter={seq.handleEnter}
            onMouseLeave={seq.handleLeave}
          >
            {tab.id === "blog" && (
              <BrainIcon ref={seq.iconRef} size={20} isAnimated={false} />
            )}
            {tab.id === "product" && (
              <DashboardIcon ref={seq.iconRef} size={20} isAnimated={false} />
            )}
            {seq.isShimmering ? (
              <TextShimmer as="span">{tab.label}</TextShimmer>
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

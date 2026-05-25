"use client";

import { cn } from "@/lib/utils";

const ALL_TAG = "全部";

interface TagFilterProps {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  const allTags = [ALL_TAG, ...tags];

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 sm:px-8 lg:px-10 py-4">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === ALL_TAG ? ALL_TAG : tag)}
          className={cn(
            "px-3 py-1 text-xs font-mono rounded-full border transition-all duration-200",
            "hover:border-foreground/40 hover:text-foreground",
            activeTag === tag || (tag === ALL_TAG && activeTag === ALL_TAG)
              ? "border-foreground/60 text-foreground bg-foreground/5"
              : "border-border text-muted-foreground"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export { ALL_TAG };

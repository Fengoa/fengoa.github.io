"use client";

import { useRouter, usePathname } from "next/navigation";
import { BrainIcon } from "@/components/ui/brain-icon";
import { DashboardIcon } from "@/components/ui/dashboard-icon";
import { HeartIcon } from "@/components/ui/heart-icon";
import { AvatarIcon } from "@/components/ui/avatar-icon";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useHoverSequence } from "@/hooks/use-hover-sequence";

const tabs = [
  { id: "blog", label: "博客", href: "/" },
  { id: "taste", label: "品味", href: "/taste" },
  { id: "product", label: "产品", href: "/product" },
  { id: "me", label: "我的", href: "/me" },
];

function getActiveTab(pathname: string): string {
  if (pathname === "/") return "blog";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/taste")) return "taste";
  if (pathname.startsWith("/product")) return "product";
  if (pathname.startsWith("/me")) return "me";
  return "blog";
}

export function NavTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  const blog = useHoverSequence();
  const taste = useHoverSequence();
  const product = useHoverSequence();
  const me = useHoverSequence();

  const sequences: Record<string, ReturnType<typeof useHoverSequence>> = {
    blog,
    taste,
    product,
    me,
  };

  return (
    <div className="flex flex-row gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const seq = sequences[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            className={`group inline-flex font-medium items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => router.push(tab.href)}
            onMouseEnter={seq.handleEnter}
            onMouseLeave={seq.handleLeave}
          >
            {tab.id === "blog" && (
              <BrainIcon ref={seq.iconRef} size={20} isAnimated={false} />
            )}
            {tab.id === "taste" && (
              <HeartIcon ref={seq.iconRef} size={20} isAnimated={false} />
            )}
            {tab.id === "product" && (
              <DashboardIcon ref={seq.iconRef} size={20} isAnimated={false} />
            )}
            {tab.id === "me" && (
              <AvatarIcon
                ref={seq.iconRef}
                src="/favicon.ico"
                alt="我"
                size={20}
                isAnimated={false}
                active={isActive}
              />
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

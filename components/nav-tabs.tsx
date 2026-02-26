"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState, useCallback } from "react";
import { BrainIcon, type BrainHandle } from "@/components/ui/brain-icon";
import {
  DashboardIcon,
  type DashboardIconHandle,
} from "@/components/ui/dashboard-icon";
import {
  AvatarIcon,
  type AvatarIconHandle,
} from "@/components/ui/avatar-icon";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";

const tabs = [
  { id: "blog", label: "博客", href: "/" },
  { id: "product", label: "产品", href: "/product" },
  { id: "me", label: "我的", href: "/me" },
];

function getActiveTab(pathname: string): string {
  if (pathname === "/") return "blog";
  if (pathname.startsWith("/product")) return "product";
  if (pathname.startsWith("/me")) return "me";
  return "blog";
}

export function NavTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  const brainRef = useRef<BrainHandle>(null);
  const dashboardRef = useRef<DashboardIconHandle>(null);
  const avatarRef = useRef<AvatarIconHandle>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef<string | null>(null);

  const [shimmerTabId, setShimmerTabId] = useState<string | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  }, []);

  const startIcon = useCallback((id: string) => {
    if (id === "blog") brainRef.current?.startAnimation();
    if (id === "product") dashboardRef.current?.startAnimation();
    if (id === "me") avatarRef.current?.startAnimation();
  }, []);

  const playSequence = useCallback(
    (id: string) => {
      // 图标动画
      startIcon(id);

      // 图标动画约 500ms 后，开始 shimmer
      addTimer(() => {
        if (hoveredRef.current !== id) return;
        setShimmerTabId(id);

        // shimmer 约 800ms，播完后移除
        addTimer(() => {
          setShimmerTabId(null);

          // 再等 2s，鼠标还在就再来一轮
          addTimer(() => {
            if (hoveredRef.current !== id) return;
            playSequence(id);
          }, 2000);
        }, 800);
      }, 500);
    },
    [startIcon, addTimer],
  );

  const handleEnter = useCallback(
    (id: string) => {
      clearTimers();
      hoveredRef.current = id;

      // 1s 后开始第一轮
      addTimer(() => {
        if (hoveredRef.current !== id) return;
        playSequence(id);
      }, 1000);
    },
    [clearTimers, addTimer, playSequence],
  );

  const handleLeave = useCallback(
    (id: string) => {
      clearTimers();
      hoveredRef.current = null;
      if (id === "blog") brainRef.current?.stopAnimation();
      if (id === "product") dashboardRef.current?.stopAnimation();
      if (id === "me") avatarRef.current?.stopAnimation();
      setShimmerTabId(null);
    },
    [clearTimers],
  );

  return (
    <div className="flex flex-row gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isShimmering = shimmerTabId === tab.id;

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
            onMouseEnter={() => handleEnter(tab.id)}
            onMouseLeave={() => handleLeave(tab.id)}
          >
            {tab.id === "blog" && (
              <BrainIcon ref={brainRef} size={20} isAnimated={false} />
            )}
            {tab.id === "product" && (
              <DashboardIcon
                ref={dashboardRef}
                size={20}
                isAnimated={false}
              />
            )}
            {tab.id === "me" && (
              <AvatarIcon
                ref={avatarRef}
                src="/favicon.ico"
                alt="我"
                size={20}
                isAnimated={false}
                active={isActive}
              />
            )}
            {isShimmering ? (
              <TextShimmer as="span" duration={0.8}>
                {tab.label}
              </TextShimmer>
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

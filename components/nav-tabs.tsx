"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ALargeSmall, Apple, Egg, Superscript } from "lucide-react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { type ReactNode } from "react";

const tabs: { id: string; label: string; icon: ReactNode; href: string }[] = [
  {
    id: "blog",
    label: "博客",
    icon: <ALargeSmall className="size-4" />,
    href: "/",
  },
  {
    id: "product",
    label: "产品",
    icon: <Apple className="size-4" />,
    href: "/product",
  },
  {
    id: "taste",
    label: "品味",
    icon: <Superscript className="size-4" />,
    href: "/taste",
  },
  {
    id: "me",
    label: "我",
    icon: <Egg className="size-4" />,
    href: "#",
  },
];

function getActiveTab(pathname: string): string {
  if (pathname === "/") return "blog";
  if (pathname.startsWith("/taste")) return "taste";
  if (pathname.startsWith("/product")) return "product";
  if (pathname.startsWith("/me")) return "me";
  return "blog";
}

export function NavTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  return (
    <div className="flex flex-row">
      <AnimatedBackground
        defaultValue={activeTab}
        className="rounded-lg bg-black/5 dark:bg-white/10"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {tabs.map((tab) => {
          const isMe = tab.id === "me";
          const isMeActive = isMe && activeTab === "me";
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              data-id={tab.id}
              type="button"
              className={`relative inline-flex h-9 items-center gap-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                if (tab.href !== "#") {
                  router.push(tab.href);
                }
              }}
            >
              {isMe ? (
                isMeActive ? (
                  <Image
                    src="/avatar.png"
                    alt="我"
                    width={16}
                    height={16}
                    className="rounded-full size-4 nav-avatar"
                  />
                ) : (
                  <Egg className="size-4" />
                )
              ) : (
                tab.icon
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ALargeSmall, Apple, Egg, Superscript } from "lucide-react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import { type ReactNode, useState } from "react";

const tabs: { id: string; label: string; icon: ReactNode; href: string }[] = [
  {
    id: "blog",
    label: "博客",
    icon: <ALargeSmall className="size-5" />,
    href: "/",
  },
  {
    id: "product",
    label: "产品",
    icon: <Apple className="size-5" />,
    href: "#",
  },
  {
    id: "taste",
    label: "品味",
    icon: <Superscript className="size-5" />,
    href: "/taste",
  },
  {
    id: "me",
    label: "我",
    icon: <Egg className="size-5" />,
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
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="flex flex-row">
      <AnimatedBackground
        defaultValue={activeTab}
        className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
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

          return (
            <button
              key={tab.id}
              data-id={tab.id}
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground data-[checked=true]:text-foreground"
              onClick={() => {
                if (tab.href !== "#") {
                  router.push(tab.href);
                }
              }}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {isMe ? (
                isMeActive ? (
                  <Image
                    src="/avatar.png"
                    alt="我"
                    width={20}
                    height={20}
                    className="rounded-full size-5"
                  />
                ) : (
                  <Egg className="size-5" />
                )
              ) : (
                tab.icon
              )}

              {/* Tooltip */}
              {hoveredTab === tab.id && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] whitespace-nowrap rounded-md bg-foreground text-background pointer-events-none">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}

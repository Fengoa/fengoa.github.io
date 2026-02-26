"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";

const tabs = [
  { id: "blog", label: "博客", href: "/" },
  { id: "product", label: "产品", href: "/product" },
  { id: "taste", label: "品味", href: "/taste" },
  { id: "me", label: "我", href: "/me" },
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
        className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              data-id={tab.id}
              type="button"
              className={`inline-flex h-9 items-center gap-2 px-3 py-0.5 rounded-lg text-sm transition-colors duration-300 ${
                isActive
                  ? "text-foreground font-medium bg-zinc-100 dark:bg-zinc-800"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => router.push(tab.href)}
            >
              {tab.id === "me" && (
                <Image
                  src="/avatar.png"
                  alt="我"
                  width={16}
                  height={16}
                  className="rounded-full size-4 nav-avatar"
                />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}

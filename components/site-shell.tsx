"use client";

import { usePathname } from "next/navigation";
import { BorderBeam } from "@/components/ui/border-beam";
import { NavTabs } from "@/components/nav-tabs";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { TextLoop } from "@/components/motion-primitives/text-loop";
import { CommandPalette } from "@/components/command-palette";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === "/2048" || pathname.startsWith("/2048/");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <CommandPalette />

      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="absolute inset-0 -bottom-4 backdrop-blur-3xl bg-linear-to-b from-background to-transparent pointer-events-none mask-[linear-gradient(black_30%,rgba(0,0,0,0.8)_70%,transparent_100%)]" />
        <div className="relative mx-auto px-4 md:px-16 max-w-7xl h-full flex items-center justify-center">
          <NavTabs />
        </div>
      </nav>

      <div className="fixed inset-px -top-px pointer-events-none z-50">
        <BorderBeam duration={80} size={100} />
      </div>

      <div className="relative pt-14 pb-8 min-h-screen mx-auto px-4 md:px-16 max-w-272">
        {children}
      </div>

      <footer className="border-t flex items-center justify-between">
        <div className="mx-auto px-4 md:px-16 max-w-7xl w-full py-4 flex items-center justify-between">
          <TextLoop
            interval={6}
            className="text-xs text-muted-foreground overflow-hidden"
          >
            <span>© {new Date().getFullYear()} Oriensx.</span>
            <span>Be quiet.</span>
          </TextLoop>
          <ThemeSwitcher />
        </div>
      </footer>
    </>
  );
}

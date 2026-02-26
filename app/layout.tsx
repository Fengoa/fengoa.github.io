import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BorderBeam } from "@/components/ui/border-beam";
import { ThemeProvider } from "@/components/theme-provider";
import { NavTabs } from "@/components/nav-tabs";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { TextLoop } from "@/components/motion-primitives/text-loop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oriens",
  description: "Oriens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cmn-Hans" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 顶部导航 */}
          <nav className="fixed top-0 left-0 right-0 z-50 h-14">
            <div className="absolute inset-0 -bottom-4 backdrop-blur-md bg-linear-to-b from-background to-transparent pointer-events-none mask-[linear-gradient(black_30%,rgba(0,0,0,0.8)_70%,transparent_100%)]" />
            <div className="relative mx-auto px-4 md:px-16 max-w-320 h-full flex items-center">
              <NavTabs />
            </div>
          </nav>

          {/* 边框光束 */}
          <div className="fixed inset-px -top-px pointer-events-none z-50">
            <BorderBeam duration={80} size={100} />
          </div>

          {/* 内容区 */}
          <div className="relative pt-14 pb-8 min-h-screen mx-auto px-4 md:px-16 max-w-272">
            {children}
          </div>

          {/* Footer */}
          <footer className="border-t mx-auto px-4 md:px-16 max-w-320 py-4 flex items-center justify-between">
            <TextLoop
              interval={6}
              className="text-xs text-muted-foreground overflow-hidden"
            >
              <span>© {new Date().getFullYear()} Oriens.</span>
              <span>Be quiet.</span>
            </TextLoop>
            <ThemeSwitcher />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [fadeTop, setFadeTop] = useState(false);
  const [fadeBottom, setFadeBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const overflow = scrollHeight > clientHeight + 2;
    setFadeTop(overflow && scrollTop > 4);
    setFadeBottom(overflow && scrollTop + clientHeight < scrollHeight - 4);
  }, []);

  useEffect(() => {
    const updateHeadings = () => {
      const elements = Array.from(document.querySelectorAll("h2, h3"))
        .map((elem) => ({
          id: elem.id,
          text: elem.textContent || "",
          level: Number(elem.tagName.substring(1)),
        }))
        .filter((item) => item.id);
      setHeadings(elements);
    };

    updateHeadings();

    const observer = new MutationObserver(updateHeadings);
    const mainElement = document.querySelector("main");
    if (mainElement) {
      observer.observe(mainElement, { childList: true, subtree: true });
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    const headingElements = document.querySelectorAll("h2, h3");
    headingElements.forEach((element) => {
      if (element.id) intersectionObserver.observe(element);
    });

    return () => {
      observer.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [headings, updateFades]);

  return (
    <nav className="flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 14l-4-4 4-4" />
          <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
        </svg>
        <span>博客</span>
      </Link>

      {headings.length > 0 && (
        <div className="relative">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-10 h-14",
              "transition-opacity duration-200",
              fadeTop ? "opacity-100" : "opacity-0"
            )}
            style={{
              background:
                "linear-gradient(to bottom, var(--background) 0%, var(--background) 18%, transparent 58%)",
            }}
          />
          <div
            ref={scrollRef}
            className="flex flex-col gap-2.5 max-h-[min(50vh,28rem)] overflow-y-auto scrollbar-hide"
          >
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                title={heading.text}
                className={cn(
                  "text-xs transition-all hover:text-foreground truncate shrink-0",
                  heading.level === 3
                    ? "pl-3 text-muted-foreground"
                    : "font-medium",
                  activeId === heading.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const yOffset = -100;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    window.history.pushState(null, "", `#${heading.id}`);
                  }
                }}
              >
                {heading.text}
              </a>
            ))}
          </div>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14",
              "transition-opacity duration-200",
              fadeBottom ? "opacity-100" : "opacity-0"
            )}
            style={{
              background:
                "linear-gradient(to top, var(--background) 0%, var(--background) 18%, transparent 58%)",
            }}
          />
        </div>
      )}
    </nav>
  );
}

"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import {
  ExternalLinkIcon,
  type ExternalLinkIconHandle,
} from "@/components/ui/external-link-icon";
import { cn } from "@/lib/utils";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  showArrow?: boolean;
  className?: string;
}

export function ExternalLink({
  href,
  children,
  icon,
  showArrow = true,
  className,
}: ExternalLinkProps) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const iconRef = useRef<ExternalLinkIconHandle>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  }, []);

  const playSequence = useCallback(() => {
    setIsShimmering(true);

    addTimer(() => {
      setIsShimmering(false);

      addTimer(() => {
        if (!hoveredRef.current) return;
        iconRef.current?.startAnimation();

        addTimer(() => {
          if (!hoveredRef.current) return;
          playSequence();
        }, 2000);
      }, 300);
    }, 800);
  }, [addTimer]);

  const handleEnter = useCallback(() => {
    clearTimers();
    hoveredRef.current = true;

    addTimer(() => {
      if (!hoveredRef.current) return;
      playSequence();
    }, 600);
  }, [clearTimers, addTimer, playSequence]);

  const handleLeave = useCallback(() => {
    clearTimers();
    hoveredRef.current = false;
    iconRef.current?.stopAnimation();
    setIsShimmering(false);
  }, [clearTimers]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline text-muted-foreground hover:text-blue-600 transition-colors relative -top-px",
        className
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {icon}
      {isShimmering ? (
        <TextShimmer
          as="span"
          className="text-sm inline [--base-color:var(--color-blue-600)]"
        >
          {children as string}
        </TextShimmer>
      ) : (
        <span className="text-sm">{children}</span>
      )}
      {showArrow && (
        <ExternalLinkIcon
          ref={iconRef}
          size={14}
          isAnimated={false}
          className="inline-block ml-0.5 align-middle opacity-70"
        />
      )}
    </a>
  );
}

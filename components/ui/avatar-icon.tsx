"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface AvatarIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AvatarIconProps extends HTMLMotionProps<"div"> {
  src: string;
  alt?: string;
  size?: number;
  duration?: number;
  isAnimated?: boolean;
  active?: boolean;
}

const AvatarIcon = forwardRef<AvatarIconHandle, AvatarIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      src,
      alt = "",
      size = 24,
      duration = 0.6,
      isAnimated = true,
      active = false,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation();
    const reduced = useReducedMotion();
    const isControlled = useRef(false);

    useImperativeHandle(ref, () => {
      isControlled.current = true;
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleEnter = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return;
        if (!isControlled.current) controls.start("animate");
        else onMouseEnter?.(e as any);
      },
      [controls, reduced, isAnimated, onMouseEnter]
    );

    const handleLeave = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) controls.start("normal");
        else onMouseLeave?.(e as any);
      },
      [controls, onMouseLeave]
    );

    const avatarVariants: Variants = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.1, 0.95, 1],
        transition: {
          duration: 0.55,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    };

    return (
      <motion.div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        {...props}
      >
        <motion.img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={cn(
            "rounded-full -mt-0.5 -mr-0.5 transition-[filter,opacity] duration-200",
            active ? "grayscale-0 opacity-100" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
          )}
          style={{ width: size, height: size }}
          variants={avatarVariants}
          initial="normal"
          animate={controls}
        />
      </motion.div>
    );
  }
);

AvatarIcon.displayName = "AvatarIcon";
export { AvatarIcon };

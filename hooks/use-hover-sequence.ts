import { useRef, useState, useCallback } from "react";

interface AnimationHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UseHoverSequenceOptions {
  /** 鼠标进入后等待多久开始第一轮（ms） */
  initialDelay?: number;
  /** 图标动画播完后等多久开始 shimmer（ms） */
  shimmerDelay?: number;
  /** shimmer 持续时间（ms） */
  shimmerDuration?: number;
  /** 一轮播完后等多久开始下一轮（ms） */
  loopDelay?: number;
}

export function useHoverSequence(options: UseHoverSequenceOptions = {}) {
  const {
    initialDelay = 1000,
    shimmerDelay = 500,
    shimmerDuration = 800,
    loopDelay = 2000,
  } = options;

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const iconRef = useRef<AnimationHandle>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  }, []);

  const playSequence = useCallback(() => {
    iconRef.current?.startAnimation();

    addTimer(() => {
      if (!hoveredRef.current) return;
      setIsShimmering(true);

      addTimer(() => {
        setIsShimmering(false);

        addTimer(() => {
          if (!hoveredRef.current) return;
          playSequence();
        }, loopDelay);
      }, shimmerDuration);
    }, shimmerDelay);
  }, [addTimer, shimmerDelay, shimmerDuration, loopDelay]);

  const handleEnter = useCallback(() => {
    clearTimers();
    hoveredRef.current = true;

    addTimer(() => {
      if (!hoveredRef.current) return;
      playSequence();
    }, initialDelay);
  }, [clearTimers, addTimer, playSequence, initialDelay]);

  const handleLeave = useCallback(() => {
    clearTimers();
    hoveredRef.current = false;
    iconRef.current?.stopAnimation();
    setIsShimmering(false);
  }, [clearTimers]);

  return { iconRef, isShimmering, handleEnter, handleLeave };
}

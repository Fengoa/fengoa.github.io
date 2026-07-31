"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function stripCheckbox(node: ReactNode): ReactNode {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement<{ type?: string; children?: ReactNode }>(child)) {
      return child;
    }
    if (child.type === "input" && child.props.type === "checkbox") {
      return null;
    }
    if (child.props.children != null) {
      return React.cloneElement(child, {
        ...child.props,
        children: stripCheckbox(child.props.children),
      });
    }
    return child;
  });
}

export function TaskListItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"li">) {
  const pathname = usePathname() ?? "";
  const label = useMemo(() => extractText(children).trim(), [children]);
  const storageKey = useMemo(
    () => `blog-task:${pathname}:${label.slice(0, 160)}`,
    [pathname, label]
  );

  const [checked, setChecked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setChecked(localStorage.getItem(storageKey) === "1");
    } catch {
      // ignore quota / private mode
    }
    setHydrated(true);
  }, [storageKey]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setChecked(next);
    try {
      localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  return (
    <li
      className={cn(
        "flex items-start gap-2 py-0.5 leading-relaxed",
        className
      )}
      {...props}
    >
      <input
        type="checkbox"
        className="mt-1.25 size-4 shrink-0 cursor-pointer accent-foreground"
        checked={hydrated ? checked : false}
        onChange={onChange}
        aria-label={label.slice(0, 80) || "清单项"}
      />
      <span
        className={cn(
          "min-w-0 flex-1",
          checked &&
            "text-muted-foreground underline decoration-dashed underline-offset-4 [&_strong]:text-inherit"
        )}
      >
        {stripCheckbox(children)}
      </span>
    </li>
  );
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getId = (children: any): string => {
  if (!children) return "";
  
  const text = (node: any): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(text).join("");
    if (node?.props?.children) return text(node.props.children);
    return "";
  };

  return text(children)
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[.?]/g, "")
    .replace(/[^\p{L}\p{N}_-]/gu, "");
}

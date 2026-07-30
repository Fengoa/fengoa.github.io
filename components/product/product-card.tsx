"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ProductItem = {
  id: string;
  name: string;
  description: ReactNode;
  href: string;
  icon?: ReactNode;
};

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function ProductCard({
  product,
  index,
}: {
  product: ProductItem;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const external = isExternalHref(product.href);

  const body = (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 md:gap-8 overflow-hidden p-6 sm:p-8 lg:p-10"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center mb-6 md:mb-0",
          isEven
            ? "md:order-2 md:justify-end"
            : "md:order-1 md:justify-start"
        )}
      >
        <div className="flex items-center justify-center aspect-square rounded-full w-[60%] md:size-60 border bg-muted/30 group-hover:scale-[1.02] transition-all duration-300">
          <span className="text-foreground scale-[3] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            {product.icon}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col justify-center items-start gap-6 md:gap-8",
          isEven ? "md:order-1" : "md:order-2"
        )}
      >
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground">
            {product.name}
          </h2>

          <div className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-secondary-foreground transition-colors duration-200">
            {product.description}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-secondary-foreground hover:text-blue-600 hover:gap-2 transition-all duration-200">
          {external ? "打开项目" : "查看说明"}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </div>
  );

  const className =
    "group relative block transition-colors duration-300 hover:bg-white dark:hover:bg-white/5 cursor-pointer";

  if (external) {
    return (
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={product.href} className={className}>
      {body}
    </Link>
  );
}

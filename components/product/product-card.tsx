import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  tags?: string[];
  icon?: ReactNode;
  year?: string;
};

export function ProductCard({ product }: { product: ProductItem }) {
  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between h-full p-6 sm:p-8"
    >
      {/* 顶部：图标 + 年份 */}
      <div>
        <div className="flex items-start justify-between">
          {product.icon && (
            <span className="text-foreground">{product.icon}</span>
          )}
          {product.year && (
            <span className="text-xs text-muted-foreground">{product.year}</span>
          )}
        </div>

        {/* 名称 + 描述 */}
        <h3 className="mt-4 text-lg font-bold text-foreground leading-snug">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* 底部：标签 + 箭头 */}
      <div className="mt-6 flex items-end justify-between">
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </a>
  );
}

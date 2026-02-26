import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

export type ProductFeature = {
  icon: ReactNode;
  text: string;
};

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  price?: string;
  priceNote?: string;
  features: ProductFeature[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  secondaryCta?: string;
  secondaryCtaHref?: string;
};

export function ProductCard({ product }: { product: ProductItem }) {
  return (
    <div className="flex flex-col h-full p-6 sm:p-8">
      {/* Popular badge */}
      {product.popular && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-foreground text-background">
            Popular
          </span>
        </div>
      )}
      {/* 如果不是 popular，留出等高的占位 */}
      {!product.popular && <div className="mb-4 h-6" />}

      {/* Title + Description */}
      <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </p>
      {product.price && (
        <p className="mt-1 text-sm text-foreground font-medium">
          {product.price}
          {product.priceNote && (
            <span className="text-muted-foreground font-normal">
              {" "}
              {product.priceNote}
            </span>
          )}
        </p>
      )}

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3">
        {product.features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <span className="shrink-0 mt-0.5 text-foreground/60">
              {feature.icon}
            </span>
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8 flex gap-3">
        <a
          href={product.ctaHref}
          className={`inline-flex items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            product.popular
              ? "bg-foreground text-background hover:bg-foreground/90 flex-1"
              : "border border-border text-foreground hover:bg-muted flex-1"
          }`}
        >
          <span>{product.cta}</span>
          <ArrowRight className="size-4" />
        </a>
        {product.secondaryCta && (
          <a
            href={product.secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {product.secondaryCta}
          </a>
        )}
      </div>
    </div>
  );
}

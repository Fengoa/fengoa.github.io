"use client";

import { ProductCard, type ProductItem } from "./product-card";
import { Grid } from "@/components/ui/grid";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";

export function ProductList({ products }: { products: ProductItem[] }) {
  const columns = products.length;

  return (
    <Grid rows={1} columns={columns}>
      <AnimatedBackground
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.6,
        }}
        enableHover
        className="bg-black/2 dark:bg-white/4"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            data-id={product.id}
            className="taste-grid-cell"
            style={{
              gridRow: "1 / span 1",
              gridColumn: `${index + 1} / span 1`,
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </AnimatedBackground>
    </Grid>
  );
}

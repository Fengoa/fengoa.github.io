"use client";

import { ProductCard, type ProductItem } from "./product-card";
import { Grid } from "@/components/ui/grid";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";

const COLUMNS = 3;

export function ProductList({ products }: { products: ProductItem[] }) {
  const rows = Math.ceil(products.length / COLUMNS);

  return (
    <Grid rows={rows} columns={COLUMNS}>
      <AnimatedBackground
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.6,
        }}
        enableHover
        className="bg-black/2 dark:bg-white/4"
      >
        {products.map((product, index) => {
          const row = Math.floor(index / COLUMNS) + 1;
          const col = (index % COLUMNS) + 1;

          return (
            <Grid.Cell
              key={product.id}
              data-id={product.id}
              row={row}
              column={col}
            >
              <ProductCard product={product} />
            </Grid.Cell>
          );
        })}
      </AnimatedBackground>
    </Grid>
  );
}

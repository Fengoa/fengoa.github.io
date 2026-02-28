import { ProductCard, type ProductItem } from "./product-card";
import { Grid } from "@/components/ui/grid";

const COLUMNS = 1;

export function ProductList({ products }: { products: ProductItem[] }) {
  const rows = products.length;

  return (
    <Grid rows={rows} columns={COLUMNS}>
      {products.map((product, index) => (
        <Grid.Cell key={product.id} row={index + 1} column={1}>
          <ProductCard product={product} index={index} />
        </Grid.Cell>
      ))}
    </Grid>
  );
}

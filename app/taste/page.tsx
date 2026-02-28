import { TasteHero } from "@/components/taste/taste-hero";
import { TasteList } from "@/components/taste/taste-list";
import { tasteCategories } from "@/components/taste/taste-data";
import { Grid } from "@/components/ui/grid";

export default function TastePage() {
  return (
    <main className="py-20">
      <Grid.System>
        <TasteHero />
        <TasteList categories={tasteCategories} />
      </Grid.System>
    </main>
  );
}

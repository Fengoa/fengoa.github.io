import type { Metadata } from "next";
import { Grid } from "@/components/ui/grid";
import { CreateGinApiHero } from "./hero";
import { CreateGinApiContent } from "./content";

export const metadata: Metadata = {
  title: "create-gin-api",
  description:
    "Go CLI 脚手架：交互式生成 Gin API 项目，模板含 GORM / Postgres、Redis、Zap、Air、Swagger 与 Docker Compose。",
};

export default function CreateGinApiProductPage() {
  return (
    <main className="py-20">
      <Grid.System>
        <CreateGinApiHero />
        <CreateGinApiContent />
      </Grid.System>
    </main>
  );
}

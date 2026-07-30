import type { Metadata } from "next";
import { Grid } from "@/components/ui/grid";
import { CreateGinApiHero } from "@/components/product/create-gin-api/hero";
import { CreateGinApiContent } from "@/components/product/create-gin-api/content";

export const metadata: Metadata = {
  title: "create-gin-api",
  description:
    "一条命令生成 Gin API 项目骨架。GORM / Postgres、Redis、Zap、Air、Swagger 已写入模板。",
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

"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogHero } from "@/components/blog/blog-hero";
import { PostList } from "@/components/blog/post-list";
import { Grid } from "@/components/ui/grid";
import { monthlies } from "@/app/monthlies";

const ALL_YEARS = "all";
const years = Array.from(new Set(monthlies.map((item) => item.date.slice(0, 4))));
const yearTabs = [
  { id: ALL_YEARS, label: "全部" },
  ...years.map((year) => ({ id: year, label: year })),
];

export default function MonthlyPage() {
  return (
    <Suspense>
      <MonthlyContent />
    </Suspense>
  );
}

function MonthlyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialYear = searchParams.get("year") || ALL_YEARS;
  const [activeYear, setActiveYear] = useState(
    yearTabs.some((tab) => tab.id === initialYear) ? initialYear : ALL_YEARS
  );

  const yearCounts = useMemo(
    () =>
      Object.fromEntries(
        yearTabs.map((tab) => [
          tab.id,
          tab.id === ALL_YEARS
            ? monthlies.length
            : monthlies.filter((item) => item.date.startsWith(tab.id)).length,
        ])
      ),
    []
  );

  const visibleMonthlies = useMemo(
    () =>
      activeYear === ALL_YEARS
        ? monthlies
        : monthlies.filter((item) => item.date.startsWith(activeYear)),
    [activeYear]
  );

  const handleYearChange = useCallback(
    (year: string) => {
      setActiveYear(year);
      router.replace(year === ALL_YEARS ? "/monthly" : `/monthly?year=${year}`, {
        scroll: false,
      });
    },
    [router]
  );

  return (
    <main className="py-20">
      <Grid.System>
        <BlogHero
          tags={yearTabs}
          activeTag={activeYear}
          onTagChange={handleYearChange}
          tagCounts={yearCounts}
        />
        <PostList posts={visibleMonthlies} hideTopBorder />
      </Grid.System>
    </main>
  );
}

import { MonthlyFeed } from "@/components/monthly/feed";
import { loadMonthlyEntries } from "@/lib/monthly-load";

export const metadata = {
  title: "月刊",
  description: "读到、看到与使用过的内容，按条目持续补充。",
};

export default function MonthlyPage() {
  const entries = loadMonthlyEntries();

  return (
    <main>
      <MonthlyFeed entries={entries} />
    </main>
  );
}

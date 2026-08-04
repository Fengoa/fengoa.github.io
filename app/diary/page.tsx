import { DiaryFeed } from "@/components/diary/feed";
import { loadDiaryEntries } from "@/lib/diary-load";

export const metadata = {
  title: "日记",
  description: "读到、看到与使用过的内容，按条目持续补充。",
};

export default function DiaryPage() {
  const entries = loadDiaryEntries();

  return (
    <main>
      <DiaryFeed entries={entries} />
    </main>
  );
}

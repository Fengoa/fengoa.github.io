export interface MonthlyEntry {
  id: string;
  date: string;
  time: string;
  tags: string[];
  url?: string;
  title: string;
  bodyMarkdown: string;
  searchText: string;
}

export function formatFeedDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function formatFeedTime(time: string) {
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  if (Number.isNaN(hour)) return time;
  const period = hour < 12 ? "上午" : "下午";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${hour12}:${minute.padStart(2, "0")}`;
}

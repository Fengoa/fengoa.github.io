export type TasteCategory =
  | "文章"
  | "工具"
  | "设计"
  | "开源"
  | "播客"
  | "视频";

export type TasteItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: TasteCategory;
  date: string;
  source?: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      className="share-icon"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="share-icon-arrow"
        clipRule="evenodd"
        d="M9.74999 1H8.99999V2.5H9.74999H12.4388L7.46966 7.46912L6.93933 7.99945L7.99999 9.06011L8.53032 8.52978L13.4994 3.56066V6.25V7H14.9994V6.25V1.75C14.9994 1.33579 14.6637 1 14.2494 1H9.74999Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        className="share-icon-line"
        d="M14.25 10.25L14.25 13.25C14.25 13.8023 13.8023 14.25 13.25 14.25L2.75 14.25C2.19772 14.25 1.75 13.8023 1.75 13.25L1.75 2.75C1.75 2.19772 2.19772 1.75 2.75 1.75L5.75 1.75"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TasteCard({ item }: { item: TasteItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between h-full p-6 sm:p-8"
    >
      {/* 顶部：分类 + 日期 + 外链图标 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{item.category}</span>
          <span>&nbsp;</span>
          <span>{formatDate(item.date)}</span>
        </div>
        <div className="shrink-0 text-muted-foreground/60 group-hover:text-foreground transition-colors">
          <ShareIcon />
        </div>
      </div>

      {/* 中下部：标题 + 描述 */}
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground mb-3">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>
    </a>
  );
}

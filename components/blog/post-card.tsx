import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type PostData = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  summary: string;
  cover?: string;
};

function formatDate(dateStr: string) {
  return dateStr;
}

export function PostCard({ post, index }: { post: PostData; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block transition-colors duration-300 hover:bg-white dark:hover:bg-white/5"
    >
      <article
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 md:gap-8 overflow-hidden p-6 sm:p-8 lg:p-10"
        )}
      >
        {/* 文字区 */}
        <div
          className={cn(
            "flex flex-col justify-between",
            !isEven && "md:order-2"
          )}
        >
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 font-mono text-xs text-muted-foreground tracking-wide">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3 -mt-px" />
                {formatDate(post.date)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-foreground mb-3">
              {post.title}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-secondary-foreground transition-colors duration-200">
              {post.summary}
            </p>
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:gap-2.5 transition-all duration-200">
              阅读文章
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>

        {/* 封面区 */}
        <div
          className={cn(
            "relative flex items-center justify-center",
            !isEven && "md:order-1"
          )}
        >
          <div className="aspect-square rounded-full overflow-hidden size-90 border">
            {post.cover && (
              <Image
                src={post.cover}
                alt={post.title}
                className="size-full object-cover"
                width={320}
                height={320}
              />
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

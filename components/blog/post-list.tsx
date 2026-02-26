"use client";

import { PostCard, type PostData } from "./post-card";
import { Grid } from "@/components/ui/grid";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";

const COLUMNS = 1;

export function PostList({ posts }: { posts: PostData[] }) {
  const rows = posts.length;

  return (
    <Grid rows={rows} columns={COLUMNS}>
      <AnimatedBackground
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.6,
        }}
        enableHover
        className="bg-black/2 dark:bg-white/4"
      >
        {posts.map((post, index) => (
          <div
            key={post.slug}
            data-id={post.slug}
            className="taste-grid-cell"
            style={{
              gridRow: `${index + 1} / span 1`,
              gridColumn: `1 / span 1`,
            }}
          >
            <PostCard post={post} index={index} />
          </div>
        ))}
      </AnimatedBackground>
    </Grid>
  );
}

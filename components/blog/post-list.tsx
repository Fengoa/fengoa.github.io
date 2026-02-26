import { PostCard, type PostData } from "./post-card";
import { Grid } from "@/components/ui/grid";

const COLUMNS = 1;

export function PostList({ posts }: { posts: PostData[] }) {
  const rows = posts.length;

  return (
    <Grid rows={rows} columns={COLUMNS}>
      {posts.map((post, index) => (
        <Grid.Cell
          key={post.slug}
          row={index + 1}
          column={1}

        >
          <PostCard post={post} index={index} />
        </Grid.Cell>
      ))}
    </Grid>
  );
}

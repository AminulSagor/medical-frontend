import type { BlogPost } from "@/types/public/blogs/blog-type";
import ListPostRow from "./post-cards/list-post-row";

export default function LatestDiscoveriesList({
  posts,
}: {
  posts: BlogPost[];
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500">
        No articles available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ListPostRow key={post.id} post={post} />
      ))}
    </div>
  );
}

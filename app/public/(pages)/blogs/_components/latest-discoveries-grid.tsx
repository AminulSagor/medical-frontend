import type { BlogPost } from "@/types/public/blogs/blog-type";
import BigFeatureCard from "./post-cards/big-feature-card";
import SmallPostCard from "./post-cards/small-feature-card";
import WideInterviewCard from "./post-cards/wide-interview-card";

export default function LatestDiscoveriesGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return <div className="py-10 text-center text-slate-500">No articles available.</div>;
  }

  const big = posts[0];
  const rightTop = posts[1];
  const rightBottom = posts[2];
  const wide = posts[3];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {big ? (
        <div className="md:col-span-2 md:row-span-2">
          <BigFeatureCard post={big} />
        </div>
      ) : null}

      {rightTop ? (
        <div className="md:col-span-1">
          <SmallPostCard post={rightTop} />
        </div>
      ) : null}

      {rightBottom ? (
        <div className="md:col-span-1">
          <SmallPostCard post={rightBottom} />
        </div>
      ) : null}

      {wide ? (
        <div className="md:col-span-3">
          <WideInterviewCard post={wide} />
        </div>
      ) : null}

      {posts.slice(4).map((post) => (
        <div key={post.id} className="md:col-span-1">
          <SmallPostCard post={post} />
        </div>
      ))}
    </div>
  );
}

import type { BlogPost } from "@/types/public/blogs/blog-type";

import SmallPostCard from "./post-cards/small-feature-card";
import BigFeatureCard from "@/app/public/(pages)/blogs/_components/post-cards/big-feature-card";
import WideInterviewCard from "@/app/public/(pages)/blogs/_components/post-cards/wide-interview-card";

export default function LatestDiscoveriesGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) {
    return <div className="py-10 text-center text-slate-500">No articles available.</div>;
  }

  const big = posts[0];
  const rightTop = posts[1];
  const rightBottom = posts[2];
  const wide = posts[3] || posts.slice(4).find(p => p) || posts[0]; // fallback if not exactly 4

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {big && (
        <div className="md:col-span-2 md:row-span-2">
          <BigFeatureCard post={big} />
        </div>
      )}

      {rightTop && (
        <div className="md:col-span-1">
          <SmallPostCard post={rightTop} />
        </div>
      )}

      {rightBottom && (
        <div className="md:col-span-1">
          <SmallPostCard post={rightBottom} />
        </div>
      )}

      {wide && posts.length >= 4 && (
        <div className="md:col-span-3">
          <WideInterviewCard post={wide} />
        </div>
      )}
      
      {/* If there are more than 4, render them gracefully (e.g. as regular small cards in row) */}
      {posts.slice(4).map((post, idx) => (
        <div key={post.id} className="md:col-span-1">
          <SmallPostCard post={post} />
        </div>
      ))}
    </div>
  );
}

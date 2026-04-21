import type { BlogPost } from "@/types/public/blogs/blog-type";
import BigFeatureCard from "./post-cards/big-feature-card";
import SmallPostCard from "./post-cards/small-feature-card";
import WideInterviewCard from "./post-cards/wide-interview-card";

export default function LatestDiscoveriesGrid({
  posts,
}: {
  posts: BlogPost[];
}) {
  if (!posts.length) {
    return (
      <div className="py-10 text-center text-slate-500">
        No articles available.
      </div>
    );
  }

  const big = posts[0];
  const rightTop = posts[1];
  const rightBottom = posts[2];
  const wide = posts[3];
  const remainingPosts = posts.slice(4);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.95fr)]">
        {big ? (
          <div>
            <BigFeatureCard post={big} />
          </div>
        ) : null}

        <div className="grid gap-6">
          {rightTop ? (
            <div>
              <SmallPostCard post={rightTop} />
            </div>
          ) : null}

          {rightBottom ? (
            <div>
              <SmallPostCard post={rightBottom} />
            </div>
          ) : null}
        </div>
      </div>

      {wide ? (
        <div>
          <WideInterviewCard post={wide} />
        </div>
      ) : null}

      {remainingPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {remainingPosts.map((post) => (
            <div key={post.id}>
              <SmallPostCard post={post} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

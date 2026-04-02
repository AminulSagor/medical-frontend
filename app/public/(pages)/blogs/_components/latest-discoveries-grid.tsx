import { BLOG_LATEST } from "@/app/public/data/blogs.data";

import SmallPostCard from "./post-cards/small-feature-card";
import BigFeatureCard from "@/app/public/(pages)/blogs/_components/post-cards/big-feature-card";
import WideInterviewCard from "@/app/public/(pages)/blogs/_components/post-cards/wide-interview-card";

export default function LatestDiscoveriesGrid() {
  const [big, rightTop, rightBottom, wide] = BLOG_LATEST;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 md:row-span-2">
        <BigFeatureCard post={big} />
      </div>

      <div className="md:col-span-1">
        <SmallPostCard post={rightTop} />
      </div>

      <div className="md:col-span-1">
        <SmallPostCard post={rightBottom} />
      </div>

      <div className="md:col-span-3">
        <WideInterviewCard post={wide} />
      </div>
    </div>
  );
}

import { BLOG_LATEST } from "@/app/(user)/(not-register)/public/data/blogs.data";
import ListPostRow from "./post-cards/list-post-row";

export default function LatestDiscoveriesList() {
  return (
    <div className="space-y-6">
      {BLOG_LATEST.map((post) => (
        <ListPostRow key={post.id} post={post} />
      ))}
    </div>
  );
}
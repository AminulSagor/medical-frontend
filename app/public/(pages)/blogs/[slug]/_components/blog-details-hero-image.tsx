import { BlogDetailsApi } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "../../_components/fallback-network-image";

export default function BlogDetailsHeroImage({
  blog,
}: {
  blog: BlogDetailsApi;
}) {
  if (!blog.coverImageUrl) return null;

  return (
    <div className="overflow-hidden rounded-[22px] border border-light-slate/10 bg-white shadow-sm">
      <div className="relative h-[260px] w-full md:h-[340px]">
        <FallbackNetworkImage
          src={blog.coverImageUrl}
          alt={blog.title}
          priority
          className="object-cover"
          iconSize={36}
        />
      </div>
    </div>
  );
}

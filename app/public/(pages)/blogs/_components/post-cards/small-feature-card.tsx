import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";

export default function SmallPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="h-full overflow-hidden rounded-[22px] border border-light-slate/10 bg-white p-0">
      <Link href={post.href} className="flex h-full flex-col">
        <div className="relative h-[140px] w-full overflow-hidden rounded-t-[22px]">
          <BlogSafeImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1E293B] shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-white px-5 pb-4 pt-4">
          <h3 className="line-clamp-1 font-serif text-[16px] font-bold leading-[1.25] text-black">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="truncate text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </p>
            <span className="shrink-0 text-xs font-semibold text-primary">
              Read <span className="ml-1">→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

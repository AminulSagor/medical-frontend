import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";

export default function ListPostRow({ post }: { post: BlogPost }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-light-slate/10 bg-white">
      <Link href={post.href} className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="relative h-[220px] w-full overflow-hidden md:h-full md:min-h-[220px] md:w-[240px]">
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

        <div className="flex flex-col bg-white px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-extrabold tracking-[0.18em] text-primary">
              {post.category.toUpperCase()}
            </span>

            <span className="text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 font-serif text-[20px] font-bold leading-[1.2] text-black md:text-[24px]">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {post.author?.avatarSrc ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-light-slate/15">
                <BlogSafeImage
                  src={post.author.avatarSrc}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-light-slate/10" />
            )}

            <span className="font-semibold text-light-slate">
              {post.author?.name ?? "—"}
            </span>

            {post.readTimeLabel ? (
              <span className="text-xs font-medium text-light-slate/55">
                • {post.readTimeLabel}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}

import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";

export default function BigFeatureCard({ post }: { post: BlogPost }) {
  return (
    <div className="h-full overflow-hidden rounded-[22px] p-0  border border-light-slate/10">
      <Link href={post.href} className="flex h-full flex-col">
        <div className="relative h-[220px] w-full overflow-hidden rounded-t-[26px] sm:h-[240px] xl:h-[250px]">
          <BlogSafeImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1E293B] shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-white px-6 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <h3 className="line-clamp font-serif text-[24px] font-bold leading-[1.08] text-black sm:text-[26px] xl:text-[28px]">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-5 text-[15px] leading-7 text-light-slate/70">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-5">
            <div className="h-px w-full bg-light-slate/10" />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {post.author?.avatarSrc ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-light-slate/15">
                    <BlogSafeImage
                      src={post.author.avatarSrc}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-light-slate/10" />
                )}

                <p className="truncate text-sm font-semibold text-light-slate">
                  {post.author?.name ?? ""}
                </p>
              </div>

              {post.readTimeLabel ? (
                <span className="shrink-0 rounded-full bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                  {post.readTimeLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

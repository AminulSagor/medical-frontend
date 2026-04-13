import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";

export default function ListPostRow({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden rounded-[22px] p-0" shape="soft">
      <Link href={post.href} className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="relative h-[200px] w-full overflow-hidden rounded-l-[22px] md:h-[190px] md:w-[240px]">
          <BlogSafeImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="bg-white px-7 py-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-extrabold tracking-[0.22em] text-primary">
              {post.category.toUpperCase()}
            </span>

            <span className="text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </span>
          </div>

          <h3 className="mt-2 font-serif text-[22px] font-bold leading-[1.2] text-black md:text-[24px]">
            {post.title}
          </h3>

          <p className="mt-3 text-[14px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center gap-3 text-sm">
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
    </Card>
  );
}
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/blogs/blog-type";

export default function ListPostRow({ post }: { post: BlogPost }) {
  return (
    <Card className="p-0 overflow-hidden rounded-[22px]" shape="soft">
      <Link
        href={post.href}
        className="grid gap-0 md:grid-cols-[240px_1fr]"
      >
        {/* left image */}
        <div className="relative h-[200px] w-full overflow-hidden md:h-[190px] md:w-[240px] rounded-l-[22px]">
          <Image
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover"
            style={{ objectPosition: "50% 20%" }}
          />
        </div>

        {/* right content */}
        <div className="bg-white px-7 py-7">
          {/* top row: category + date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-extrabold tracking-[0.22em] text-primary">
              {post.category.toUpperCase()}
            </span>

            <span className="text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </span>
          </div>

          {/* title */}
          <h3 className="mt-2 font-serif text-[22px] leading-[1.2] font-bold text-black md:text-[24px]">
            {post.title}
          </h3>

          {/* excerpt */}
          <p className="mt-3 text-[14px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          {/* footer */}
          <div className="mt-5 flex items-center gap-3 text-sm">
            {post.author?.avatarSrc ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-light-slate/15">
                <Image
                  src={post.author.avatarSrc}
                  alt={post.author.name}
                  fill
                  sizes="32px"
                  className="object-cover"
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
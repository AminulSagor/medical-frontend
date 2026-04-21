import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";

export default function WideInterviewCard({ post }: { post: BlogPost }) {
  return (
    <div className="h-full overflow-hidden rounded-[22px] p-0 border border-light-slate/10">
      <Link
        href={post.href}
        className="grid h-full md:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="relative h-[260px] w-full md:h-full md:min-h-[280px]">
          <BlogSafeImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="h-full w-full object-cover object-[85%_20%]"
          />
        </div>

        <div className="flex h-full flex-col bg-white px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
          <span className="inline-flex w-fit items-center rounded-full bg-[#FFE7CC] px-4 py-1.5 text-[12px] font-semibold text-[#B45309]">
            {post.category}
          </span>

          <h3 className="mt-5 line-clamp-3 font-serif text-[24px] font-bold leading-[1.12] text-black sm:text-[26px] md:text-[28px]">
            {post.title}
          </h3>

          <p className="mt-4 line-clamp-4 text-[14px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 text-sm font-semibold text-primary">
            Read Interview <span className="ml-1">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

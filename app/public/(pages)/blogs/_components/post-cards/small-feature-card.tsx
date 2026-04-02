import Image from "next/image";
import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";

export default function SmallPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="p-0 overflow-hidden rounded-[22px]" shape="soft">
      <Link href={post.href} className="block">
        <div className="relative h-[170px] w-full overflow-hidden rounded-t-[22px]">
          <Image
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-cover"
            style={{ objectPosition: "75% 20%" }}
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold text-[#1E293B] shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="bg-white px-6 pt-6 pb-5">
          <h3 className="font-serif text-[18px] leading-snug font-bold text-black">
            {post.title}
          </h3>

          <p className="mt-3 text-[13px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </p>
            <span className="text-xs font-semibold text-primary">
              Read <span className="ml-1">→</span>
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

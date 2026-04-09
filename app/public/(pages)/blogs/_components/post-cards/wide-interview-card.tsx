import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "../fallback-network-image";

export default function WideInterviewCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden rounded-[26px] p-0" shape="soft">
      <Link href={post.href} className="grid md:grid-cols-[1.05fr_1fr]">
        <div className="relative h-[260px] w-full md:h-full">
          <FallbackNetworkImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="object-cover object-[85%_20%]"
          />
        </div>

        <div className="bg-white px-8 py-8 md:px-10 md:py-10">
          <span className="inline-flex items-center rounded-full bg-[#FFE7CC] px-4 py-1.5 text-[12px] font-semibold text-[#B45309]">
            {post.category}
          </span>

          <h3 className="mt-6 font-serif text-[28px] leading-[1.15] font-bold text-black">
            {post.title}
          </h3>

          <p className="mt-5 text-[14px] leading-relaxed text-light-slate/65">
            {post.excerpt}
          </p>

          <div className="mt-7 text-sm font-semibold text-primary">
            Read Interview <span className="ml-1">→</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

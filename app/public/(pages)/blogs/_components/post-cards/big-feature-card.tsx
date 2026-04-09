import Link from "next/link";
import Card from "@/components/cards/card";
import { BlogPost } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "../fallback-network-image";

export default function BigFeatureCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden rounded-[26px] p-0" shape="soft">
      <Link href={post.href} className="block">
        <div className="relative h-[280px] w-full overflow-hidden rounded-t-[26px]">
          <FallbackNetworkImage
            src={post.coverImageSrc}
            alt={post.coverImageAlt}
            className="object-cover"
            style={{ objectPosition: "75% 20%" }}
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold text-[#1E293B] shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="bg-white px-7 pb-6 pt-7">
          <h3 className="font-serif text-[34px] leading-[1.08] font-bold text-black">
            {post.title}
          </h3>

          <p className="mt-4 text-[15px] leading-relaxed text-light-slate/70">
            {post.excerpt}
          </p>

          <div className="mt-6 h-px w-full bg-light-slate/10" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.author?.avatarSrc ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-light-slate/15">
                  <FallbackNetworkImage
                    src={post.author.avatarSrc}
                    alt={post.author.name}
                    className="object-cover"
                    iconSize={14}
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-light-slate/10" />
              )}

              <p className="text-sm font-semibold text-light-slate">
                {post.author?.name ?? ""}
              </p>
            </div>

            {post.readTimeLabel ? (
              <span className="rounded-full bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                {post.readTimeLabel}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}

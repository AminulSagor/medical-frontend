import Image from "next/image";
import Link from "next/link";
import Button from "@/components/buttons/button";
import { BLOG_FEATURED } from "@/app/public/data/blogs.data";

export default function BlogsHero() {
  const post = BLOG_FEATURED;

  return (
    <section className="w-full pt-6 mt-20">
      <div className="padding">
        <div className="relative overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(16,24,25,0.10)]">
          <div className="relative h-[1216px] w-full p-4 md:h-[650px] md:p-8">
            <div className="relative h-full w-full overflow-hidden rounded-[22px]">
              <Image
                src={post.coverImageSrc}
                alt={post.coverImageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />

              {/* cinematic overlay like reference */}
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute inset-0 bg-linear-to-r from-black/30 via-black/10 to-transparent" />

              {/* ✅ inner card: right + vertically centered (like screenshot-2) */}
              <div className="absolute right-6 top-1/2 w-full max-w-[540px] -translate-y-1/2 md:right-10">
                <div className="rounded-[26px] border border-light-slate/10 bg-white px-8 py-10 shadow-[0_22px_60px_rgba(16,24,25,0.16)] md:px-12 md:py-12">
                  <div className="flex items-center gap-4">
                    {post.badge?.label ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.22em] text-primary">
                        {post.badge.label}
                      </span>
                    ) : null}

                    <span className="text-[11px] font-extrabold tracking-[0.22em] text-light-slate/60">
                      {post.dateLabel}
                    </span>
                  </div>

                  {/* ✅ serif title */}
                  <h1 className="mt-6 whitespace-pre-line font-serif text-[44px] leading-[1.02] font-bold text-black">
                    {post.title}
                  </h1>

                  <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-light-slate/70">
                    {post.excerpt}
                  </p>

                  {/* ✅ buttons spacing like ref */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={post.href}>
                      <Button size="base" variant="primary" shape="pill">
                        Read Article
                      </Button>
                    </Link>

                    <Link href={post.href}>
                      <Button
                        size="base"
                        variant="secondary"
                        shape="pill"
                        className="border-light-slate/20"
                      >
                        Watch Video
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* subtle inner ring like reference */}
              <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-black/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

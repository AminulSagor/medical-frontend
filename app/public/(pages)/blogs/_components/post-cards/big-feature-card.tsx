import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function BigFeatureCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative h-full overflow-hidden rounded-[22px] border border-light-slate/10 bg-white transition-shadow duration-300 hover:shadow-xl"
    >
      <Link href={post.href} className="flex h-full flex-col">
        {/* Image Container with Scale on Card Hover */}
        <div className="relative h-[220px] w-full overflow-hidden rounded-t-[26px] sm:h-[240px] xl:h-[250px]">
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <BlogSafeImage
              src={post.coverImageSrc}
              alt={post.coverImageAlt}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Gradient Overlay on Card Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.15 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1E293B] shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-white px-6 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Title with Arrow Icon - changes to primary on card hover */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp font-serif text-[24px] font-bold leading-[1.08] text-black transition-colors duration-300 group-hover:text-primary sm:text-[26px] xl:text-[28px]">
              {post.title}
            </h3>

            <motion.div
              initial={{ opacity: 0, x: -5, rotate: -45 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ x: 3, y: -3, rotate: 45 }}
              className="shrink-0 text-light-slate transition-colors duration-300 group-hover:text-primary"
            >
              <ArrowUpRight size={24} strokeWidth={1.8} />
            </motion.div>
          </div>

          <p className="mt-3 line-clamp-5 text-[15px] leading-7 text-light-slate/70 transition-colors duration-300 group-hover:text-light-slate">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-5">
            <div className="h-px w-full bg-light-slate/10" />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {post.author?.avatarSrc ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-light-slate/15"
                  >
                    <BlogSafeImage
                      src={post.author.avatarSrc}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-light-slate/10" />
                )}

                <p className="truncate text-sm font-semibold text-light-slate">
                  {post.author?.name ?? ""}
                </p>
              </div>

              {post.readTimeLabel ? (
                <span className="shrink-0 rounded-full bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                  {post.readTimeLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

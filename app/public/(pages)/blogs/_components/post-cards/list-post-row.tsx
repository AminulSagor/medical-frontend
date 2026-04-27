import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function ListPostRow({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group overflow-hidden rounded-[22px] border border-light-slate/10 bg-white transition-shadow duration-300 hover:shadow-lg"
    >
      <Link href={post.href} className="grid gap-0 md:grid-cols-[240px_1fr]">
        {/* Image Container with Scale on Hover */}
        <div className="relative h-[220px] w-full overflow-hidden md:h-full md:min-h-[220px] md:w-[240px]">
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

          {/* Dark Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />

          <div className="absolute left-3 top-3">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1E293B] shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white"
            >
              {post.category}
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col bg-white px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category - changes to primary with stronger emphasis on hover */}
            <motion.span
              whileHover={{ x: 2 }}
              className="text-[11px] font-extrabold tracking-[0.18em] text-primary transition-all duration-300 group-hover:text-primary/80"
            >
              {post.category.toUpperCase()}
            </motion.span>

            <span className="text-xs font-medium text-light-slate/60 transition-colors duration-300 group-hover:text-light-slate">
              {post.dateLabel}
            </span>
          </div>

          {/* Title - changes to primary on hover */}
          <h3 className="mt-3 line-clamp-2 font-serif text-[20px] font-bold leading-[1.2] text-black transition-colors duration-300 group-hover:text-primary md:text-[24px]">
            {post.title}
          </h3>

          {/* Excerpt - subtle opacity change */}
          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-light-slate/65 transition-colors duration-300 group-hover:text-light-slate">
            {post.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {post.author?.avatarSrc ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-8 w-8 overflow-hidden rounded-full border border-light-slate/15"
              >
                <BlogSafeImage
                  src={post.author.avatarSrc}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-light-slate/10" />
            )}

            <span className="font-semibold text-light-slate transition-colors duration-300 group-hover:text-light-slate">
              {post.author?.name ?? "—"}
            </span>

            {post.readTimeLabel ? (
              <span className="text-xs font-medium text-light-slate/55 transition-colors duration-300 group-hover:text-light-slate/70">
                • {post.readTimeLabel}
              </span>
            ) : null}

            {/* Animated arrow indicator for mobile/visual cue */}
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              whileHover={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-auto hidden items-center gap-1 text-primary sm:flex"
            >
              <span className="text-xs font-semibold">Read</span>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

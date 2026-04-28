import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function SmallPostCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group h-full overflow-hidden rounded-[22px] border border-light-slate/10 bg-white transition-shadow duration-300 hover:shadow-lg"
    >
      <Link href={post.href} className="flex h-full flex-col">
        {/* Image Container with Scale on Hover */}
        <div className="relative h-[140px] w-full overflow-hidden rounded-t-[22px]">
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
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1E293B] shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-white px-5 pb-4 pt-4">
          {/* Title changes to primary on hover */}
          <h3 className="line-clamp-1 font-serif text-[16px] font-bold leading-[1.25] text-black transition-colors duration-300 group-hover:text-primary">
            {post.title}
          </h3>

          {/* Excerpt with subtle opacity change on hover */}
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-light-slate/65 transition-colors duration-300 group-hover:text-light-slate">
            {post.excerpt}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="truncate text-xs font-medium text-light-slate/60">
              {post.dateLabel}
            </p>

            {/* Read link with animated arrow */}
            <motion.span
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 shrink-0 text-xs font-semibold text-primary"
            >
              Read
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

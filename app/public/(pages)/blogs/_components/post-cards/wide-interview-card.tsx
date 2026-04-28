import Link from "next/link";
import { BlogPost } from "@/types/public/blogs/blog-type";
import BlogSafeImage from "./blog-safe-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function WideInterviewCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group h-full overflow-hidden rounded-[22px] border border-light-slate/10 bg-white transition-shadow duration-300 hover:shadow-xl"
    >
      <Link
        href={post.href}
        className="grid h-full md:grid-cols-[0.95fr_1.05fr]"
      >
        {/* Image Container with Scale on Hover */}
        <div className="relative h-[260px] w-full overflow-hidden md:h-full md:min-h-[280px]">
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <BlogSafeImage
              src={post.coverImageSrc}
              alt={post.coverImageAlt}
              className="h-full w-full object-cover object-[85%_20%]"
            />
          </motion.div>

          {/* Dark Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.15 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />
        </div>

        <div className="flex h-full flex-col bg-white px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
          {/* Category Badge - changes on hover */}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex w-fit items-center rounded-full bg-[#FFE7CC] px-4 py-1.5 text-[12px] font-semibold text-[#B45309] transition-all duration-300 group-hover:bg-primary group-hover:text-white"
          >
            {post.category}
          </motion.span>

          {/* Title - changes to primary on hover */}
          <h3 className="mt-5 line-clamp-3 font-serif text-[24px] font-bold leading-[1.12] text-black transition-colors duration-300 group-hover:text-primary sm:text-[26px] md:text-[28px]">
            {post.title}
          </h3>

          {/* Excerpt - subtle opacity change */}
          <p className="mt-4 line-clamp-4 text-[14px] leading-relaxed text-light-slate/65 transition-colors duration-300 group-hover:text-light-slate">
            {post.excerpt}
          </p>

          {/* Read Interview link with animated arrow */}
          <motion.div
            whileHover={{ x: 6 }}
            transition={{ duration: 0.2 }}
            className="mt-auto pt-6 flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Read Interview
            <ArrowUpRight
              size={16}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

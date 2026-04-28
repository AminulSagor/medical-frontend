"use client";

import Link from "next/link";
import Button from "@/components/buttons/button";
import type { BlogPost } from "@/types/public/blogs/blog-type";
import FallbackNetworkImage from "./fallback-network-image";
import { motion } from "motion/react";

type BlogsHeroProps = {
  post: BlogPost | null;
};

export default function BlogsHero({ post }: BlogsHeroProps) {
  if (!post) {
    return null;
  }

  return (
    <section className="mt-20 w-full pt-6">
      <div className="padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(16,24,25,0.10)]"
        >
          <div className="relative min-h-[560px] w-full sm:min-h-[620px] lg:min-h-[600px]">
            {/* Image with subtle scale animation */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <FallbackNetworkImage
                src={post.coverImageSrc}
                alt={post.coverImageAlt}
                priority
                className="object-cover"
                fallbackClassName="bg-light-slate/10 text-light-slate/45"
                iconSize={42}
              />
            </motion.div>

            {/* Overlays - fade in sequentially */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute inset-0 bg-black/20"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute inset-0 bg-linear-to-r from-black/45 via-black/15 to-black/10 lg:from-black/25 lg:via-black/10 lg:to-transparent"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
            />

            <div className="relative z-10 flex min-h-[560px] items-end p-4 sm:min-h-[620px] sm:p-6 lg:min-h-[600px] lg:items-center lg:justify-end lg:p-8">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-[520px]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="rounded-[24px] border border-white/20 bg-white/95 px-5 py-6 shadow-[0_22px_60px_rgba(16,24,25,0.16)] backdrop-blur-sm sm:px-7 sm:py-8 lg:px-8 lg:py-8"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-wrap items-center gap-3 sm:gap-4"
                  >
                    {post.badge?.label ? (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.65,
                          ease: "backOut",
                        }}
                        className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.22em] text-primary"
                      >
                        {post.badge.label}
                      </motion.span>
                    ) : null}

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                      className="text-[11px] font-extrabold tracking-[0.22em] text-light-slate/60"
                    >
                      {post.dateLabel}
                    </motion.span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.75 }}
                    className="mt-5 whitespace-pre-line font-serif text-[24px] leading-[1.08] font-bold text-black sm:text-[30px] md:text-[34px] lg:text-[38px]"
                  >
                    {post.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                    className="mt-4 max-w-[50ch] text-sm leading-7 text-light-slate/70"
                  >
                    {post.excerpt}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.95 }}
                    className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
                  >
                    <Link href={post.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button size="base" variant="primary" shape="pill">
                          Read Article
                        </Button>
                      </motion.div>
                    </Link>

                    <Link href={post.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          size="base"
                          variant="secondary"
                          shape="pill"
                          className="border-light-slate/20 bg-white"
                        >
                          Watch Video
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

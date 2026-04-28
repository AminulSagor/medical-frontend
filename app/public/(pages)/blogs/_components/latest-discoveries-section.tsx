"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LatestDiscoveriesGrid from "./latest-discoveries-grid";
import LatestDiscoveriesList from "./latest-discoveries-list";
import BlogsRightSideCard from "./right-side-cards/blogs-card";
import { getPublicBlogs } from "@/service/public/blogs/blogs.service";
import { mapApiBlogToUiBlog } from "../_utils/blogs.mapper";
import type { BlogPost, TrendingItem } from "@/types/public/blogs/blog-type";

type ViewMode = "grid" | "list";

type LatestDiscoveriesSectionProps = {
  trendingItems: TrendingItem[];
};

export default function LatestDiscoveriesSection({
  trendingItems,
}: LatestDiscoveriesSectionProps) {
  const [view, setView] = useState<ViewMode>("grid");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const data = await getPublicBlogs({
          page,
          limit: 10,
          sortBy: "latest",
        });
        const mappedPosts = data.items.map(mapApiBlogToUiBlog);

        if (page === 1) {
          setPosts(mappedPosts);
        } else {
          setPosts((prev) => [...prev, ...mappedPosts]);
        }

        setHasMore(data.meta.page < data.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  // Animated button icons with spring effect
  const buttonVariants = {
    tap: { scale: 0.92 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <section className="w-full pt-10">
      <div className="padding">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-[28px] leading-[32px] font-bold text-black md:text-[32px] md:leading-[36px]"
              >
                Latest Discoveries
              </motion.h2>

              <div className="flex items-center gap-2 rounded-full border border-light-slate/10 bg-white p-1 shadow-sm">
                <motion.button
                  type="button"
                  onClick={() => setView("grid")}
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full transition-all duration-200",
                    view === "grid"
                      ? "bg-light-slate/5 text-black"
                      : "text-light-slate/60 hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3 3h5v5H3V3Zm7 0h5v5h-5V3ZM3 10h5v5H3v-5Zm7 0h5v5h-5v-5Z"
                      fill="currentColor"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setView("list")}
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full transition-all duration-200",
                    view === "list"
                      ? "bg-light-slate/5 text-black"
                      : "text-light-slate/60 hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="List view"
                  title="List view"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M4 5h11v2H4V5Zm0 6h11v2H4v-2Z"
                      fill="currentColor"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            <div className="mt-6">
              {loading && page === 1 ? (
                <div className="py-12 text-center text-slate-500">
                  Loading articles...
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {view === "grid" ? (
                      <LatestDiscoveriesGrid posts={posts} />
                    ) : (
                      <LatestDiscoveriesList posts={posts} />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="mt-10 flex justify-center">
              {hasMore ? (
                <motion.button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full border border-light-slate/15 bg-white px-6 py-2.5 text-sm font-semibold text-light-slate transition hover:bg-light-slate/5 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </motion.span>
                  ) : (
                    "Load More Articles"
                  )}
                </motion.button>
              ) : null}
            </div>
          </div>

          <div className="xl:pt-2">
            <div className="xl:sticky xl:top-28">
              <BlogsRightSideCard trendingItems={trendingItems} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

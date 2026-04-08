"use client";

import { useState, useEffect } from "react";
import BlogsRightSideCard from "./right-side-cards/blogs-card";
import LatestDiscoveriesList from "./latest-discoveries-list";
import LatestDiscoveriesGrid from "@/app/public/(pages)/blogs/_components/latest-discoveries-grid";
import { getPublicBlogs } from "@/service/public/blogs/blogs.service";
import type { BlogPost, BlogPostApi } from "@/types/public/blogs/blog-type";

type ViewMode = "grid" | "list";

// Helper to map API type to UI type
const mapApiBlogToUiBlog = (apiPost: BlogPostApi): BlogPost => {
  return {
    id: apiPost.id,
    category: apiPost.categories.length > 0 ? apiPost.categories[0].name : "Uncategorized",
    title: apiPost.title,
    excerpt: apiPost.description,
    dateLabel: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(apiPost.publishedAt)),
    readTimeLabel: `${apiPost.readTimeMinutes} min read`,
    coverImageSrc: apiPost.coverImageUrl,
    coverImageAlt: apiPost.title,
    author: apiPost.authors.length > 0 ? {
      name: apiPost.authors[0].fullLegalName,
      avatarSrc: apiPost.authors[0].profilePhotoUrl
    } : undefined,
    href: `/public/blogs/${apiPost.id}`,
    badge: apiPost.isFeatured ? { label: "EDITOR'S PICK" } : undefined,
  };
};


export default function LatestDiscoveriesSection() {
  const [view, setView] = useState<ViewMode>("grid");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getPublicBlogs({ page, limit: 10, sortBy: "latest" });
        const mappedPosts = data.items.map(mapApiBlogToUiBlog);
        if (page === 1) {
          setPosts(mappedPosts);
        } else {
          setPosts(prev => [...prev, ...mappedPosts]);
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

  return (
    <section className="w-full pt-10">
      <div className="padding">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {/* header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[30px] leading-[34px] font-bold text-black">
                Latest Discoveries
              </h2>

              {/* view toggle (list will be used later) */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-lg border transition",
                    view === "grid"
                      ? "border-light-slate/15 bg-white shadow-sm"
                      : "border-transparent bg-transparent hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  {/* grid icon */}
                  <span className="text-light-slate/70">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 3h5v5H3V3Zm7 0h5v5h-5V3ZM3 10h5v5H3v-5Zm7 0h5v5h-5v-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-lg border transition",
                    view === "list"
                      ? "border-light-slate/15 bg-white shadow-sm"
                      : "border-transparent bg-transparent hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="List view"
                  title="List view"
                >
                  {/* list icon */}
                  <span className="text-light-slate/70">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M4 5h11v2H4V5Zm0 6h11v2H4v-2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              {loading && page === 1 ? (
                <div className="py-12 text-center text-slate-500">Loading articles...</div>
              ) : view === "grid" ? (
                <LatestDiscoveriesGrid posts={posts} />
              ) : (
                <LatestDiscoveriesList posts={posts} />
              )}
            </div>

            <div className="mt-10 flex justify-center">
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="rounded-full border border-light-slate/15 bg-white px-6 py-2.5 text-sm font-semibold text-light-slate hover:bg-light-slate/5 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More Articles"}
                </button>
              )}
            </div>
          </div>

          <div className="lg:pt-11">
            <BlogsRightSideCard />
          </div>
        </div>
      </div>
    </section>
  );
}

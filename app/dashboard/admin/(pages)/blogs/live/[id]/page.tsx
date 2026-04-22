"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Monitor,
  Smartphone,
  Tag,
} from "lucide-react";

import { getAdminBlogLiveById } from "@/service/admin/blogs/blog-live.service";
import type { BlogLivePost } from "@/types/admin/blogs/blog-live.types";
import AdminBlogLiveShell from "@/app/dashboard/admin/(pages)/blogs/live/[id]/admin-blog-live-shell";

type PreviewMode = "mobile" | "desktop";

function formatDate(value?: string | null) {
  if (!value) return "Not published yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not published yet";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getHeroImage(blogPost: BlogLivePost) {
  return (
    blogPost.coverImages?.find((i) => i.imageType === "hero") ||
    blogPost.coverImages?.[0] ||
    null
  );
}

function getThumbnailImage(blogPost: BlogLivePost) {
  return blogPost.coverImages?.find((i) => i.imageType === "thumbnail") || null;
}

function getInlineImages(blogPost: BlogLivePost) {
  return (
    blogPost.coverImages?.filter((i) => i.imageType === "article_inline") || []
  );
}

function getPreviewWidthClass(mode: PreviewMode) {
  return mode === "mobile" ? "max-w-[390px]" : "max-w-[1080px]";
}

function DeviceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${
        active
          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminBlogLivePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [blogPost, setBlogPost] = useState<BlogLivePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");

  useEffect(() => {
    const blogId = params?.id;

    if (!blogId || typeof blogId !== "string") {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const loadBlogPost = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await getAdminBlogLiveById(blogId);
        setBlogPost(response);
      } catch (error) {
        console.error("Failed to load blog:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadBlogPost();
  }, [params?.id]);

  const heroImage = useMemo(
    () => (blogPost ? getHeroImage(blogPost) : null),
    [blogPost],
  );

  const thumbnailImage = useMemo(
    () => (blogPost ? getThumbnailImage(blogPost) : null),
    [blogPost],
  );

  const inlineImages = useMemo(
    () => (blogPost ? getInlineImages(blogPost) : []),
    [blogPost],
  );

  if (isLoading) return <AdminBlogLiveShell />;
  if (hasError || !blogPost) return null;

  const authorName =
    blogPost.authorName ||
    blogPost.authors?.[0]?.fullLegalName ||
    "Unknown Author";

  const categoryName = blogPost.categories?.[0]?.name || "Uncategorized";

  return (
    <div className="h-screen overflow-hidden bg-[#0b1220]">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/dashboard/admin/blogs"
            className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex gap-2">
            <DeviceButton
              active={previewMode === "mobile"}
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone size={15} />
            </DeviceButton>

            <DeviceButton
              active={previewMode === "desktop"}
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor size={15} />
            </DeviceButton>
          </div>
        </div>
      </div>

      {/* SCROLL AREA */}
      <div className="h-full overflow-y-auto px-4 py-8">
        <div
          className={`mx-auto transition-all ${getPreviewWidthClass(
            previewMode,
          )}`}
        >
          <article className="overflow-hidden rounded-[28px] bg-white shadow-xl">
            {/* HERO */}
            {heroImage && (
              <div className="aspect-[16/7]">
                <img
                  src={heroImage.imageUrl}
                  alt="hero"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="px-5 py-6 md:px-8">
              {/* META */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 rounded-full border px-3 py-1">
                  <Tag size={11} />
                  {categoryName}
                </span>

                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  {formatDate(
                    blogPost.publishedAt || blogPost.scheduledPublishDate,
                  )}
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 size={12} />
                  {blogPost.readTimeMinutes} min
                </span>
              </div>

              {/* TITLE */}
              <h1 className="mt-4 text-xl font-semibold md:text-3xl text-black">
                {blogPost.title}
              </h1>

              {/* AUTHOR */}
              <p className="mt-2 text-sm text-slate-600">
                By <span className="font-semibold">{authorName}</span>
              </p>

              {/* EXCERPT */}
              {blogPost.excerpt && (
                <p className="mt-4 border-l-2 pl-4 text-sm text-black">
                  {blogPost.excerpt}
                </p>
              )}

              {/* THUMBNAIL (FIXED HEIGHT) */}
              {thumbnailImage && (
                <div className="mt-6 overflow-hidden rounded-xl">
                  <div className="h-[220px] w-full">
                    <img
                      src={thumbnailImage.imageUrl}
                      alt="thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* CONTENT */}
              <div
                className="prose mt-6 max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* INLINE IMAGES */}
              {inlineImages.length > 0 && (
                <div className="mt-8 text-black">
                  <h3 className="mb-4 text-lg font-semibold">Related Images</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {inlineImages.map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-xl">
                        <div className="h-[200px] w-full">
                          <img
                            src={img.imageUrl}
                            alt={`inline-${i}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAGS */}
              {blogPost.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 text-base">
                  {blogPost.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border px-3 py-1 text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

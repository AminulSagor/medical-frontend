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
  Tablet,
  Tag,
} from "lucide-react";

import { getAdminBlogLiveById } from "@/service/admin/blogs/blog-live.service";
import type { BlogLivePost } from "@/types/admin/blogs/blog-live.types";

type PreviewMode = "mobile" | "tablet" | "desktop";

function formatDate(value?: string | null) {
  if (!value) return "Not published yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not published yet";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getHeroImage(blogPost: BlogLivePost) {
  return (
    blogPost.coverImages?.find((image) => image.imageType === "hero") ||
    blogPost.coverImages?.[0] ||
    null
  );
}

function getThumbnailImage(blogPost: BlogLivePost) {
  return (
    blogPost.coverImages?.find((image) => image.imageType === "thumbnail") ||
    null
  );
}

function getPreviewWidthClass(mode: PreviewMode) {
  if (mode === "mobile") return "max-w-[390px]";
  if (mode === "tablet") return "max-w-[760px]";
  return "max-w-[1080px]";
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
        console.error("Failed to load blog live page:", error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1220]">
        <div className="border-b border-white/10 bg-[#0f172a]">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/dashboard/admin/blogs"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Manager
            </Link>

            <p className="hidden text-xs text-slate-300 md:block">
              Loading preview...
            </p>

            <div className="w-[110px]" />
          </div>
        </div>

        <div className="px-4 py-8">
          <div className="mx-auto max-w-[390px] animate-pulse rounded-[24px] bg-white shadow-2xl">
            <div className="h-48 rounded-t-[24px] bg-slate-100" />
            <div className="space-y-4 p-6">
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-8 w-2/3 rounded bg-slate-100" />
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !blogPost) {
    return (
      <div className="min-h-screen bg-[#0b1220]">
        <div className="border-b border-white/10 bg-[#0f172a]">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/dashboard/admin/blogs"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Manager
            </Link>

            <p className="hidden text-xs text-rose-300 md:block">
              Failed to load article
            </p>

            <div className="w-[110px]" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-[24px] border border-rose-300/20 bg-white p-6 shadow-2xl md:p-8">
            <h1 className="text-sm font-semibold text-slate-900">
              This page could not be loaded
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              The article may not exist or there was a problem fetching it.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => router.refresh()}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                Try Again
              </button>

              <Link
                href="/dashboard/admin/blogs"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const authorName =
    blogPost.authorName ||
    blogPost.authors?.[0]?.fullLegalName ||
    "Unknown Author";
  const categoryName = blogPost.categories?.[0]?.name || "Uncategorized";

  return (
    <div className="min-h-screen bg-[#0b1220]">
      <div className="border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/dashboard/admin/blogs"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Manager
          </Link>

          <div className="flex items-center gap-2">
            <DeviceButton
              active={previewMode === "mobile"}
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone size={15} />
            </DeviceButton>

            <DeviceButton
              active={previewMode === "tablet"}
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet size={15} />
            </DeviceButton>

            <DeviceButton
              active={previewMode === "desktop"}
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor size={15} />
            </DeviceButton>
          </div>

          <p className="hidden truncate text-xs font-medium text-slate-300 md:block">
            Previewing: {blogPost.title}
          </p>
        </div>
      </div>

      <div className="px-4 py-8 md:py-10">
        <div
          className={`mx-auto transition-all duration-300 ${getPreviewWidthClass(
            previewMode,
          )}`}
        >
          <article className="overflow-hidden rounded-[28px] border border-[#e8e4dc] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            {heroImage ? (
              <div className="aspect-[16/7] w-full overflow-hidden bg-slate-100">
                <img
                  src={heroImage.imageUrl}
                  alt={blogPost.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e7e2d8] bg-[#faf7f1] px-3 py-1 font-medium text-slate-700">
                  <Tag size={11} />
                  {categoryName}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  {formatDate(
                    blogPost.publishedAt || blogPost.scheduledPublishDate,
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={12} />
                  {blogPost.readTimeMinutes} min read
                </span>
              </div>

              <h1 className="mt-4 text-xl font-semibold leading-tight text-slate-900 md:text-[28px]">
                {blogPost.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                <span>
                  By{" "}
                  <span className="font-semibold text-slate-800">
                    {authorName}
                  </span>
                </span>

                {blogPost.isFeatured ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                    Featured
                  </span>
                ) : null}
              </div>

              {blogPost.excerpt ? (
                <p className="mt-5 border-l-2 border-[#e7dfcf] pl-4 text-sm leading-7 text-slate-700">
                  {blogPost.excerpt}
                </p>
              ) : null}

              {thumbnailImage ? (
                <div className="mt-7 overflow-hidden rounded-2xl border border-[#ebe6dd] bg-slate-100">
                  <div className="aspect-[16/8] w-full">
                    <img
                      src={thumbnailImage.imageUrl}
                      alt={`${blogPost.title} secondary`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-8 border-t border-[#ece7de] pt-7">
                <div
                  className="
                    prose prose-sm max-w-none
                    !text-slate-800
                    prose-p:!text-slate-700
                    prose-p:text-sm
                    prose-p:leading-7
                    prose-headings:!text-slate-900
                    prose-strong:!text-slate-900
                    prose-li:!text-slate-700
                    prose-a:!text-[var(--primary)]
                    prose-blockquote:!text-slate-700
                    prose-blockquote:border-l-[#d8cfbf]
                  "
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
              </div>

              {blogPost.tags?.length ? (
                <div className="mt-8 flex flex-wrap gap-2 border-t border-[#ece7de] pt-6">
                  {blogPost.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-[#e7e2d8] bg-[#faf7f1] px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

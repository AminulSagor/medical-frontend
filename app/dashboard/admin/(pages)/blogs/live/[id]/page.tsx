"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Tag } from "lucide-react";

import { getAdminBlogLiveById } from "@/service/admin/blogs/blog-live.service";
import type { BlogLivePost } from "@/types/admin/blogs/blog-live.types";

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

export default function AdminBlogLivePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [blogPost, setBlogPost] = useState<BlogLivePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4">
            <Link
              href="/dashboard/admin/blogs"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Manager
            </Link>

            <p className="truncate text-center text-sm font-semibold text-slate-700">
              Loading article...
            </p>

            <div />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-56 rounded-2xl bg-slate-100" />
              <div className="h-4 w-40 rounded bg-slate-100" />
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
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4">
            <Link
              href="/dashboard/admin/blogs"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Manager
            </Link>

            <p className="truncate text-center text-sm font-semibold text-rose-600">
              Failed to load article
            </p>

            <div />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">
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

  const authorName = blogPost.authors?.[0]?.fullLegalName || "Unknown Author";
  const categoryName = blogPost.categories?.[0]?.name || "Uncategorized";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="relative mx-auto flex items-center justify-between px-4 py-4">
          {/* Left */}
          <Link
            href="/dashboard/admin/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Manager
          </Link>

          {/* Center - Responsive truncation */}
          <p className="absolute left-1/2 hidden -translate-x-1/2 truncate font-semibold text-slate-700 md:block lg:max-w-md xl:max-w-lg text-lg">
            Previewing: {blogPost.title}
          </p>

          {/* Right - Empty div for flex spacing */}
          <div className="invisible w-[110px] md:visible">
            {/* This empty div maintains the layout and balances the left button */}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {blogPost.coverImageUrl ? (
            <div className="aspect-[16/8] w-full overflow-hidden bg-slate-100">
              <img
                src={blogPost.coverImageUrl}
                alt={blogPost.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                <Tag size={12} />
                {categoryName}
              </span>

              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <CalendarDays size={14} />
                {formatDate(blogPost.publishedAt)}
              </span>

              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Clock3 size={14} />
                {blogPost.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl">
              {blogPost.title}
            </h1>

            <div className="mt-3 text-sm text-slate-600">
              By{" "}
              <span className="font-semibold text-slate-800">{authorName}</span>
            </div>

            {blogPost.excerpt ? (
              <p className="mt-5 text-sm leading-7 text-slate-700 md:text-base">
                {blogPost.excerpt}
              </p>
            ) : null}

            <div className="mt-8 border-t border-slate-200 pt-8">
              <div
                className="
      prose max-w-none

      !text-slate-800
      prose-p:!text-slate-700
      prose-headings:!text-slate-900
      prose-strong:!text-slate-900
      prose-li:!text-slate-700
      prose-a:!text-[var(--primary)]

      prose-p:leading-7
      md:prose-p:text-base
    "
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </div>

            {blogPost.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
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
  );
}

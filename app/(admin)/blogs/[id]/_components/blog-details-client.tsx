"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, Loader2, Star, UserRound } from "lucide-react";
import { getBlogById } from "@/service/admin/blogs/admin-blog.service";
import type { BlogPostResponse, BlogPublishingStatus } from "@/types/blogs/admin-blog.types";

type BlogDetailsClientProps = {
  blogId: string;
};

function formatDateTime(value: string | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }: { status: BlogPublishingStatus }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
        Published
      </span>
    );
  }

  if (status === "scheduled") {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--primary-50)] px-3 py-1 text-xs font-semibold text-[var(--primary-hover)] ring-1 ring-cyan-100">
        Scheduled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
      Draft
    </span>
  );
}

export default function BlogDetailsClient({ blogId }: BlogDetailsClientProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogById(blogId);
        if (mounted) setBlog(data);
      } catch {
        if (mounted) setError("Unable to load article details. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [blogId]);

  const publishedDate = useMemo(() => {
    if (!blog) return null;
    return blog.publishedAt ?? blog.scheduledPublishDate ?? blog.createdAt;
  }, [blog]);

  if (loading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm font-medium">Loading article details...</span>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
        <p className="text-sm font-semibold text-rose-700">{error ?? "Article not found."}</p>
        <button
          type="button"
          onClick={() => router.push("/blogs")}
          className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          Back to blogs
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/blogs")}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Back to all blogs
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={blog.publishingStatus} />
          {blog.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
              <Star size={12} />
              Featured
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">{blog.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{blog.excerpt || "No excerpt provided."}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {blog.readTimeMinutes} min read
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} />
            {formatDateTime(publishedDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={13} />
            {blog.authors.map((author) => author.fullLegalName).join(", ") || "Unknown author"}
          </span>
        </div>
      </div>

      {blog.coverImageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm md:h-80">
          <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            className="prose prose-slate max-w-none prose-headings:!text-black prose-p:!text-black prose-strong:!text-black prose-li:!text-black prose-blockquote:!text-black [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_h4]:!text-black [&_h5]:!text-black [&_h6]:!text-black [&_p]:!text-black [&_span]:!text-black [&_li]:!text-black [&_td]:!text-black [&_th]:!text-black [&_blockquote]:!text-black [&_a]:!text-[var(--primary)]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {blog.categories.length ? (
                blog.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                  >
                    {cat.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No categories</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {blog.tags.length ? (
                blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-xs font-semibold text-[var(--primary-hover)]"
                  >
                    #{tag.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No tags</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">SEO</h2>
            <p className="mt-2 text-xs font-semibold text-slate-700">
              {blog.seo?.metaTitle || "No SEO title"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {blog.seo?.metaDescription || "No SEO description"}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

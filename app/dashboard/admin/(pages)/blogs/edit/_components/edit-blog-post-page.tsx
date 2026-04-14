"use client";

import { ArrowLeft, CalendarDays, Clock3, Eye, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditBlogPost } from "../_utils/use-edit-blog-post";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}

export default function EditBlogPostPage({ blogId }: { blogId: string }) {
  const router = useRouter();

  const {
    loading,
    isSaving,
    error,
    successMessage,
    blog,
    authorOptions,
    categoryOptions,
    tagOptions,
    excerpt,
    setExcerpt,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
    authorIds,
    categoryIds,
    tagIds,
    publishingStatus,
    setPublishingStatus,
    handleAuthorChange,
    handleToggleCategory,
    handleToggleTag,
    handleSave,
  } = useEditBlogPost(blogId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4">
              <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="p-6 text-sm text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/blogs")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Manager
            </button>
          </div>
        </div>
        <div className="p-6 text-sm text-rose-500">Blog not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/admin/blogs")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back to Manager
              </button>

              <div className="h-6 w-px bg-slate-200" />

              <h1 className="text-sm font-semibold text-slate-700">
                Editing: {blog.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Updating..." : "Update Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left Column - Preview */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <p className="mb-4 text-xs font-medium text-slate-500">
              Post Preview
            </p>

            {blog.coverImageUrl ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <div className="h-[220px] w-full md:h-[340px]">
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Pill>{publishingStatus}</Pill>

              {blog.categories.map((category) => (
                <Pill key={category.id}>{category.name}</Pill>
              ))}
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-semibold leading-tight text-slate-900 md:text-3xl">
                {blog.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                {blog.authors[0]?.fullLegalName ? (
                  <span>By {blog.authors[0].fullLegalName}</span>
                ) : null}

                <span className="inline-flex items-center gap-1">
                  <Clock3 size={14} />
                  {blog.readTimeMinutes} min read
                </span>

                <span className="inline-flex items-center gap-1">
                  <Eye size={14} />
                  {blog.readCount ?? 0} views
                </span>

                {blog.createdAt ? (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
            </div>

            {excerpt ? (
              <p className="mt-5 text-sm leading-7 text-slate-700">{excerpt}</p>
            ) : null}

            {blog.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                  >
                    <Tag size={12} />
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="prose prose-sm mt-6 max-w-none text-slate-700 prose-p:leading-7 prose-headings:text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>

          {/* Right Column - Settings */}
          <aside className="space-y-4">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-700">
                Post Details
              </p>

              <div className="space-y-4">
                <div>
                  <SectionLabel>Title</SectionLabel>
                  <p className="text-sm text-slate-800">{blog.title}</p>
                </div>

                <div>
                  <SectionLabel>Status</SectionLabel>
                  <select
                    value={publishingStatus}
                    onChange={(e) =>
                      setPublishingStatus(
                        e.target.value as "draft" | "published" | "scheduled",
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <SectionLabel>Author</SectionLabel>
                  <select
                    value={authorIds[0] || ""}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-[var(--primary)]"
                  >
                    <option value="">Select author</option>
                    {authorOptions.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <SectionLabel>Categories</SectionLabel>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={categoryIds.includes(category.id)}
                          onChange={() => handleToggleCategory(category.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel>Tags</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const active = tagIds.includes(tag.id);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleToggleTag(tag.id)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            active
                              ? "border-[var(--primary)] bg-[var(--primary-50)] text-[var(--primary-hover)]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold text-slate-700">
                Excerpt
              </p>

              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="min-h-[120px] w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[var(--primary)]"
                rows={5}
                placeholder="Write excerpt"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-slate-700">SEO</p>

              <div className="space-y-3">
                <div>
                  <SectionLabel>Meta Title</SectionLabel>
                  <input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Meta title"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <SectionLabel>Meta Description</SectionLabel>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Meta description"
                    className="min-h-[110px] w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-[var(--primary)]"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

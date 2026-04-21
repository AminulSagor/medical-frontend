import { ArrowLeft, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { BlogDetailsApi } from "@/types/public/blogs/blog-type";

function getSafeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getPublishedDateLabel(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsedDate);
    }
  }

  return "Recently published";
}

function getReadTimeLabel(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return `${value} min read`;
  }

  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return trimmed.toLowerCase().includes("read")
      ? trimmed
      : `${trimmed} min read`;
  }

  return "0 min read";
}

function getAuthorName(blog: BlogDetailsApi): string {
  const authors = Array.isArray(blog.authors) ? blog.authors : [];
  const primaryAuthor = authors[0];

  return getSafeString(
    blog.authorName,
    getSafeString(primaryAuthor?.fullLegalName, "Unknown Author"),
  );
}

export default function BlogDetailsHeader({ blog }: { blog: BlogDetailsApi }) {
  const title = getSafeString(blog.title, "Untitled Article");
  const authorName = getAuthorName(blog);
  const readTimeLabel = getReadTimeLabel(blog.readTimeMinutes);

  return (
    <div>
      <div className="text-md font-medium text-light-slate/60">
        <Link
          href="/public/blogs"
          className="inline-flex items-center gap-1 text-primary hover:opacity-80"
        >
          <ArrowLeft className="h-5 w-6" />
          <span>Back to Discoveries</span>
        </Link>
      </div>
      <div className="mt-6 text-center">
        {blog.isFeatured && (
          <div className="text-[11px] font-extrabold tracking-[0.22em] text-primary">
            EDITOR&apos;S PICK
          </div>
        )}

        <h1 className="mt-3 font-serif text-[34px] leading-[1.1] font-bold text-black md:text-[34px] lg:max-w-3xl mx-auto">
          {title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-light-slate/60">
          {authorName && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F2C94C]" />
              <span className="font-semibold text-light-slate/70">
                {authorName}
              </span>
            </div>
          )}
          <span>{getPublishedDateLabel(blog.publishedAt)}</span>
          <span>{readTimeLabel}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-light-slate/60">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white transition hover:bg-light-slate/5">
            <Linkedin size={16} strokeWidth={1.8} />
          </button>

          <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white transition hover:bg-light-slate/5">
            <Twitter size={16} strokeWidth={1.8} />
          </button>

          <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white transition hover:bg-light-slate/5">
            <Mail size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}

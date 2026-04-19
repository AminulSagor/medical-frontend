import type {
  BlogPost,
  BlogPostApi,
  TrendingItem,
} from "@/types/public/blogs/blog-type";

const BLOGS_BASE_PATH = "/public/blogs";

const getSafeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of ["name", "title", "label", "url", "src", "href"]) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return fallback;
};

const getSafeArray = <T>(value: T[] | null | undefined): T[] => {
  return Array.isArray(value) ? value : [];
};

const getSafeReadTimeLabel = (value: unknown): string | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return `${value} min read`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed.toLowerCase().includes("read") ? trimmed : `${trimmed} min read`;
    }
  }

  return undefined;
};

const getSafeDateLabel = (publishedAt: unknown): string => {
  if (typeof publishedAt === "string" && publishedAt.trim()) {
    const parsedDate = new Date(publishedAt);

    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsedDate);
    }
  }

  return "Recently published";
};

export const getBlogHref = (id: string): string => `${BLOGS_BASE_PATH}/${id}`;

export const formatBlogDateLabel = (publishedAt: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt));
};

export const getBlogReadsLabel = (blog: Pick<BlogPostApi, "readBy" | "readCount">): string => {
  const readBy = getSafeString(blog.readBy);
  if (readBy) {
    return `${readBy} reads`;
  }

  if (typeof blog.readCount === "number") {
    return `${blog.readCount.toLocaleString("en-US")} reads`;
  }

  if (typeof blog.readCount === "string" && blog.readCount.trim()) {
    return `${blog.readCount.trim()} reads`;
  }

  return "0 reads";
};

export const mapApiBlogToUiBlog = (apiPost: BlogPostApi): BlogPost => {
  const categories = getSafeArray(apiPost.categories);
  const authors = getSafeArray(apiPost.authors);

  const primaryCategory = getSafeString(categories[0]?.name, "Uncategorized");
  const primaryAuthor = authors[0];
  const title = getSafeString(apiPost.title, "Untitled Article");
  const description = getSafeString(apiPost.description ?? apiPost.excerpt, "No description available.");

  return {
    id: getSafeString(apiPost.id, `blog-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"}`),
    category: primaryCategory,
    title,
    excerpt: description,
    dateLabel: getSafeDateLabel(apiPost.publishedAt),
    readTimeLabel: getSafeReadTimeLabel(apiPost.readTimeMinutes),
    coverImageSrc: getSafeString(apiPost.coverImageUrl),
    coverImageAlt: title,
    author: primaryAuthor
      ? {
          name: getSafeString(primaryAuthor.fullLegalName, "Unknown Author"),
          avatarSrc: getSafeString(primaryAuthor.profilePhotoUrl) || undefined,
        }
      : undefined,
    href: getBlogHref(getSafeString(apiPost.id, title)),
    badge: apiPost.isFeatured ? { label: "EDITOR'S PICK" } : undefined,
  };
};

export const mapApiBlogToTrendingItem = (apiPost: BlogPostApi): TrendingItem => {
  const title = getSafeString(apiPost.title, "Untitled Article");
  const id = getSafeString(apiPost.id, title);

  return {
    id,
    title,
    readsLabel: getBlogReadsLabel(apiPost),
    href: getBlogHref(id),
  };
};

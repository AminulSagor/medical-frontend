import type {
  BlogPost,
  BlogPostApi,
  TrendingItem,
} from "@/types/public/blogs/blog-type";

const BLOGS_BASE_PATH = "/public/blogs";

export const getBlogHref = (id: string): string => `${BLOGS_BASE_PATH}/${id}`;

export const formatBlogDateLabel = (publishedAt: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt));
};

export const getBlogReadsLabel = (blog: Pick<BlogPostApi, "readBy" | "readCount">): string => {
  if (blog.readBy) {
    return `${blog.readBy} reads`;
  }

  if (typeof blog.readCount === "number") {
    return `${blog.readCount.toLocaleString("en-US")} reads`;
  }

  return "0 reads";
};

export const mapApiBlogToUiBlog = (apiPost: BlogPostApi): BlogPost => {
  const primaryCategory = apiPost.categories[0]?.name ?? "Uncategorized";
  const primaryAuthor = apiPost.authors[0];

  return {
    id: apiPost.id,
    category: primaryCategory,
    title: apiPost.title,
    excerpt: apiPost.description,
    dateLabel: formatBlogDateLabel(apiPost.publishedAt),
    readTimeLabel: `${apiPost.readTimeMinutes} min read`,
    coverImageSrc: apiPost.coverImageUrl,
    coverImageAlt: apiPost.title,
    author: primaryAuthor
      ? {
          name: primaryAuthor.fullLegalName,
          avatarSrc: primaryAuthor.profilePhotoUrl,
        }
      : undefined,
    href: getBlogHref(apiPost.id),
    badge: apiPost.isFeatured ? { label: "EDITOR'S PICK" } : undefined,
  };
};

export const mapApiBlogToTrendingItem = (apiPost: BlogPostApi): TrendingItem => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    readsLabel: getBlogReadsLabel(apiPost),
    href: getBlogHref(apiPost.id),
  };
};

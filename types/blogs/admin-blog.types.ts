export type BlogPublishingStatus = "draft" | "scheduled" | "published";

export type CreateBlogRequest = {
  title: string;
  content: string;
  coverImageUrl: string | null;
  publishingStatus: BlogPublishingStatus;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  excerpt: string;
  authorIds: string[];
  categoryIds: string[];
  tagIds: string[];
  seoMetaTitle: string;
  seoMetaDescription: string;
};

export type BlogSeo = {
  id: string;
  postId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogAuthor = {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type BlogPostResponse = {
  id: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  publishingStatus: BlogPublishingStatus;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  excerpt: string;
  readTimeMinutes: number;
  publishedAt: string | null;
  seo: BlogSeo;
  authors: BlogAuthor[];
  categories: BlogCategory[];
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
};

export type BlogListParams = {
  page?: number;
  limit?: number;
  status?: BlogPublishingStatus | "all";
  search?: string;
  categoryId?: string;
};

export type BlogListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogStatusCounts = {
  all: number;
  draft: number;
  scheduled: number;
  published: number;
};

export type BlogListResponse = {
  items: BlogPostResponse[];
  meta: BlogListMeta;
  statusCounts: BlogStatusCounts;
};

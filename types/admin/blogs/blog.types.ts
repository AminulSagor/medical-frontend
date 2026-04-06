export interface BlogSeo {
  id: string;
  postId: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export type BlogPublishingStatus = "published" | "draft" | "scheduled";

export interface BlogItem {
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
  seo: BlogSeo | null;
  authors: BlogAuthor[];
  categories: BlogCategory[];
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListQueryParams {
  page: number;
  limit: number;
  status?: BlogPublishingStatus;
  search?: string;
}

export interface BlogListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogStatusCounts {
  all: number;
  draft: number;
  scheduled: number;
  published: number;
}

export interface BlogListResult {
  items: BlogItem[];
  meta: BlogListMeta;
  statusCounts: BlogStatusCounts;
}

export type BlogManagementTabKey = "all" | "published" | "drafts" | "scheduled";

export type BlogManagementPostStatus = "Published" | "Draft" | "Scheduled";

export type BlogManagementSortKey =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

export interface BlogManagementRow {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BlogManagementPostStatus;
  dateLabel: string;
  dateValue: string | null;
  views?: number | null;
  thumbSrc: string | null;
}

export interface BlogManagementTabCounts {
  all: number;
  published: number;
  drafts: number;
  scheduled: number;
}

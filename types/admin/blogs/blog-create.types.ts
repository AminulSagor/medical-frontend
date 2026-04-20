export type BlogCreatePublishingStatus = "draft" | "scheduled" | "published";

export type BlogCategoryOption = {
  id: string;
  name: string;
};

export type BlogTagOption = {
  id: string;
  name: string;
};

export type BlogCoverImageType = "hero" | "thumbnail" | "article_inline";

export type BlogCoverImagePayloadItem = {
  imageUrl: string;
  imageType: BlogCoverImageType;
};

export type CreateBlogPostPayload = {
  title: string;
  content: string;
  authorName: string;
  coverImageUrl: BlogCoverImagePayloadItem[];
  categoryIds: string[];
  tagIds: string[];
  publishingStatus: BlogCreatePublishingStatus;
  scheduledPublishDate?: string;
  isFeatured: boolean;
  excerpt: string;
  readTimeMinutes: number;
  seoMetaTitle: string;
  seoMetaDescription: string;
};

export type CreateBlogPostResponse = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  coverImages: BlogCoverImagePayloadItem[];
  publishingStatus: BlogCreatePublishingStatus;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  excerpt: string;
  readTimeMinutes: number;
  readCount: number;
  publishedAt: string | null;
  seo: {
    id: string;
    postId: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  authors: Array<{
    id: string;
    fullLegalName?: string;
    name?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateBlogPostPayload = {
  title: string;
  content: string;
  authorName: string;
  coverImageUrl: BlogCoverImagePayloadItem[];
  categoryIds: string[];
  tagIds: string[];
  publishingStatus: BlogCreatePublishingStatus;
  scheduledPublishDate?: string;
  isFeatured: boolean;
  excerpt: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
};

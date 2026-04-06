export type BlogCreatePublishingStatus = "draft" | "scheduled" | "published";

export type BlogAuthorOption = {
  id: string;
  name: string;
};

export type BlogCategoryOption = {
  id: string;
  name: string;
};

export type BlogTagOption = {
  id: string;
  name: string;
};

export type CreateBlogPostPayload = {
  title: string;
  content: string;
  coverImageUrl: string;
  publishingStatus: BlogCreatePublishingStatus;
  scheduledPublishDate?: string;
  isFeatured: boolean;
  excerpt: string;
  authorIds: string[];
  categoryIds: string[];
  tagIds: string[];
  seoMetaTitle: string;
  seoMetaDescription: string;
};
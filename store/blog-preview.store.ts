import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BlogPreviewSource = "draft" | "published";

export type BlogPreviewImage = {
  imageUrl: string;
  imageType: "hero" | "thumbnail";
};

export type BlogPreviewItem = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  coverImages: BlogPreviewImage[];
  publishingStatus: string;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  excerpt: string;
  readTimeMinutes: number;
  publishedAt: string | null;
  seo: {
    id: string;
    postId: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
  } | null;
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

type BlogPreviewState = {
  source: BlogPreviewSource;
  blogId?: string;
  previewBlog: BlogPreviewItem | null;
  setDraftPreview: (data: BlogPreviewItem) => void;
  setPublishedPreview: (data: BlogPreviewItem) => void;
  clearPreview: () => void;
};

export const useBlogPreviewStore = create<BlogPreviewState>()(
  persist(
    (set) => ({
      source: "draft",
      blogId: undefined,
      previewBlog: null,

      setDraftPreview: (data) =>
        set({
          source: "draft",
          previewBlog: data,
          blogId: data.id || undefined,
        }),

      setPublishedPreview: (data) =>
        set({
          source: "published",
          previewBlog: data,
          blogId: data.id || undefined,
        }),

      clearPreview: () =>
        set({
          previewBlog: null,
          blogId: undefined,
          source: "draft",
        }),
    }),
    {
      name: "blog-preview-store",
    },
  ),
);

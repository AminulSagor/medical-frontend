import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BlogPreviewSource = "draft" | "published";
export type BlogPreviewMode = "create" | "edit";

export type BlogPreviewImage = {
  imageUrl: string;
  imageType: "hero" | "thumbnail" | "article_inline";
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

type BlogPreviewOptions = {
  mode?: BlogPreviewMode;
  returnPath?: string;
};

type BlogPreviewState = {
  source: BlogPreviewSource;
  mode: BlogPreviewMode;
  blogId?: string;
  previewReturnPath?: string;
  previewBlog: BlogPreviewItem | null;
  setDraftPreview: (
    data: BlogPreviewItem,
    options?: BlogPreviewOptions,
  ) => void;
  setPublishedPreview: (
    data: BlogPreviewItem,
    options?: BlogPreviewOptions,
  ) => void;
  clearPreview: () => void;
};

export const useBlogPreviewStore = create<BlogPreviewState>()(
  persist(
    (set) => ({
      source: "draft",
      mode: "create",
      blogId: undefined,
      previewReturnPath: undefined,
      previewBlog: null,

      setDraftPreview: (data, options) =>
        set({
          source: "draft",
          mode: options?.mode ?? "create",
          previewReturnPath: options?.returnPath ?? undefined,
          previewBlog: data,
          blogId: data.id?.trim() ? data.id : undefined,
        }),

      setPublishedPreview: (data, options) =>
        set({
          source: "published",
          mode: options?.mode ?? "create",
          previewReturnPath: options?.returnPath ?? undefined,
          previewBlog: data,
          blogId: data.id?.trim() ? data.id : undefined,
        }),

      clearPreview: () =>
        set({
          previewBlog: null,
          blogId: undefined,
          previewReturnPath: undefined,
          source: "draft",
          mode: "create",
        }),
    }),
    {
      name: "blog-preview-store",
    },
  ),
);

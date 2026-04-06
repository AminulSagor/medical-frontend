export type BlogCategoryApiItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogCategoriesBulkPayload = {
  categories: Array<{
    name: string;
  }>;
};
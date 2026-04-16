import type { BlogCategoryOption } from "@/types/admin/blogs/blog-create.types";
import type {
  BlogCategoryApiItem,
  CreateBlogCategoriesBulkPayload,
} from "@/types/admin/blogs/blog-category.types";
import { serviceClient } from "@/service/base/axios_client";

export async function getBlogCategories(): Promise<BlogCategoryOption[]> {
  const { data } = await serviceClient.get<BlogCategoryApiItem[]>(
    "/admin/blog-categories",
  );

  return data
    .filter((item) => item.isActive)
    .map((item) => ({
      id: item.id,
      name: item.name,
    }));
}

export async function createBlogCategories(
  payload: CreateBlogCategoriesBulkPayload,
): Promise<void> {
  await serviceClient.post("/admin/blog-categories/bulk", payload);
}

import { serviceClient } from "@/service/base/axios_client";
import { GetBlogsResponseApi, BlogDetailsApi } from "@/types/public/blogs/blog-type";

export type GetBlogsParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: "latest" | "popular" | "oldest" | string;
};

export const getPublicBlogs = async (
  params: GetBlogsParams = {}
): Promise<GetBlogsResponseApi> => {
  const { page = 1, limit = 10, search, categoryId, sortBy } = params;
  
  const response = await serviceClient.get<GetBlogsResponseApi>(
    `/public/blogs`,
    {
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(categoryId && { categoryId }),
        ...(sortBy && { sortBy }),
      },
    }
  );
  return response.data;
};

export const getBlogById = async (id: string): Promise<BlogDetailsApi> => {
  const response = await serviceClient.get<BlogDetailsApi>(`/public/blogs/${id}`);
  return response.data;
};

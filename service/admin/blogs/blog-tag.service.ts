import { serviceClient } from "@/service/base/axios_client";
import type {
  BlogTagItem,
  CreateBlogTagsRequest,
} from "@/types/admin/blogs/blog-tag.types";

export const getBlogTags = async (): Promise<BlogTagItem[]> => {
  const response = await serviceClient.get<BlogTagItem[]>("/admin/tags");
  return response.data;
};

export const createBlogTags = async (
  data: CreateBlogTagsRequest,
): Promise<unknown> => {
  const response = await serviceClient.post("/admin/tags/bulk", data);
  return response.data;
};
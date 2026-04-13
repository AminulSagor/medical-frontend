import { serviceClient } from "@/service/base/axios_client";
import type { BlogLivePost } from "@/types/admin/blogs/blog-live.types";

export async function getAdminBlogLiveById(
  blogPostId: string,
): Promise<BlogLivePost> {
  const response = await serviceClient.get<BlogLivePost>(
    `/admin/blog/${blogPostId}`,
  );

  return response.data;
}
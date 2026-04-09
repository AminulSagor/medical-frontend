import { serviceClient } from "@/service/base/axios_client";

export async function deleteBlogPost(blogPostId: string): Promise<void> {
  await serviceClient.delete(`/admin/blog/${blogPostId}`);
}

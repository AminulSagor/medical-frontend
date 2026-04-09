import { serviceClient } from "@/service/base/axios_client";
import type { CreateBlogPostPayload } from "@/types/admin/blogs/blog-create.types";

export async function createBlogPost(payload: CreateBlogPostPayload) {
  console.log("payload", payload);
  const { data } = await serviceClient.post("/admin/blog", payload);
  return data;
}

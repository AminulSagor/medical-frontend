import { serviceClient } from "@/service/base/axios_client";
import type {
  UpdateBlogPostPayload,
  CreateBlogPostResponse,
} from "@/types/admin/blogs/blog-create.types";

export async function updateBlogPost(
  blogId: string,
  payload: UpdateBlogPostPayload,
): Promise<CreateBlogPostResponse> {
  //   console.log("pyaload", payload);
  const { data } = await serviceClient.patch(`/admin/blog/${blogId}`, payload);
  //   console.log("respnse ", data);
  return data;
}

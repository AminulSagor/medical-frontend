import { serviceClient } from "@/service/base/axios_client";

export async function updateBlogSeoAndExcerpt(
  blogId: string,
  payload: {
    excerpt: string;
    seoMetaTitle: string;
    seoMetaDescription: string;
  },
) {
  return serviceClient.patch(`/admin/blog/${blogId}`, payload);
}

export async function updateBlogRelations(
  blogId: string,
  payload: {
    authorIds: string[];
    categoryIds: string[];
    tagIds: string[];
  },
) {
  return serviceClient.patch(`/admin/blog/${blogId}`, payload);
}

export async function updateBlogStatus(
  blogId: string,
  payload: {
    publishingStatus: "draft" | "published" | "scheduled";
  },
) {
  return serviceClient.patch(`/admin/blog/${blogId}`, payload);
}
import { serviceClient } from "@/service/base/axios_client";

import type {
  BlogCategory,
  BlogListParams,
  BlogListResponse,
  BlogPostResponse,
  BlogTag,
  CreateBlogRequest,
} from "../../../types/blogs/admin-blog.types";

export async function createBlog(body: CreateBlogRequest): Promise<BlogPostResponse> {
  const { data } = await serviceClient.post<BlogPostResponse>("/admin/blog", body);
  return data;
}

export async function updateBlog(
  id: string,
  body: CreateBlogRequest
): Promise<BlogPostResponse> {
  const { data } = await serviceClient.patch<BlogPostResponse>(`/admin/blog/${id}`, body);
  return data;
}

export async function listBlogs(params: BlogListParams = {}): Promise<BlogListResponse> {
  const queryParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };
  if (params.status && params.status !== "all") {
    queryParams.status = params.status;
  }
  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params.categoryId?.trim()) {
    queryParams.categoryId = params.categoryId.trim();
  }
  const { data } = await serviceClient.get<BlogListResponse>("/admin/blog", {
    params: queryParams,
  });
  return data;
}

export async function deleteBlog(id: string): Promise<void> {
  await serviceClient.delete(`/admin/blog/${id}`);
}

export async function getBlogById(id: string): Promise<BlogPostResponse> {
  const { data } = await serviceClient.get<BlogPostResponse>(`/admin/blog/${id}`);
  return data;
}

export async function listBlogCategories(q?: string): Promise<BlogCategory[]> {
  const { data } = await serviceClient.get<BlogCategory[]>("/admin/blog-categories", {
    params: q?.trim() ? { q: q.trim() } : undefined,
  });
  return Array.isArray(data) ? data : [];
}

export async function listAdminTags(q?: string): Promise<BlogTag[]> {
  const { data } = await serviceClient.get<BlogTag[]>("/admin/tags", {
    params: q?.trim() ? { q: q.trim() } : undefined,
  });
  return Array.isArray(data) ? data : [];
}

function normalizeEntities<T extends { id: string }>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as T[];
    if (Array.isArray(o.categories)) return o.categories as T[];
    if (Array.isArray(o.tags)) return o.tags as T[];
    if (typeof o.id === "string") return [raw as T];
  }
  return [];
}

export async function bulkCreateCategories(
  names: string[]
): Promise<BlogCategory[]> {
  const { data } = await serviceClient.post<unknown>("/admin/blog-categories/bulk", {
    categories: names.map((name) => ({ name: name.trim() })).filter((c) => c.name.length > 0),
  });
  return normalizeEntities<BlogCategory>(data);
}

export async function bulkCreateTags(names: string[]): Promise<BlogTag[]> {
  const { data } = await serviceClient.post<unknown>("/admin/tags/bulk", {
    tags: names.map((name) => ({ name: name.trim() })).filter((t) => t.name.length > 0),
  });
  return normalizeEntities<BlogTag>(data);
}

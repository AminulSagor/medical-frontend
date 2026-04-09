import { serviceClient } from "@/service/base/axios_client";
import type {
  BlogListQueryParams,
  BlogListResult,
  BlogPublishingStatus,
} from "@/types/admin/blogs/blog.types";

type AdminBlogListApiResponse = BlogListResult;
export async function getAdminBlogs(
  params: BlogListQueryParams,
): Promise<BlogListResult> {
  const queryParams: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.status) {
    queryParams.status = params.status;
  }

  if (params.search?.trim()) {
    queryParams.search = params.search.trim();
  }

  const response = await serviceClient.get<AdminBlogListApiResponse>(
    "/admin/blog",
    {
      params: queryParams,
    },
  );

  return {
    items: Array.isArray(response.data?.items) ? response.data.items : [],
    meta: {
      page: response.data?.meta?.page ?? params.page,
      limit: response.data?.meta?.limit ?? params.limit,
      total: response.data?.meta?.total ?? 0,
      totalPages: response.data?.meta?.totalPages ?? 1,
    },
    statusCounts: {
      all: response.data?.statusCounts?.all ?? 0,
      draft: response.data?.statusCounts?.draft ?? 0,
      scheduled: response.data?.statusCounts?.scheduled ?? 0,
      published: response.data?.statusCounts?.published ?? 0,
    },
  };
}

export function mapTabToPublishingStatus(
  tab: "all" | "published" | "drafts" | "scheduled",
): BlogPublishingStatus | undefined {
  if (tab === "published") return "published";
  if (tab === "drafts") return "draft";
  if (tab === "scheduled") return "scheduled";
  return undefined;
}

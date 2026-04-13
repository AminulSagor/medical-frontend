import { serviceClient } from "@/service/base/axios_client";

import type {
  BlogDistributionActionResponse,
  DistributeBlogBlastPayload,
  DistributeBlogCohortsPayload,
  DistributeBlogNewsletterPayload,
  GetBlogDistributionOptionsResponse,
} from "@/types/admin/blogs/blog-distribution.types";

class BlogDistributionService {
  async getDistributionOptions(
    blogId: string,
  ): Promise<GetBlogDistributionOptionsResponse> {
    const response =
      await serviceClient.get<GetBlogDistributionOptionsResponse>(
        `/admin/blog/${blogId}/distribute/options`,
      );

    return response.data;
  }

  async distributeBlast(
    blogId: string,
    payload: DistributeBlogBlastPayload = { sendAdminCopy: true },
  ): Promise<BlogDistributionActionResponse> {
    const response = await serviceClient.post<BlogDistributionActionResponse>(
      `/admin/blog/${blogId}/distribute/blast`,
      payload,
    );

    return response.data;
  }

  async distributeNewsletter(
    blogId: string,
    payload: DistributeBlogNewsletterPayload,
  ): Promise<BlogDistributionActionResponse> {
    const response = await serviceClient.post<BlogDistributionActionResponse>(
      `/admin/blog/${blogId}/distribute/newsletter`,
      payload,
    );

    return response.data;
  }

  async distributeCohorts(
    blogId: string,
    payload: DistributeBlogCohortsPayload,
  ): Promise<BlogDistributionActionResponse> {
    const response = await serviceClient.post<BlogDistributionActionResponse>(
      `/admin/blog/${blogId}/distribute/cohorts`,
      payload,
    );

    return response.data;
  }
}

export const blogDistributionService = new BlogDistributionService();
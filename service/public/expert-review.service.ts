import { serviceClient } from "@/service/base/axios_client";
import { ExpertReviewResponse } from "@/types/public/review/expert-review.types";

export const getExpertReviews = async (
  page = 1,
  limit = 10
): Promise<ExpertReviewResponse> => {
  const response = await serviceClient.get<ExpertReviewResponse>(
    "/expert-reviews",
    { params: { page, limit } }
  );
  return response.data;
};

export const createExpertReview = async (
  payload: import("@/types/public/review/expert-review.types").CreateExpertReviewDto
): Promise<import("@/types/public/review/expert-review.types").ExpertReview> => {
  const response = await serviceClient.post<import("@/types/public/review/expert-review.types").ExpertReview>(
    "/expert-reviews",
    payload
  );
  return response.data;
};

export const getExpertReviewById = async (
  reviewId: string
): Promise<import("@/types/public/review/expert-review.types").ExpertReview> => {
  const response = await serviceClient.get<import("@/types/public/review/expert-review.types").ExpertReview>(
    `/expert-reviews/${reviewId}`
  );
  return response.data;
};

export const updateExpertReview = async (
  reviewId: string,
  payload: import("@/types/public/review/expert-review.types").UpdateExpertReviewDto
): Promise<import("@/types/public/review/expert-review.types").ExpertReview> => {
  const response = await serviceClient.put<import("@/types/public/review/expert-review.types").ExpertReview>(
    `/expert-reviews/${reviewId}`,
    payload
  );
  return response.data;
};

export const deleteExpertReview = async (
  reviewId: string
): Promise<{ message: string }> => {
  const response = await serviceClient.delete<{ message: string }>(
    `/expert-reviews/${reviewId}`
  );
  return response.data;
};

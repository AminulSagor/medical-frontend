import { serviceClient } from "@/service/base/axios_client";
import type {
  ReviewsResponse,
  RatingSummary,
  ReviewsQueryParams,
} from "@/types/review/review.types";

// Get reviews for a product (public)
export const getProductReviews = async (
  productId: string,
  params?: ReviewsQueryParams
): Promise<ReviewsResponse> => {
  const response = await serviceClient.get<ReviewsResponse>(
    `/public/reviews/product/${productId}`,
    { params }
  );
  return response.data;
};

// Get rating summary for a product (public)
export const getProductRatingSummary = async (
  productId: string
): Promise<RatingSummary> => {
  const response = await serviceClient.get<RatingSummary>(
    `/public/reviews/product/${productId}/summary`
  );
  return response.data;
};

// Mark a review as helpful (public)
export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  await serviceClient.post(`/public/reviews/${reviewId}/helpful`);
};

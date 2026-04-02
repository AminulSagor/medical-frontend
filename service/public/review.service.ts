import { serviceClient } from "@/service/base/axios_client";
import {
  QueryReviewsDto,
  ReviewsResponse,
  CreateReviewDto,
  ReviewSummary,
} from "@/types/review/review.types";

/**
 * Get reviews for a product (Public)
 */
export const getProductReviews = async (
  productId: string,
  query?: QueryReviewsDto
): Promise<ReviewsResponse> => {
  const response = await serviceClient.get<ReviewsResponse>(
    `/public/reviews/product/${productId}`,
    { params: query }
  );
  return response.data;
};

/**
 * Get rating summary for a product (Public)
 */
export const getProductRatingSummary = async (
  productId: string
): Promise<ReviewSummary> => {
  const response = await serviceClient.get<ReviewSummary>(
    `/public/reviews/product/${productId}/summary`
  );
  return response.data;
};

/**
 * Mark a review as helpful (Public)
 */
export const markReviewHelpful = async (reviewId: string): Promise<any> => {
  const response = await serviceClient.post(
    `/public/reviews/${reviewId}/helpful`
  );
  return response.data;
};

/**
 * Create a new review (Authenticated)
 */
export const submitReview = async (dto: CreateReviewDto): Promise<any> => {
  const response = await serviceClient.post(`/reviews`, dto);
  return response.data;
};

/**
 * Get current user's review for a product (Authenticated)
 */
export const getMyReview = async (productId: string): Promise<any> => {
  const response = await serviceClient.get(`/reviews/my-review/${productId}`);
  return response.data;
};

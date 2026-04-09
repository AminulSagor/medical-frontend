import { serviceClient } from "@/service/base/axios_client";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "@/types/public/review/review.types";

// Create a review (authenticated)
export const createReview = async (
  data: CreateReviewRequest,
): Promise<Review> => {
  const response = await serviceClient.post<Review>("/reviews", data);
  return response.data;
};

// Get user's review for a product
export const getMyReview = async (
  productId: string,
): Promise<Review | null> => {
  try {
    const response = await serviceClient.get<Review>(
      `/reviews/my-review/${productId}`,
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Update user's review
export const updateReview = async (
  reviewId: string,
  data: UpdateReviewRequest,
): Promise<Review> => {
  const response = await serviceClient.patch<Review>(
    `/reviews/${reviewId}`,
    data,
  );
  return response.data;
};

// Delete user's review
export const deleteReview = async (reviewId: string): Promise<void> => {
  await serviceClient.delete(`/reviews/${reviewId}`);
};

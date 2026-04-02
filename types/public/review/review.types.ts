export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ReviewUser {
  id: string;
  name: string;
  photo?: string;
  professionalRole?: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase?: boolean;
  helpfulCount: number;
  user: ReviewUser;
  createdAt: string;
  status?: ReviewStatus;
  updatedAt?: string;
}

export interface ReviewSummary {
  averageRating: string;
  reviewsCount: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewDto {
  productId: string;
  rating: number; // 1-5
  comment: string;
}

export type CreateReviewRequest = CreateReviewDto;

export interface UpdateReviewRequest {
  rating?: number; // 1-5
  comment?: string;
}

export interface QueryReviewsDto {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "highest-rating" | "lowest-rating";
}

export interface ReviewsResponse {
  items: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

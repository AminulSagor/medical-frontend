// Review Types

export interface ReviewUser {
  id: string;
  name: string;
  professionalRole: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  user: ReviewUser;
}

export interface ReviewsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewsResponse {
  items: Review[];
  meta: ReviewsMeta;
}

export interface RatingSummary {
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

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
}

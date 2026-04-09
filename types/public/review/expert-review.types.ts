export interface ExpertReviewByInfo {
  name: string;
  profileImg: string;
  designation: string;
}

export interface ExpertReview {
  id: string;
  rating: number;
  reviewMessage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  reviewByInfo: ExpertReviewByInfo;
}

export interface ExpertReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExpertReviewResponse {
  data: ExpertReview[];
  meta: ExpertReviewMeta;
}

export interface CreateExpertReviewDto {
  rating: number;
  reviewMessage: string;
  reviewerName: string;
  reviewerProfileImg?: string;
  reviewerDesignation?: string;
}

export interface UpdateExpertReviewDto extends Partial<CreateExpertReviewDto> {}

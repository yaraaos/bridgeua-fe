export type Review = {
  id: string;
  businessId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  tags?: string[];
  photos?: string[];
  createdAt: string;
};

export type GetReviewsParams = {
  businessId: string;
  page?: number;
  limit?: number;
  rating?: number;
};

export type GetReviewsResponse = {
  data: Review[];
  page: number;
  totalPages: number;
};

export type SubmitReviewPayload = {
  businessId: string;
  rating: number;
  text: string;
  tags?: string[];
  photos?: string[];
};
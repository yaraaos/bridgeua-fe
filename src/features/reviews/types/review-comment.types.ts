export type ReviewCommentAuthor = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
};

export type ReviewComment = {
  id: string;
  reviewId: string;
  parentCommentId?: string;
  author: ReviewCommentAuthor;
  text: string;
  likesCount: number;
  likedByMe: boolean;
  repliesCount: number;
  createdAt: string;
};

export type CreateReviewCommentPayload = {
  reviewId: string;
  parentCommentId?: string;
  text: string;
};
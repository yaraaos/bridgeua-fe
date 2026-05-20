import type { ReviewComment } from "../types/review-comment.types";

export const reviewCommentsMock: ReviewComment[] = [
  {
    id: "comment-1",
    reviewId: "review-1",
    author: {
      id: "user-1",
      name: "Olena",
      username: "olena.ua",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    },
    text: "I had a similar experience here. The staff was really attentive.",
    likesCount: 4,
    likedByMe: false,
    repliesCount: 1,
    createdAt: "2026-05-10T12:00:00.000Z",
  },
  {
    id: "comment-2",
    reviewId: "review-1",
    parentCommentId: "comment-1",
    author: {
      id: "user-2",
      name: "Marta",
      username: "marta_k",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    },
    text: "Same, I liked that they explained everything before starting.",
    likesCount: 2,
    likedByMe: false,
    repliesCount: 0,
    createdAt: "2026-05-10T13:15:00.000Z",
  },
];

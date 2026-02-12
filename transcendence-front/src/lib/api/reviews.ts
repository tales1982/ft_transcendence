import { api } from "./client";
import type {
  ReviewRequest,
  ReviewResponse,
  UserReviewStats,
  Page,
} from "../../types";

// Reviews API
export const reviewApi = {
  // Get reviews for a task
  getTaskReviews: (taskId: number) =>
    api.get<ReviewResponse[]>(`/api/reviews/task/${taskId}`).then((res) => res.data),

  // Get reviews for a user
  getUserReviews: (userId: number, page = 0, size = 10) =>
    api.get<Page<ReviewResponse>>(`/api/reviews/user/${userId}`, {
      params: { page, size }
    }).then((res) => res.data),

  // Get user review stats (average rating, total reviews)
  getUserReviewStats: (userId: number) =>
    api.get<UserReviewStats>(`/api/reviews/user/${userId}/stats`).then((res) => res.data),

  // Get single review by ID
  getReview: (id: number) =>
    api.get<ReviewResponse>(`/api/reviews/${id}`).then((res) => res.data),

  // Create a review
  createReview: (data: ReviewRequest) =>
    api.post<ReviewResponse>("/api/reviews", data).then((res) => res.data),
};

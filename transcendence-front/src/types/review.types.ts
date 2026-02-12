// Review Types

export interface Review {
  id: number;
  taskId: number;
  fromUserId: number;
  fromUserEmail: string;
  toUserId: number;
  toUserEmail: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface UserReviewStats {
  averageRating: number;
  totalReviews: number;
}

// Request DTOs
export interface ReviewRequest {
  taskId: number;
  toUserId: number;
  rating: number;
  comment?: string;
}

// Response DTOs
export type ReviewResponse = Review;

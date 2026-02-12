// Task Types

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "CANCELLED";
export type SubmissionStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export interface Task {
  id: number;
  title: string;
  description: string;
  categoryId?: number;
  categoryName?: string;
  rewardAmount: number;
  currency: string;
  locationText?: string;
  deadlineAt?: string;
  creatorId: number;
  creatorEmail: string;
  takenById?: number;
  takenByEmail?: string;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskCategory {
  id: number;
  name: string;
  isActive: boolean;
}

export interface TaskSubmission {
  id: number;
  taskId: number;
  submittedById: number;
  submittedByEmail: string;
  proofText?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedById?: number;
  reviewNotes?: string;
}

// Request DTOs
export interface TaskRequest {
  title: string;
  description: string;
  categoryId?: number;
  rewardAmount?: number;
  locationText?: string;
  deadlineAt?: string;
  tags?: string[];
}

export interface TaskSubmissionRequest {
  proofText?: string;
}

export interface ReviewSubmissionRequest {
  approved: boolean;
  reviewNotes?: string;
}

export interface CategoryRequest {
  name: string;
  isActive?: boolean;
}

// Response DTOs (same as interfaces above)
export type TaskResponse = Task;
export type TaskSubmissionResponse = TaskSubmission;
export type CategoryResponse = TaskCategory;

// Paginated Response
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

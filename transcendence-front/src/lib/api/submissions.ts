import { api } from "./client";
import type {
  TaskSubmissionRequest,
  TaskSubmissionResponse,
  ReviewSubmissionRequest,
  Page,
} from "../../types";

// Task Submissions API
export const submissionApi = {
  // Get submissions for a task
  getTaskSubmissions: (taskId: number) =>
    api.get<TaskSubmissionResponse[]>(`/api/submissions/task/${taskId}`).then((res) => res.data),

  // Get current user's submissions
  getMySubmissions: (page = 0, size = 10) =>
    api.get<Page<TaskSubmissionResponse>>("/api/submissions/my", { params: { page, size } }).then((res) => res.data),

  // Get submission by ID
  getSubmission: (id: number) =>
    api.get<TaskSubmissionResponse>(`/api/submissions/${id}`).then((res) => res.data),

  // Submit a task
  submitTask: (taskId: number, data: TaskSubmissionRequest) =>
    api.post<TaskSubmissionResponse>(`/api/submissions/task/${taskId}`, data).then((res) => res.data),

  // Review a submission (approve/reject)
  reviewSubmission: (submissionId: number, data: ReviewSubmissionRequest) =>
    api.post<TaskSubmissionResponse>(`/api/submissions/${submissionId}/review`, data).then((res) => res.data),

  // Approve submission (shorthand)
  approveSubmission: (submissionId: number, reviewNotes?: string) =>
    api.post<TaskSubmissionResponse>(`/api/submissions/${submissionId}/review`, {
      approved: true,
      reviewNotes,
    }).then((res) => res.data),

  // Reject submission (shorthand)
  rejectSubmission: (submissionId: number, reviewNotes?: string) =>
    api.post<TaskSubmissionResponse>(`/api/submissions/${submissionId}/review`, {
      approved: false,
      reviewNotes,
    }).then((res) => res.data),
};

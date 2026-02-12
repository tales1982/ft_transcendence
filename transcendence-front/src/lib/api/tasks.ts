import { api } from "./client";
import type {
  TaskRequest,
  TaskResponse,
  TaskStatus,
  CategoryRequest,
  CategoryResponse,
  Page,
} from "../../types";

// Task Categories API
export const categoryApi = {
  // Get all active categories
  getCategories: () =>
    api.get<CategoryResponse[]>("/api/categories").then((res) => res.data),

  // Get category by ID
  getCategory: (id: number) =>
    api.get<CategoryResponse>(`/api/categories/${id}`).then((res) => res.data),

  // Create category
  createCategory: (data: CategoryRequest) =>
    api.post<CategoryResponse>("/api/categories", data).then((res) => res.data),

  // Update category
  updateCategory: (id: number, data: CategoryRequest) =>
    api.put<CategoryResponse>(`/api/categories/${id}`, data).then((res) => res.data),

  // Deactivate category
  deactivateCategory: (id: number) =>
    api.delete(`/api/categories/${id}`),
};

// Tasks API
export const taskApi = {
  // Get all tasks (paginated)
  getTasks: (page = 0, size = 10) =>
    api.get<Page<TaskResponse>>("/api/tasks", { params: { page, size } }).then((res) => res.data),

  // Get tasks by status
  getTasksByStatus: (status: TaskStatus, page = 0, size = 10) =>
    api.get<Page<TaskResponse>>(`/api/tasks/status/${status}`, { params: { page, size } }).then((res) => res.data),

  // Get open tasks
  getOpenTasks: (page = 0, size = 10) =>
    api.get<Page<TaskResponse>>("/api/tasks/open", { params: { page, size } }).then((res) => res.data),

  // Get tasks created by current user
  getMyCreatedTasks: (page = 0, size = 10) =>
    api.get<Page<TaskResponse>>("/api/tasks/my-created", { params: { page, size } }).then((res) => res.data),

  // Get tasks taken by current user
  getMyTakenTasks: (page = 0, size = 10) =>
    api.get<Page<TaskResponse>>("/api/tasks/my-taken", { params: { page, size } }).then((res) => res.data),

  // Get tasks by category
  getTasksByCategory: (categoryId: number, page = 0, size = 10) =>
    api.get<Page<TaskResponse>>(`/api/tasks/category/${categoryId}`, { params: { page, size } }).then((res) => res.data),

  // Get single task by ID
  getTask: (id: number) =>
    api.get<TaskResponse>(`/api/tasks/${id}`).then((res) => res.data),

  // Create a new task
  createTask: (data: TaskRequest) =>
    api.post<TaskResponse>("/api/tasks", data).then((res) => res.data),

  // Take a task
  takeTask: (taskId: number) =>
    api.post<TaskResponse>(`/api/tasks/${taskId}/take`).then((res) => res.data),

  // Cancel a task
  cancelTask: (taskId: number, reason?: string) =>
    api.post<TaskResponse>(`/api/tasks/${taskId}/cancel`, null, { params: { reason } }).then((res) => res.data),
};

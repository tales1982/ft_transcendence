import axios from "axios";
import { env } from "../../config/env";
import type { TaskResponse, CategoryResponse, Page } from "../../types";

const publicApi = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const publicTaskApi = {
  getOpenTasks: (page = 0, size = 50) =>
    publicApi
      .get<Page<TaskResponse>>("/api/tasks/open", { params: { page, size } })
      .then((res) => res.data),

  getCategories: () =>
    publicApi
      .get<CategoryResponse[]>("/api/categories")
      .then((res) => res.data),
};

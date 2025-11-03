// Domain types para Task (interfaces puras, SOLID-friendly)

export type TaskStatus = "pending" | "done"; // Backend usa apenas pending e done

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListParams {
  search?: string;
  status?: TaskStatus;
  limit?: number;
  cursor?: string;
  sortOrder?: "asc" | "desc";
}

export interface PageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface TaskListResult {
  data: Task[];
  pageInfo: PageInfo;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskStatusData {
  status: TaskStatus;
}

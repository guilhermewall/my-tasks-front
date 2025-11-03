import { z } from "zod";

// ============================================================
// TASK SCHEMAS
// ============================================================

export const TaskStatus = z
  .enum(["pending", "in_progress", "completed", "cancelled"])
  .default("pending");

export const TaskPriority = z.enum(["low", "medium", "high"]).default("medium");

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Título é obrigatório").max(200),
  description: z.string().nullable().optional(),
  status: TaskStatus,
  priority: TaskPriority,
  dueDate: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStatusType = z.infer<typeof TaskStatus>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;

// ============================================================
// PAGINATION SCHEMAS
// ============================================================

export const PageInfoSchema = z.object({
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export const TaskListResponseSchema = z.object({
  data: z.array(TaskSchema),
  pageInfo: PageInfoSchema,
});

export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;

// ============================================================
// TASK INPUT SCHEMAS (para formulários e mutations)
// ============================================================

export const CreateTaskInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  description: z.string().optional(),
  priority: TaskPriority.optional(),
  dueDate: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const UpdateTaskStatusInputSchema = z.object({
  status: TaskStatus,
});

export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusInputSchema>;

// ============================================================
// TASK FILTERS SCHEMA
// ============================================================

export const TaskFiltersSchema = z.object({
  search: z.string().optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type TaskFilters = z.infer<typeof TaskFiltersSchema>;

// ============================================================
// AUTH SCHEMAS
// ============================================================

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: AuthUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// ============================================================
// ERROR RESPONSE SCHEMA
// ============================================================

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

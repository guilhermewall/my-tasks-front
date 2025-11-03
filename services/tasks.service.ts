import type {
  Task,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskStatusInput,
  TaskFilters,
} from "@/lib/zod-schemas";
import { buildQueryString } from "@/lib/fetcher";

/**
 * Service de tarefas (client-side)
 * Faz requisições para os route handlers em /api/tasks
 */

export const tasksService = {
  /**
   * Lista tarefas com filtros e paginação
   */
  async list(filters?: TaskFilters): Promise<TaskListResponse> {
    const queryString = filters ? buildQueryString(filters) : "";
    const response = await fetch(`/api/tasks${queryString}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao listar tarefas");
    }

    return response.json();
  },

  /**
   * Cria uma nova tarefa
   */
  async create(data: CreateTaskInput): Promise<Task> {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar tarefa");
    }

    return response.json();
  },

  /**
   * Busca uma tarefa por ID
   */
  async getById(id: string): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao buscar tarefa");
    }

    return response.json();
  },

  /**
   * Atualiza uma tarefa
   */
  async update(
    id: string,
    data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao atualizar tarefa");
    }

    return response.json();
  },

  /**
   * Atualiza o status de uma tarefa
   */
  async updateStatus(id: string, data: UpdateTaskStatusInput): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao atualizar status");
    }

    return response.json();
  },

  /**
   * Deleta uma tarefa
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao deletar tarefa");
    }
  },
};

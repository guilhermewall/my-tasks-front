"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  TaskFilters,
  CreateTaskInput,
  UpdateTaskStatusInput,
  Task,
} from "@/lib/zod-schemas";

/**
 * Hook para listar tarefas
 */
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => tasksService.list(filters),
    staleTime: 30_000, // 30 segundos
  });
}

/**
 * Hook para buscar uma tarefa por ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => tasksService.getById(id),
    staleTime: 30_000,
    enabled: !!id, // Só executa se id existir
  });
}

/**
 * Hook para criar uma tarefa
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksService.create(data),
    onSuccess: () => {
      // Invalida cache de listagem para refetch automático
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Hook para atualizar uma tarefa
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>;
    }) => tasksService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida cache da tarefa específica e da listagem
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Hook para atualizar status de uma tarefa
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskStatusInput }) =>
      tasksService.updateStatus(id, data),
    onSuccess: (_, variables) => {
      // Invalida cache da tarefa específica e da listagem
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Hook para deletar uma tarefa
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: (_, id) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: queryKeys.tasks.detail(id) });
      // Invalida listagem
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

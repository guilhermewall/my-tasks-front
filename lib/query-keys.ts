/**
 * Chaves do React Query para gerenciar cache
 * Centralizadas para evitar inconsistências
 */

export const queryKeys = {
  // Auth
  auth: {
    me: ["auth", "me"] as const,
  },

  // Tasks
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["tasks", "list", filters] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
  },
} as const;

/**
 * Helper type para inferir tipos das query keys
 */
export type QueryKey = (typeof queryKeys)[keyof typeof queryKeys];

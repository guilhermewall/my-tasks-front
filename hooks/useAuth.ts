"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-keys";
import type { LoginInput, RegisterInput } from "@/lib/zod-schemas";

/**
 * Hook para autenticação
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para verificar autenticação
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => {
      // Invalida cache de autenticação
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      // Redireciona para tasks
      router.push("/tasks");
    },
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: () => {
      // Invalida cache de autenticação
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      // Redireciona para tasks
      router.push("/tasks");
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpa todo o cache do React Query
      queryClient.clear();
      // Redireciona para login
      router.push("/login");
    },
  });

  return {
    // Estado
    isAuthenticated: authData?.authenticated ?? false,
    isLoadingAuth,

    // Mutations
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,

    // Estados das mutations
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Erros
    registerError: registerMutation.error,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
}

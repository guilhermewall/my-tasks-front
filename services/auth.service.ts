import type { LoginInput, RegisterInput, AuthUser } from "@/lib/zod-schemas";

/**
 * Service de autenticação (client-side)
 * Faz requisições para os route handlers em /api/auth
 */

export const authService = {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterInput): Promise<{ user: AuthUser }> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao registrar");
    }

    return response.json();
  },

  /**
   * Faz login do usuário
   */
  async login(data: LoginInput): Promise<{ user: AuthUser }> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao fazer login");
    }

    return response.json();
  },

  /**
   * Renova o token de acesso
   */
  async refresh(): Promise<{ success: boolean }> {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao renovar token");
    }

    return response.json();
  },

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao fazer logout");
    }
  },

  /**
   * Obtém informações do usuário autenticado
   */
  async me(): Promise<{ authenticated: boolean }> {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao buscar usuário");
    }

    return response.json();
  },
};

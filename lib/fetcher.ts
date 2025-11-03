import { env } from "./env";

/**
 * Classe de erro customizada para erros da API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Opções para o fetcher
 */
interface FetcherOptions extends RequestInit {
  baseUrl?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Wrapper do fetch com tratamento de erros e configurações padrão
 * Usado principalmente nos Route Handlers (server-side)
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { baseUrl = env.MY_TASKS_API_URL, params, ...fetchOptions } = options;

  // Constrói a URL com query params
  const url = new URL(endpoint, baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }
  }

  // Configurações padrão
  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url.toString(), config);

    // Se a resposta for 204 (No Content), retorna null
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();

    // Se não for sucesso, lança erro
    if (!response.ok) {
      throw new ApiError(
        data.message || "Erro na requisição",
        response.status,
        data.error,
        data.details || data.validation
      );
    }

    return data as T;
  } catch (error) {
    // Re-lança ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Erros de rede ou outros erros
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }

    throw new ApiError("Erro desconhecido", 500);
  }
}

/**
 * Helper para construir query string a partir de objeto
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

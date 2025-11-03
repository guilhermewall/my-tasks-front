import { NextRequest, NextResponse } from "next/server";
import { fetcher, buildQueryString } from "@/lib/fetcher";
import { getAccessToken } from "@/lib/auth-cookies";
import {
  CreateTaskInputSchema,
  TaskListResponseSchema,
  TaskSchema,
} from "@/lib/zod-schemas";

/**
 * GET /api/tasks
 * Lista as tarefas do usuário com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Extrai query params
    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") || undefined,
      cursor: searchParams.get("cursor") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    };

    // Constrói query string
    const queryString = buildQueryString(filters);

    // Chama a API do backend
    const response = await fetcher<{
      data: unknown[];
      pageInfo: { hasNextPage: boolean; nextCursor: string | null };
    }>(`/tasks${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Valida a resposta
    const validatedResponse = TaskListResponseSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("List tasks error:", error);

    if (error instanceof Error && "statusCode" in error) {
      return NextResponse.json(
        {
          error: "Error",
          message: error.message,
        },
        { status: (error as { statusCode: number }).statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error", message: "Erro ao listar tarefas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Cria uma nova tarefa
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Valida o input
    const validatedData = CreateTaskInputSchema.parse(body);

    // Chama a API do backend
    const response = await fetcher<unknown>("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedData),
    });

    // Valida a resposta
    const validatedResponse = TaskSchema.parse(response);

    return NextResponse.json(validatedResponse, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);

    if (error instanceof Error && "statusCode" in error) {
      return NextResponse.json(
        {
          error: "Error",
          message: error.message,
        },
        { status: (error as { statusCode: number }).statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error", message: "Erro ao criar tarefa" },
      { status: 500 }
    );
  }
}

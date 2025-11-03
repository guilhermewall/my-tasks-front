import { NextRequest, NextResponse } from "next/server";
import { fetcher } from "@/lib/fetcher";
import { getAccessToken } from "@/lib/auth-cookies";
import { UpdateTaskStatusInputSchema, TaskSchema } from "@/lib/zod-schemas";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PATCH /api/tasks/[id]/status
 * Atualiza o status de uma tarefa
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Valida o input
    const validatedData = UpdateTaskStatusInputSchema.parse(body);

    // Chama a API do backend
    const response = await fetcher<unknown>(`/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedData),
    });

    // Valida a resposta
    const validatedResponse = TaskSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Update task status error:", error);

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
      { error: "Error", message: "Erro ao atualizar status da tarefa" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetcher } from "@/lib/fetcher";
import { getAccessToken } from "@/lib/auth-cookies";
import { TaskSchema } from "@/lib/zod-schemas";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/tasks/[id]
 * Busca uma tarefa específica por ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Chama a API do backend
    const response = await fetcher<unknown>(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Valida a resposta
    const validatedResponse = TaskSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Get task error:", error);

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
      { error: "Error", message: "Erro ao buscar tarefa" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/[id]
 * Atualiza uma tarefa
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

    // Chama a API do backend
    const response = await fetcher<unknown>(`/tasks/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    // Valida a resposta
    const validatedResponse = TaskSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Update task error:", error);

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
      { error: "Error", message: "Erro ao atualizar tarefa" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Deleta uma tarefa
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Chama a API do backend
    await fetcher(`/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete task error:", error);

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
      { error: "Error", message: "Erro ao deletar tarefa" },
      { status: 500 }
    );
  }
}

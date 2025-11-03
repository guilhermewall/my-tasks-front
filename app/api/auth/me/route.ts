import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth-cookies";
import { fetcher } from "@/lib/fetcher";
import { AuthUserSchema } from "@/lib/zod-schemas";

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado
 */
export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Não autenticado" },
        { status: 401 }
      );
    }

    // Busca dados do usuário no backend
    const response = await fetcher<unknown>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Valida a resposta
    const validatedUser = AuthUserSchema.parse(response);

    return NextResponse.json({ user: validatedUser });
  } catch (error) {
    console.error("Me error:", error);

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
      { error: "Error", message: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

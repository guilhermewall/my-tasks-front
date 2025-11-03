import { NextRequest, NextResponse } from "next/server";
import { fetcher } from "@/lib/fetcher";
import { setAuthTokens } from "@/lib/auth-cookies";
import { RegisterInputSchema, LoginResponseSchema } from "@/lib/zod-schemas";

/**
 * POST /api/auth/register
 * Registra um novo usuário e define cookies de autenticação
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valida o input
    const validatedData = RegisterInputSchema.parse(body);

    // Chama a API do backend
    const response = await fetcher<{
      user: { id: string; name: string; email: string };
      accessToken: string;
      refreshToken: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(validatedData),
    });

    // Valida a resposta
    const validatedResponse = LoginResponseSchema.parse(response);

    // Define os cookies httpOnly
    await setAuthTokens(
      validatedResponse.accessToken,
      validatedResponse.refreshToken
    );

    // Retorna apenas os dados do usuário (sem os tokens)
    return NextResponse.json(
      { user: validatedResponse.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

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
      { error: "Error", message: "Erro ao registrar usuário" },
      { status: 500 }
    );
  }
}

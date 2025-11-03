import { NextResponse } from "next/server";
import { fetcher } from "@/lib/fetcher";
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthCookies,
} from "@/lib/auth-cookies";
import { RefreshTokenResponseSchema } from "@/lib/zod-schemas";

/**
 * POST /api/auth/refresh
 * Renova o access token usando o refresh token (token rotation)
 */
export async function POST() {
  try {
    // Obtém o refresh token do cookie
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Refresh token não encontrado" },
        { status: 401 }
      );
    }

    // Chama a API do backend
    const response = await fetcher<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    // Valida a resposta
    const validatedResponse = RefreshTokenResponseSchema.parse(response);

    // Atualiza os cookies com os novos tokens (token rotation)
    await setAuthTokens(
      validatedResponse.accessToken,
      validatedResponse.refreshToken
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Refresh token error:", error);

    // Se o refresh falhar, limpa os cookies
    await clearAuthCookies();

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
      { error: "Error", message: "Erro ao renovar token" },
      { status: 401 }
    );
  }
}

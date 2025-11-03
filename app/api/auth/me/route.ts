import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth-cookies";

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado
 * Nota: Este endpoint poderia buscar do backend, mas por simplicidade
 * vamos decodificar do JWT ou implementar quando necessário
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

    // Implementação futura: Decodificar JWT ou buscar do backend
    // Por enquanto, retorna sucesso se o token existe
    return NextResponse.json({
      authenticated: true,
    });
  } catch (error) {
    console.error("Me error:", error);

    return NextResponse.json(
      { error: "Error", message: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

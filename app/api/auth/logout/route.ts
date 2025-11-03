import { NextResponse } from "next/server";
import { fetcher } from "@/lib/fetcher";
import { getRefreshToken, clearAuthCookies } from "@/lib/auth-cookies";

/**
 * POST /api/auth/logout
 * Revoga o refresh token e limpa os cookies
 */
export async function POST() {
  try {
    // Obtém o refresh token do cookie
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      // Tenta revogar o token no backend
      try {
        await fetcher("/auth/logout", {
          method: "DELETE",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        // Se falhar ao revogar, apenas loga o erro mas continua
        console.error("Error revoking token:", error);
      }
    }

    // Limpa os cookies independente do resultado
    await clearAuthCookies();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Logout error:", error);

    // Mesmo com erro, limpa os cookies
    await clearAuthCookies();

    return new NextResponse(null, { status: 204 });
  }
}

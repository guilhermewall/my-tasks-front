import { cookies } from "next/headers";
import { env } from "./env";

/**
 * Nomes dos cookies
 */
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * Opções padrão para cookies
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  // Não define domain para que funcione tanto em localhost quanto em subdomínios da Vercel
  // O cookie será válido apenas para o domínio atual
};

/**
 * Define o access token no cookie
 */
export async function setAccessToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, token, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60, // 15 minutos (mesma duração do token)
  });
}

/**
 * Define o refresh token no cookie
 */
export async function setRefreshToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  });
}

/**
 * Define ambos os tokens de uma vez
 */
export async function setAuthTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await setAccessToken(accessToken);
  await setRefreshToken(refreshToken);
}

/**
 * Obtém o access token do cookie
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

/**
 * Obtém o refresh token do cookie
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

/**
 * Remove todos os cookies de autenticação
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Verifica se o usuário está autenticado (possui tokens)
 */
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  return Boolean(accessToken || refreshToken);
}

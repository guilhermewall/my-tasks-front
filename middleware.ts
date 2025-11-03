import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAMES } from "./lib/auth-cookies";

/**
 * Middleware de autenticação
 * Protege rotas que começam com /tasks
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se a rota precisa de autenticação
  const isProtectedRoute = pathname.startsWith("/tasks");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Obtém os tokens dos cookies
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  // Se é uma rota protegida e não tem nenhum token, redireciona para login
  if (isProtectedRoute && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tenta acessar login/register, redireciona para tasks
  if (isAuthRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  return NextResponse.next();
}

/**
 * Configuração do matcher
 * Define quais rotas o middleware deve processar
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    String.raw`/((?!api|_next/static|_next/image|favicon.ico|.*\..*|public).*)`,
  ],
};

"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, isLoggingOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              href="/tasks"
              className="flex items-center gap-2 font-semibold text-xl hover:opacity-80 transition-opacity"
            >
              <CheckSquare className="h-6 w-6 text-primary" />
              <span>MyTasks</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/tasks"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Tarefas
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="gap-2"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saindo...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sair
                </>
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 MyTasks. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

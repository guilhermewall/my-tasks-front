import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre para gerenciar suas tarefas
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>

      {/* Lado direito - Hero/Features */}
      <div className="hidden lg:flex lg:flex-1 bg-muted items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">MyTasks</h3>
            <p className="text-muted-foreground">
              Organize suas tarefas de forma simples e eficiente
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Gerencie suas tarefas</h4>
                <p className="text-sm text-muted-foreground">
                  Crie, edite e organize suas tarefas com facilidade
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Defina prioridades</h4>
                <p className="text-sm text-muted-foreground">
                  Organize por prioridade e não perca prazos importantes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Acompanhe o progresso</h4>
                <p className="text-sm text-muted-foreground">
                  Visualize suas tarefas concluídas e pendentes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

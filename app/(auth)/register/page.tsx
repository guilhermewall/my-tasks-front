import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece a organizar suas tarefas hoje
            </p>
          </div>

          <div className="mt-8">
            <RegisterForm />
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Fazer login
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
              Gerencie suas tarefas de forma profissional
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">100% Gratuito</h4>
                <p className="text-sm text-muted-foreground">
                  Crie sua conta gratuitamente e comece agora mesmo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Simples e intuitivo</h4>
                <p className="text-sm text-muted-foreground">
                  Interface limpa e fácil de usar para máxima produtividade
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Sempre disponível</h4>
                <p className="text-sm text-muted-foreground">
                  Acesse suas tarefas de qualquer lugar, a qualquer momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

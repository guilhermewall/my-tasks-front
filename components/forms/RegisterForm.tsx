"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInputSchema, type RegisterInput } from "@/lib/zod-schemas";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function RegisterForm() {
  const { register, isRegistering, registerError } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => {
        toast({
          title: "Conta criada!",
          description: "Seu cadastro foi realizado com sucesso.",
        });
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: error.message || "Tente novamente mais tarde.",
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  disabled={isRegistering}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isRegistering}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isRegistering}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mínimo 8 caracteres com letra minúscula, maiúscula, número e
                caractere especial (!@#$%^&*)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {registerError && (
          <div className="text-sm text-destructive">
            {registerError.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isRegistering}>
          {isRegistering ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </Form>
  );
}

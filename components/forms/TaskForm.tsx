"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskInputSchema,
  type CreateTaskInput,
  type Task,
} from "@/lib/zod-schemas";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const isEditing = !!task;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { toast } = useToast();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskInputSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : undefined,
    },
  });

  const isSubmitting = createTask.isPending || updateTask.isPending;

  const onSubmit = (data: CreateTaskInput) => {
    if (isEditing) {
      updateTask.mutate(
        {
          id: task.id,
          data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            dueDate: data.dueDate,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Tarefa atualizada!",
              description: "As alterações foram salvas com sucesso.",
            });
            onSuccess?.();
          },
          onError: (error: Error) => {
            toast({
              variant: "destructive",
              title: "Erro ao atualizar tarefa",
              description: error.message,
            });
          },
        }
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Tarefa criada!",
            description: "Sua tarefa foi criada com sucesso.",
          });
          form.reset();
          onSuccess?.();
        },
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Erro ao criar tarefa",
            description: error.message,
          });
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o título da tarefa"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva a tarefa (opcional)"
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Adicione detalhes sobre a tarefa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de vencimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Defina um prazo para a tarefa (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {(() => {
              if (isSubmitting) {
                return isEditing ? "Salvando..." : "Criando...";
              }
              return isEditing ? "Salvar alterações" : "Criar tarefa";
            })()}
          </Button>
        </div>
      </form>
    </Form>
  );
}

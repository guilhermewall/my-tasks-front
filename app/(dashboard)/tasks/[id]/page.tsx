"use client";

import { use, useState } from "react";
import { useTask, useDeleteTask } from "@/hooks/useTasks";
import { TaskForm } from "@/components/forms/TaskForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { TaskPriorityBadge } from "@/components/tasks/TaskPriorityBadge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Loader2, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TaskDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const { data: task, isLoading, error } = useTask(id);
  const deleteTask = useDeleteTask();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    deleteTask.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Tarefa excluída!",
          description: "A tarefa foi removida com sucesso.",
        });
        router.push("/tasks");
      },
      onError: (deleteError: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao excluir tarefa",
          description: deleteError.message,
        });
      },
    });
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Erro ao carregar tarefa</p>
        <p className="text-sm text-muted-foreground mb-6">
          {error?.message || "Tarefa não encontrada"}
        </p>
        <Button onClick={() => router.push("/tasks")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para tarefas
        </Button>
      </div>
    );
  }

  const dueDateText = task.dueDate ? formatDate(task.dueDate) : null;
  const isOverdue =
    task.dueDate &&
    task.status === "pending" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/tasks")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="gap-2"
              >
                {deleteTask.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Editar tarefa</h2>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={task}
              onSuccess={() => {
                setIsEditing(false);
                toast({
                  title: "Tarefa atualizada!",
                  description: "As alterações foram salvas com sucesso.",
                });
              }}
            />
            <div className="mt-4">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{task.title}</h1>

              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>

              {dueDateText && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    isOverdue ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>{dueDateText}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {task.description ? (
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Sem descrição
              </p>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Criada:</span>
                  <p className="font-medium">
                    {formatDate(task.createdAt) || "Desconhecido"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Atualizada:</span>
                  <p className="font-medium">
                    {formatDate(task.updatedAt) || "Desconhecido"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

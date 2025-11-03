"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { useUpdateTaskStatus, useDeleteTask } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import type { Task } from "@/lib/zod-schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();

  const handleToggleStatus = () => {
    setIsUpdatingStatus(true);
    const newStatus = task.status === "pending" ? "done" : "pending";

    updateStatus.mutate(
      {
        id: task.id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast({
            title: "Status atualizado!",
            description: `Tarefa marcada como ${
              newStatus === "done" ? "concluída" : "pendente"
            }.`,
          });
        },
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Erro ao atualizar status",
            description: error.message,
          });
        },
        onSettled: () => {
          setIsUpdatingStatus(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast({
          title: "Tarefa excluída!",
          description: "A tarefa foi removida com sucesso.",
        });
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao excluir tarefa",
          description: error.message,
        });
      },
    });
  };

  const formatDueDate = (date: string | null) => {
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

  const dueDateText = task.dueDate ? formatDueDate(task.dueDate) : null;
  const isOverdue =
    task.dueDate &&
    task.status === "pending" &&
    new Date(task.dueDate) < new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 mt-0.5"
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
            >
              {task.status === "done" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-base mb-1 ${
                  task.status === "done"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </CardContent>

      {dueDateText && (
        <CardFooter className="pt-0">
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isOverdue ? "text-red-600" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{dueDateText}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

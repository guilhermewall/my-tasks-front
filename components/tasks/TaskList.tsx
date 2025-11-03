"use client";

import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskFilters } from "./TaskFilters";
import { TaskForm } from "@/components/forms/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTasks } from "@/hooks/useTasks";
import { Plus, Loader2 } from "lucide-react";
import type { Task, TaskFilters as TaskFiltersType } from "@/lib/zod-schemas";

export function TaskList() {
  const [filters, setFilters] = useState<TaskFiltersType>({
    limit: 10,
    sortOrder: "desc",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data, isLoading, error } = useTasks(filters);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditDialog = () => {
    setEditingTask(null);
  };

  const handleLoadMore = () => {
    if (data?.pageInfo.nextCursor) {
      setFilters((prev) => ({
        ...prev,
        cursor: data.pageInfo.nextCursor || undefined,
      }));
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-2">Erro ao carregar tarefas</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Minhas Tarefas</h2>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e acompanhe seu progresso
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova tarefa
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && data?.data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {filters.search || filters.status
              ? "Nenhuma tarefa encontrada com os filtros aplicados"
              : "Você ainda não tem tarefas"}
          </p>
          {!filters.search && !filters.status && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira tarefa
            </Button>
          )}
        </div>
      )}

      {!isLoading && data && data.data.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>

          {data.pageInfo.hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  "Carregar mais"
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dialog para criar tarefa */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova tarefa
            </DialogDescription>
          </DialogHeader>
          <TaskForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar tarefa */}
      <Dialog open={!!editingTask} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar tarefa</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da tarefa
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm task={editingTask} onSuccess={handleCloseEditDialog} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

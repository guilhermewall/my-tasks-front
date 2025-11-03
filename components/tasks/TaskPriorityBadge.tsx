import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskPriorityBadgeProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: "Baixa",
      variant: "outline" as const,
      className: "border-gray-300 text-gray-700",
    },
    medium: {
      label: "Média",
      variant: "outline" as const,
      className: "border-blue-300 text-blue-700",
    },
    high: {
      label: "Alta",
      variant: "outline" as const,
      className: "border-red-300 text-red-700",
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

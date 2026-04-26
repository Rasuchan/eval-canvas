import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EvaluationStatus } from "@/types";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";

const config: Record<
  EvaluationStatus,
  { label: string; icon: typeof CheckCircle2; classes: string }
> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    classes: "bg-success/15 text-success border-success/30",
  },
  running: {
    label: "Running",
    icon: Loader2,
    classes: "bg-info/15 text-info border-info/30",
  },
  failure: {
    label: "Failed",
    icon: XCircle,
    classes: "bg-destructive/15 text-destructive border-destructive/30",
  },
  queued: {
    label: "Queued",
    icon: Clock,
    classes: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", c.classes)}
    >
      <Icon className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      {c.label}
    </Badge>
  );
}

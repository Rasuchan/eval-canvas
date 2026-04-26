import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResponseItem } from "@/types";

export function ResponseCard({
  response,
  isBest,
}: {
  response: ResponseItem;
  isBest?: boolean;
}) {
  return (
    <Card
      className={cn(
        "h-full transition-all",
        isBest && "ring-2 ring-success/50 shadow-lg shadow-success/10",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          {isBest && <Crown className="h-4 w-4 text-success shrink-0" />}
          <span className="font-mono text-xs font-semibold truncate">
            {response.model}
          </span>
        </div>
        <ScoreBadge score={response.score} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {response.output}
        </p>
        {response.rationale && (
          <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground border-l-2 border-primary/50">
            <span className="font-medium text-foreground">Rationale: </span>
            {response.rationale}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

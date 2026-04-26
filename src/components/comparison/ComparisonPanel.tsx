import { ResponseCard } from "./ResponseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvaluationItem } from "@/types";

export function ComparisonPanel({ item }: { item: EvaluationItem }) {
  const bestId = [...item.responses].sort((a, b) => b.score - a.score)[0]?.id;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed">{item.prompt}</p>
          {item.reference && (
            <div className="rounded-md bg-accent/40 px-3 py-2 text-xs">
              <span className="font-semibold text-foreground">Reference: </span>
              <span className="text-muted-foreground">{item.reference}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {item.responses.map((r) => (
          <ResponseCard key={r.id} response={r} isBest={r.id === bestId} />
        ))}
      </div>
    </div>
  );
}

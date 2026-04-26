import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsBar, MetricsTrend } from "@/components/charts/MetricsChart";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/services/api";
import { generateDetail } from "@/services/mock";
import { formatPercent } from "@/utils/format";

export const Route = createFileRoute("/metrics")({
  head: () => ({
    meta: [
      { title: "Metrics — EvalOps" },
      { name: "description", content: "Aggregated quality metrics across all evaluation runs." },
    ],
  }),
  component: MetricsPage,
});

function MetricsPage() {
  const { runs, setRuns } = useAppStore();

  useEffect(() => {
    if (runs.length === 0) api.listResults().then(setRuns).catch(() => {});
  }, [runs.length, setRuns]);

  const aggregated = useMemo(() => {
    const ok = runs.filter((r) => r.metrics);
    if (ok.length === 0) return { accuracy: 0, relevance: 0, tone: 0 };
    return {
      accuracy: ok.reduce((s, r) => s + r.metrics!.accuracy, 0) / ok.length,
      relevance: ok.reduce((s, r) => s + r.metrics!.relevance, 0) / ok.length,
      tone: ok.reduce((s, r) => s + r.metrics!.tone, 0) / ok.length,
    };
  }, [runs]);

  const trend = generateDetail("agg").trend;

  const barData = [
    { name: "Accuracy", value: aggregated.accuracy },
    { name: "Relevance", value: aggregated.relevance },
    { name: "Tone", value: aggregated.tone },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Metrics dashboard"
        description="Quality signals aggregated across all your evaluation runs."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {barData.map((b) => (
          <Card key={b.name}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{b.name}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-semibold tabular-nums">{formatPercent(b.value)}</span>
                <ScoreBadge score={b.value} size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Average by metric</CardTitle></CardHeader>
          <CardContent><MetricsBar data={barData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Trend over time</CardTitle></CardHeader>
          <CardContent><MetricsTrend data={trend} /></CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

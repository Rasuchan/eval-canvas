import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/evaluation/StatusBadge";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { MetricsTrend } from "@/components/charts/MetricsChart";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/services/api";
import { generateDetail } from "@/services/mock";
import { formatDate } from "@/utils/format";
import { ArrowRight, Database, PlayCircle, ListChecks, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — EvalOps" },
      { name: "description", content: "EvalOps dashboard: evaluation runs, metrics, and dataset overview." },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Database;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </p>
          <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { datasets, runs, setDatasets, setRuns } = useAppStore();

  useEffect(() => {
    api.listDatasets().then(setDatasets).catch(() => {});
    api.listResults().then(setRuns).catch(() => {});
  }, [setDatasets, setRuns]);

  const successRuns = runs.filter((r) => r.status === "success");
  const avgAccuracy =
    successRuns.reduce((s, r) => s + (r.metrics?.accuracy ?? 0), 0) /
    Math.max(1, successRuns.length);
  const trend = generateDetail("run_8421").trend;
  const recent = runs.slice(0, 5);

  return (
    <AppLayout>
      <PageHeader
        title="Welcome back"
        description="Monitor your LLM evaluations, datasets, and quality metrics."
        actions={
          <Button asChild>
            <Link to="/evaluate">
              <PlayCircle className="h-4 w-4" /> New evaluation
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Database} label="Datasets" value={datasets.length} hint="Available for evaluation" />
        <StatCard icon={PlayCircle} label="Total Runs" value={runs.length} hint="All-time evaluations" />
        <StatCard icon={ListChecks} label="Successful" value={successRuns.length} hint={`${runs.length ? Math.round((successRuns.length / runs.length) * 100) : 0}% success rate`} />
        <StatCard icon={TrendingUp} label="Avg Accuracy" value={`${(avgAccuracy * 100).toFixed(1)}%`} hint="Across successful runs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Quality trend (7d)</CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <Legend color="var(--color-primary)" label="Accuracy" />
              <Legend color="var(--color-info)" label="Relevance" />
              <Legend color="var(--color-success)" label="Tone" />
            </div>
          </CardHeader>
          <CardContent>
            <MetricsTrend data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent runs</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/results">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No runs yet.</p>
            )}
            {recent.map((r) => (
              <Link
                key={r.id}
                to="/results/$id"
                params={{ id: r.id }}
                className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-muted/60 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-mono font-medium truncate">{r.id}</p>
                  <p className="text-xs text-muted-foreground truncate">{formatDate(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.metrics && <ScoreBadge score={r.metrics.accuracy} size="sm" />}
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

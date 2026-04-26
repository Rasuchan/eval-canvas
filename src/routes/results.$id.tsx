import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/evaluation/StatusBadge";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { ComparisonPanel } from "@/components/comparison/ComparisonPanel";
import { MetricsBar, MetricsTrend } from "@/components/charts/MetricsChart";
import { api } from "@/services/api";
import type { EvaluationDetail } from "@/types";
import { formatDate, formatDuration, formatPercent } from "@/utils/format";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/results/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Run ${params.id} — EvalOps` },
      { name: "description", content: `Evaluation detail for run ${params.id}.` },
    ],
  }),
  component: ResultDetailPage,
});

function ResultDetailPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<EvaluationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    api.getResult(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/results">Back to results</Link>
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </AppLayout>
    );
  }

  const metricsBar = [
    { name: "Accuracy", value: data.metrics?.accuracy ?? 0 },
    { name: "Relevance", value: data.metrics?.relevance ?? 0 },
    { name: "Tone", value: data.metrics?.tone ?? 0 },
  ];

  return (
    <AppLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/results"><ArrowLeft className="h-4 w-4" /> All results</Link>
      </Button>

      <PageHeader
        title={`Run ${data.id}`}
        description={`${data.datasetName} · ${formatDate(data.createdAt)}`}
        actions={<StatusBadge status={data.status} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Accuracy" value={data.metrics?.accuracy ?? 0} />
        <MetricCard label="Relevance" value={data.metrics?.relevance ?? 0} />
        <MetricCard label="Tone" value={data.metrics?.tone ?? 0} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
          <TabsTrigger value="raw">Raw data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Metrics breakdown</CardTitle></CardHeader>
              <CardContent><MetricsBar data={metricsBar} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Trend (7d)</CardTitle></CardHeader>
              <CardContent><MetricsTrend data={data.trend} /></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Run details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Detail label="Type" value={<Badge variant="secondary" className="capitalize">{data.type}</Badge>} />
                <Detail label="Items" value={data.items.length} />
                <Detail label="Duration" value={formatDuration(data.durationMs)} />
                <Detail label="Dataset" value={data.datasetName} />
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparisons" className="space-y-6">
          {data.items.map((item, i) => (
            <div key={item.id}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Item {i + 1} of {data.items.length}
              </p>
              <ComparisonPanel item={item} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardContent className="p-4">
              <pre className="text-xs font-mono bg-muted/40 rounded-md p-4 overflow-auto max-h-[600px]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-semibold tabular-nums">{formatPercent(value)}</span>
          <ScoreBadge score={value} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

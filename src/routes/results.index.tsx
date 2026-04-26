import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/evaluation/StatusBadge";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/services/api";
import { formatDate, formatDuration } from "@/utils/format";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/results/")({
  head: () => ({
    meta: [
      { title: "Results — EvalOps" },
      { name: "description", content: "Browse all evaluation runs and their status." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { runs, setRuns } = useAppStore();

  useEffect(() => {
    if (runs.length === 0) {
      api.listResults().then(setRuns).catch(() => {});
    }
  }, [runs.length, setRuns]);

  return (
    <AppLayout>
      <PageHeader
        title="Evaluation results"
        description="All evaluation runs across your datasets."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.length === 0 &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {runs.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs font-semibold">{r.id}</TableCell>
                  <TableCell className="text-sm">{r.datasetName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{r.type}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>
                    {r.metrics ? <ScoreBadge score={r.metrics.accuracy} size="sm" /> : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{formatDuration(r.durationMs)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/results/$id"
                      params={{ id: r.id }}
                      className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                    >
                      Open <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

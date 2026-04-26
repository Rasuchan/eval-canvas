import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationForm } from "@/components/evaluation/EvaluationForm";

export const Route = createFileRoute("/evaluate")({
  head: () => ({
    meta: [
      { title: "Run Evaluation — EvalOps" },
      { name: "description", content: "Configure and launch a new LLM evaluation run." },
    ],
  }),
  component: EvaluatePage,
});

function EvaluatePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Run evaluation"
        description="Configure dataset, evaluation type, and models to compare."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluationForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <Step n={1} title="Select a dataset">
              Pick from your uploaded datasets. Each row becomes one evaluation item.
            </Step>
            <Step n={2} title="Choose evaluation type">
              Pairwise compares two responses. Scoring assigns 0–1 ratings. Multi-response and rubric give richer breakdowns.
            </Step>
            <Step n={3} title="Pick models">
              Select 2+ models. We'll generate responses and score them automatically.
            </Step>
            <Step n={4} title="Review results">
              See per-item comparisons, aggregate metrics, and rationales side by side.
            </Step>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
        {n}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs">{children}</p>
      </div>
    </div>
  );
}

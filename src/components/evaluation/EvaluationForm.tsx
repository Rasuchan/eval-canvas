import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import type { EvaluationType } from "@/types";
import { toast } from "sonner";
import { Loader2, PlayCircle } from "lucide-react";

const EVAL_TYPES: { value: EvaluationType; label: string; desc: string }[] = [
  { value: "pairwise", label: "Pairwise", desc: "Compare two responses head-to-head" },
  { value: "scoring", label: "Scoring", desc: "Numerical 0–1 score per response" },
  { value: "multi-response", label: "Multi-response", desc: "Compare 3+ responses" },
  { value: "rubric", label: "Rubric", desc: "Multi-criteria rubric scoring" },
];

const MODELS = ["gpt-4o", "claude-3.5-sonnet", "llama-3.1-70b", "gemini-1.5-pro"];

interface FormValues {
  datasetId: string;
  type: EvaluationType;
  notes: string;
}

export function EvaluationForm() {
  const navigate = useNavigate();
  const { datasets, setDatasets, addRun, updateRunStatus } = useAppStore();
  const [models, setModels] = useState<string[]>(["gpt-4o", "claude-3.5-sonnet"]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormValues>({ defaultValues: { type: "pairwise", notes: "" } });

  useEffect(() => {
    if (datasets.length === 0) {
      api.listDatasets().then(setDatasets).catch(() => {});
    }
  }, [datasets.length, setDatasets]);

  const datasetId = watch("datasetId");
  const type = watch("type");

  const toggleModel = (m: string) =>
    setModels((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const onSubmit = async (values: FormValues) => {
    if (!values.datasetId) {
      toast.error("Select a dataset");
      return;
    }
    if (models.length < 2) {
      toast.error("Select at least 2 models to compare");
      return;
    }
    setSubmitting(true);
    try {
      const run = await api.runEvaluation({
        datasetId: values.datasetId,
        type: values.type,
        models,
        notes: values.notes,
      });
      addRun(run);
      toast.success(`Evaluation ${run.id} started`);
      // simulate completion
      setTimeout(() => updateRunStatus(run.id, "success"), 2500);
      navigate({ to: "/results/$id", params: { id: run.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Dataset</Label>
        <Select
          value={datasetId}
          onValueChange={(v) => setValue("datasetId", v, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a dataset" />
          </SelectTrigger>
          <SelectContent>
            {datasets.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name} · {d.rows} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("datasetId", { required: true })} />
        {errors.datasetId && (
          <p className="text-xs text-destructive">Dataset is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Evaluation type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EVAL_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue("type", t.value)}
              className={`text-left rounded-lg border p-3 transition-colors ${
                type === t.value
                  ? "border-primary bg-accent/60"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Models to evaluate</Label>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 rounded-md border border-border p-2.5 cursor-pointer hover:bg-muted/50"
            >
              <Checkbox
                checked={models.includes(m)}
                onCheckedChange={() => toggleModel(m)}
              />
              <span className="text-sm font-medium">{m}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={3}
          maxLength={500}
          placeholder="Context for this run..."
          {...register("notes", { maxLength: 500 })}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlayCircle className="h-4 w-4" />
        )}
        {submitting ? "Starting..." : "Start evaluation"}
      </Button>
    </form>
  );
}

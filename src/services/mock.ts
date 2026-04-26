import type { Dataset, EvaluationDetail, EvaluationRun } from "@/types";

export const mockDatasets = (): Dataset[] => [
  {
    id: "ds_001",
    name: "support_tickets_q1.csv",
    rows: 1240,
    format: "csv",
    uploadedAt: "2025-04-12T09:14:00Z",
    size: "184.2 KB",
  },
  {
    id: "ds_002",
    name: "rag_eval_questions.json",
    rows: 480,
    format: "json",
    uploadedAt: "2025-04-18T16:02:00Z",
    size: "92.7 KB",
  },
  {
    id: "ds_003",
    name: "summarization_long_docs.csv",
    rows: 312,
    format: "csv",
    uploadedAt: "2025-04-22T11:48:00Z",
    size: "612.0 KB",
  },
];

export const mockRuns = (): EvaluationRun[] => [
  {
    id: "run_8421",
    datasetId: "ds_001",
    datasetName: "support_tickets_q1.csv",
    type: "pairwise",
    status: "success",
    createdAt: "2025-04-24T10:21:00Z",
    durationMs: 184_000,
    metrics: { accuracy: 0.91, relevance: 0.88, tone: 0.94 },
  },
  {
    id: "run_8422",
    datasetId: "ds_002",
    datasetName: "rag_eval_questions.json",
    type: "scoring",
    status: "success",
    createdAt: "2025-04-25T08:02:00Z",
    durationMs: 142_000,
    metrics: { accuracy: 0.84, relevance: 0.92, tone: 0.81 },
  },
  {
    id: "run_8423",
    datasetId: "ds_003",
    datasetName: "summarization_long_docs.csv",
    type: "multi-response",
    status: "running",
    createdAt: "2025-04-26T07:30:00Z",
  },
  {
    id: "run_8424",
    datasetId: "ds_001",
    datasetName: "support_tickets_q1.csv",
    type: "rubric",
    status: "failure",
    createdAt: "2025-04-25T19:11:00Z",
    durationMs: 24_000,
  },
];

const sampleResponses = [
  {
    model: "gpt-4o",
    output:
      "To reset your password, go to Settings → Security → Reset Password. You'll receive an email with a secure link valid for 30 minutes.",
    score: 0.94,
    rationale: "Accurate, concise, includes link expiration detail.",
  },
  {
    model: "claude-3.5-sonnet",
    output:
      "You can reset your password from your account settings page. Look for the security section and click 'Reset Password'.",
    score: 0.81,
    rationale: "Correct but missing email/expiry details.",
  },
  {
    model: "llama-3.1-70b",
    output:
      "Try clicking forgot password on the login screen and follow the instructions.",
    score: 0.62,
    rationale: "Generic, lacks app-specific guidance.",
  },
];

export const generateDetail = (id: string): EvaluationDetail => {
  const base =
    mockRuns().find((r) => r.id === id) ?? {
      id,
      datasetId: "ds_001",
      datasetName: "support_tickets_q1.csv",
      type: "pairwise" as const,
      status: "success" as const,
      createdAt: new Date().toISOString(),
      durationMs: 120_000,
      metrics: { accuracy: 0.9, relevance: 0.86, tone: 0.92 },
    };

  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: `item_${i + 1}`,
    prompt:
      i === 0
        ? "How do I reset my password on the platform?"
        : `Sample evaluation prompt #${i + 1} — describe the expected behavior of the model.`,
    reference:
      i === 0
        ? "User should be directed to Settings → Security → Reset Password."
        : undefined,
    responses: sampleResponses.map((r, idx) => ({
      id: `resp_${i}_${idx}`,
      ...r,
      score: Math.max(0.4, Math.min(1, r.score + (Math.random() - 0.5) * 0.1)),
    })),
  }));

  const trend = Array.from({ length: 7 }).map((_, i) => ({
    day: `D-${6 - i}`,
    accuracy: 0.7 + Math.random() * 0.25,
    relevance: 0.7 + Math.random() * 0.25,
    tone: 0.7 + Math.random() * 0.25,
  }));

  return {
    ...base,
    metrics: base.metrics ?? { accuracy: 0.9, relevance: 0.86, tone: 0.92 },
    items,
    trend,
  };
};

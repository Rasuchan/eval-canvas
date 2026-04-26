export interface Dataset {
  id: string;
  name: string;
  rows: number;
  format: "csv" | "json";
  uploadedAt: string;
  size: string;
}

export type EvaluationStatus = "queued" | "running" | "success" | "failure";
export type EvaluationType = "pairwise" | "scoring" | "multi-response" | "rubric";

export interface EvaluationRun {
  id: string;
  datasetId: string;
  datasetName: string;
  type: EvaluationType;
  status: EvaluationStatus;
  createdAt: string;
  durationMs?: number;
  metrics?: {
    accuracy: number;
    relevance: number;
    tone: number;
  };
}

export interface ResponseItem {
  id: string;
  model: string;
  output: string;
  score: number;
  rationale?: string;
}

export interface EvaluationItem {
  id: string;
  prompt: string;
  reference?: string;
  responses: ResponseItem[];
}

export interface EvaluationDetail extends EvaluationRun {
  items: EvaluationItem[];
  trend: { day: string; accuracy: number; relevance: number; tone: number }[];
}

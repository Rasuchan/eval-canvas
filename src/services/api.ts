import axios from "axios";
import type {
  Dataset,
  EvaluationDetail,
  EvaluationRun,
  EvaluationType,
} from "@/types";
import { mockDatasets, mockRuns, generateDetail } from "./mock";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    const message =
      error?.response?.data?.detail ??
      error?.message ??
      "Unexpected network error";
    return Promise.reject(new Error(message));
  },
);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async listDatasets(): Promise<Dataset[]> {
    if (USE_MOCK) {
      await delay(300);
      return mockDatasets();
    }
    const { data } = await apiClient.get<Dataset[]>("/datasets");
    return data;
  },

  async uploadDataset(file: File): Promise<Dataset> {
    if (USE_MOCK) {
      await delay(800);
      const ds: Dataset = {
        id: `ds_${Date.now()}`,
        name: file.name,
        rows: Math.floor(Math.random() * 900) + 100,
        format: file.name.endsWith(".json") ? "json" : "csv",
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
      };
      return ds;
    }
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<Dataset>("/upload-dataset", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async runEvaluation(payload: {
    datasetId: string;
    type: EvaluationType;
    models: string[];
    notes?: string;
  }): Promise<EvaluationRun> {
    if (USE_MOCK) {
      await delay(900);
      const run: EvaluationRun = {
        id: `run_${Date.now()}`,
        datasetId: payload.datasetId,
        datasetName:
          mockDatasets().find((d) => d.id === payload.datasetId)?.name ??
          "Dataset",
        type: payload.type,
        status: "running",
        createdAt: new Date().toISOString(),
      };
      return run;
    }
    const { data } = await apiClient.post<EvaluationRun>(
      "/run-evaluation",
      payload,
    );
    return data;
  },

  async listResults(): Promise<EvaluationRun[]> {
    if (USE_MOCK) {
      await delay(300);
      return mockRuns();
    }
    const { data } = await apiClient.get<EvaluationRun[]>("/results");
    return data;
  },

  async getResult(id: string): Promise<EvaluationDetail> {
    if (USE_MOCK) {
      await delay(400);
      return generateDetail(id);
    }
    const { data } = await apiClient.get<EvaluationDetail>(`/results/${id}`);
    return data;
  },
};

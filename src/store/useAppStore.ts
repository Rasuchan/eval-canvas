import { create } from "zustand";
import type { Dataset, EvaluationRun } from "@/types";

interface AppState {
  selectedDatasetId: string | null;
  setSelectedDataset: (id: string | null) => void;

  datasets: Dataset[];
  setDatasets: (d: Dataset[]) => void;
  addDataset: (d: Dataset) => void;

  runs: EvaluationRun[];
  setRuns: (r: EvaluationRun[]) => void;
  addRun: (r: EvaluationRun) => void;
  updateRunStatus: (id: string, status: EvaluationRun["status"]) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedDatasetId: null,
  setSelectedDataset: (id) => set({ selectedDatasetId: id }),

  datasets: [],
  setDatasets: (datasets) => set({ datasets }),
  addDataset: (d) => set((s) => ({ datasets: [d, ...s.datasets] })),

  runs: [],
  setRuns: (runs) => set({ runs }),
  addRun: (r) => set((s) => ({ runs: [r, ...s.runs] })),
  updateRunStatus: (id, status) =>
    set((s) => ({
      runs: s.runs.map((r) => (r.id === id ? { ...r, status } : r)),
    })),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

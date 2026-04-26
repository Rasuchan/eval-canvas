import { useCallback, useState } from "react";
import { Upload, FileJson, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function DatasetUploader() {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const addDataset = useAppStore((s) => s.addDataset);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const ok = /\.(csv|json)$/i.test(file.name);
      if (!ok) {
        toast.error("Only .csv or .json files are supported");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File too large (max 20 MB)");
        return;
      }
      setUploading(true);
      try {
        const ds = await api.uploadDataset(file);
        addDataset(ds);
        toast.success(`Uploaded ${ds.name}`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [addDataset],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
        dragOver
          ? "border-primary bg-accent/50"
          : "border-border bg-muted/30 hover:bg-muted/50",
      )}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {uploading ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="text-center">
        <p className="font-medium text-sm">
          {uploading ? "Uploading..." : "Drop CSV or JSON, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Max 20 MB · Schema auto-detected
        </p>
      </div>
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3 w-3" /> .csv
        </span>
        <span className="inline-flex items-center gap-1">
          <FileJson className="h-3 w-3" /> .json
        </span>
      </div>
      <Button type="button" variant="outline" size="sm" disabled={uploading}>
        Choose file
      </Button>
      <input
        type="file"
        accept=".csv,.json,application/json,text/csv"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
    </label>
  );
}

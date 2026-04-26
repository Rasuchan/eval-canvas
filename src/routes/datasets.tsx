import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatasetUploader } from "@/components/dataset/DatasetUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/services/api";
import { formatDate } from "@/utils/format";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/datasets")({
  head: () => ({
    meta: [
      { title: "Datasets — EvalOps" },
      { name: "description", content: "Upload and manage evaluation datasets." },
    ],
  }),
  component: DatasetsPage,
});

function DatasetsPage() {
  const { datasets, setDatasets, selectedDatasetId, setSelectedDataset } = useAppStore();

  useEffect(() => {
    if (datasets.length === 0) {
      api.listDatasets().then(setDatasets).catch(() => {});
    }
  }, [datasets.length, setDatasets]);

  return (
    <AppLayout>
      <PageHeader
        title="Datasets"
        description="Upload CSV or JSON datasets to use across evaluations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <DatasetUploader />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All datasets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                        No datasets yet. Upload your first one →
                      </TableCell>
                    </TableRow>
                  )}
                  {datasets.map((d) => {
                    const isSelected = selectedDatasetId === d.id;
                    return (
                      <TableRow key={d.id} className={cn(isSelected && "bg-accent/40")}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{d.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="uppercase text-[10px]">{d.format}</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{d.rows.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{d.size}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{formatDate(d.uploadedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => setSelectedDataset(isSelected ? null : d.id)}
                          >
                            {isSelected ? <><Check className="h-3 w-3" /> Selected</> : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

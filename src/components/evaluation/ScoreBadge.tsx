import { cn } from "@/lib/utils";

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const pct = score * 100;
  const tone =
    pct >= 85
      ? "bg-success/15 text-success border-success/30"
      : pct >= 70
      ? "bg-info/15 text-info border-info/30"
      : pct >= 55
      ? "bg-warning/15 text-warning-foreground border-warning/40"
      : "bg-destructive/15 text-destructive border-destructive/30";

  const sizing =
    size === "lg"
      ? "text-base px-3 py-1"
      : size === "sm"
      ? "text-[11px] px-1.5 py-0.5"
      : "text-xs px-2 py-0.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tabular-nums",
        tone,
        sizing,
      )}
    >
      {pct.toFixed(1)}
    </span>
  );
}

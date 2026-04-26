import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MetricsBarProps {
  data: { name: string; value: number }[];
}

export function MetricsBar({ data }: MetricsBarProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 1]} />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
        />
        <Bar
          dataKey="value"
          fill="var(--color-primary)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MetricsTrendProps {
  data: { day: string; accuracy: number; relevance: number; tone: number }[];
}

export function MetricsTrend({ data }: MetricsTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 1]} />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
        />
        <Line type="monotone" dataKey="accuracy" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="relevance" stroke="var(--color-info)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="tone" stroke="var(--color-success)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

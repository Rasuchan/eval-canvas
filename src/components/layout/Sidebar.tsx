import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Database,
  PlayCircle,
  ListChecks,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/datasets", label: "Datasets", icon: Database },
  { to: "/evaluate", label: "Run Evaluation", icon: PlayCircle },
  { to: "/results", label: "Results", icon: ListChecks },
  { to: "/metrics", label: "Metrics", icon: BarChart3 },
] as const;

export function Sidebar() {
  const location = useLocation();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "border-r border-border bg-card flex flex-col transition-[width] duration-200 ease-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">EvalOps</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              LLM Evaluation
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Mock mode</p>
            Set <code className="text-[10px]">VITE_USE_MOCK=false</code> to hit your FastAPI backend.
          </div>
        </div>
      )}
    </aside>
  );
}

import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";

export function Navbar() {
  const toggle = useAppStore((s) => s.toggleSidebar);
  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center px-4 gap-3 sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative max-w-md flex-1 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search datasets, runs, models..."
          className="pl-9 bg-muted/40 border-transparent focus-visible:bg-card"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-primary-foreground text-sm font-semibold">
          EO
        </div>
      </div>
    </header>
  );
}

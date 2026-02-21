import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Recycle,
  BookOpen,
  Users,
  Globe,
  Menu,
  X,
  LogOut,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/cells", label: "Cells", icon: Map },
  { path: "/loop", label: "Loop Tracker", icon: Recycle },
  { path: "/metrics", label: "Metrics", icon: BarChart3 },
  { path: "/knowledge", label: "Knowledge", icon: BookOpen },
  { path: "/governance", label: "Governance", icon: Users },
  { path: "/map", label: "Global Map", icon: Globe },
  { path: "/replicate", label: "Replicate", icon: Copy },
];

const AppSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="font-mono text-lg font-bold text-sidebar-foreground tracking-tight">
            <span className="text-sidebar-primary">⌬</span> GRACE
          </h1>
          <p className="text-xs text-sidebar-foreground/60 font-mono mt-0.5">
            protocol v0.1
          </p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          {user && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sidebar-foreground/60 truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
          <div className="text-xs font-mono text-sidebar-foreground/40">
            open protocol
            <br />
            forkable · decentralized
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;

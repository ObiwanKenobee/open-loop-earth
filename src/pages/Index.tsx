import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import LoopDiagram from "@/components/LoopDiagram";
import { Map, Users, Recycle, TrendingUp, Leaf, DollarSign } from "lucide-react";

const recentActivity = [
  { time: "2h ago", text: "Cell #047 (Nairobi) completed loop cycle #12", type: "loop" },
  { time: "5h ago", text: "New cell registered in São Paulo", type: "cell" },
  { time: "1d ago", text: "Governance proposal #23 passed (87% yes)", type: "gov" },
  { time: "1d ago", text: "Cell #031 (Dhaka) reached 500kg waste milestone", type: "metric" },
  { time: "2d ago", text: "Knowledge base updated: Vermiculture Guide v2", type: "knowledge" },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            GRACE Protocol <span className="text-muted-foreground font-normal text-lg">// overview</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global Regenerative Alliance for Community Economics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            label="Active Cells"
            value={127}
            icon={<Map size={18} />}
            trend={{ value: 12, label: "mo" }}
          />
          <StatCard
            label="Total Members"
            value="3,841"
            icon={<Users size={18} />}
            trend={{ value: 8, label: "mo" }}
          />
          <StatCard
            label="Waste Converted"
            value="48.2"
            unit="tonnes"
            icon={<Recycle size={18} />}
            trend={{ value: 23, label: "mo" }}
          />
          <StatCard
            label="Food Produced"
            value="12.7"
            unit="tonnes"
            icon={<Leaf size={18} />}
            trend={{ value: 15, label: "mo" }}
          />
          <StatCard
            label="Revenue Generated"
            value="$94K"
            icon={<DollarSign size={18} />}
            trend={{ value: 18, label: "mo" }}
          />
          <StatCard
            label="Loop Completion"
            value="78"
            unit="%"
            icon={<TrendingUp size={18} />}
            trend={{ value: 5, label: "mo" }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Loop Diagram */}
          <div className="lg:col-span-3">
            <LoopDiagram />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-md p-4">
              <h3 className="font-mono text-sm font-semibold text-foreground mb-4">
                // recent_activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap mt-0.5">
                      {item.time}
                    </span>
                    <p className="text-foreground/80">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Protocol status */}
        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="font-mono text-sm font-semibold text-foreground mb-3">
            // protocol_status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs font-mono">replication_rate</p>
              <p className="font-mono font-semibold text-moss">3.2 cells/mo</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono">avg_loop_time</p>
              <p className="font-mono font-semibold text-foreground">42 days</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono">governance_proposals</p>
              <p className="font-mono font-semibold text-foreground">7 active</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-mono">api_requests_24h</p>
              <p className="font-mono font-semibold text-foreground">12,847</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;

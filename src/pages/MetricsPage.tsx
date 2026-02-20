import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Recycle, Leaf, DollarSign, TrendingUp, Users, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const monthlyData = [
  { month: "Sep", waste: 3200, food: 1100, revenue: 6800 },
  { month: "Oct", waste: 3800, food: 1300, revenue: 7900 },
  { month: "Nov", waste: 4100, food: 1500, revenue: 8400 },
  { month: "Dec", waste: 3900, food: 1400, revenue: 8100 },
  { month: "Jan", waste: 4400, food: 1700, revenue: 9200 },
  { month: "Feb", waste: 4820, food: 1900, revenue: 9400 },
];

const MetricsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Metrics <span className="text-muted-foreground font-normal text-lg">// impact_data</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregated impact data across all active cells
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard label="Waste Converted (total)" value="48.2" unit="t" icon={<Recycle size={18} />} trend={{ value: 23, label: "mo" }} />
          <StatCard label="Food Produced (total)" value="12.7" unit="t" icon={<Leaf size={18} />} trend={{ value: 15, label: "mo" }} />
          <StatCard label="Revenue (total)" value="$94K" icon={<DollarSign size={18} />} trend={{ value: 18, label: "mo" }} />
          <StatCard label="CO₂ Offset Est." value="14.3" unit="t" icon={<Globe size={18} />} trend={{ value: 20, label: "mo" }} />
          <StatCard label="Avg. Income Delta" value="+$38" icon={<TrendingUp size={18} />} trend={{ value: 12, label: "mo" }} />
          <StatCard label="Community Members" value="3,841" icon={<Users size={18} />} trend={{ value: 8, label: "mo" }} />
        </div>

        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="font-mono text-sm font-semibold text-foreground mb-4">
            // monthly_trends (kg)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={2}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.375rem",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="waste" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} name="Waste (kg)" />
                <Bar dataKey="food" fill="hsl(var(--moss))" radius={[2, 2, 0, 0]} name="Food (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MetricsPage;

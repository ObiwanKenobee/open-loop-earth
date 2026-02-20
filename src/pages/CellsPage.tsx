import DashboardLayout from "@/components/DashboardLayout";
import { MapPin, Users, Recycle, Sprout, DollarSign, ArrowRight } from "lucide-react";

const cells = [
  { id: "047", name: "Kibera Green Loop", location: "Nairobi, Kenya", members: 34, waste: 420, food: 180, revenue: 2800, status: "active" },
  { id: "031", name: "Dhaka Circular", location: "Dhaka, Bangladesh", members: 28, waste: 510, food: 210, revenue: 3100, status: "active" },
  { id: "055", name: "Favela Sustentável", location: "São Paulo, Brazil", members: 19, waste: 280, food: 95, revenue: 1400, status: "growing" },
  { id: "012", name: "Manila Roots", location: "Manila, Philippines", members: 41, waste: 620, food: 290, revenue: 4200, status: "active" },
  { id: "068", name: "Lagos Regenerate", location: "Lagos, Nigeria", members: 15, waste: 180, food: 60, revenue: 800, status: "new" },
  { id: "003", name: "Detroit Soil Collective", location: "Detroit, USA", members: 22, waste: 340, food: 150, revenue: 2200, status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-moss/15 text-moss",
  growing: "bg-warm/15 text-warm",
  new: "bg-primary/15 text-primary",
};

const CellsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Cells <span className="text-muted-foreground font-normal text-lg">// active_nodes</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cells.length} registered cells across 6 regions
          </p>
        </div>

        <div className="space-y-2">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="bg-card border border-border rounded-md p-4 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">#{cell.id}</span>
                    <h3 className="font-mono text-sm font-semibold text-foreground truncate">
                      {cell.name}
                    </h3>
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${statusColors[cell.status]}`}>
                      {cell.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {cell.location}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground" title="Members">
                    <Users size={14} />
                    <span className="font-mono">{cell.members}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground" title="Waste (kg/mo)">
                    <Recycle size={14} />
                    <span className="font-mono">{cell.waste}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground" title="Food (kg/mo)">
                    <Sprout size={14} />
                    <span className="font-mono">{cell.food}</span>
                  </div>
                  <div className="flex items-center gap-1 text-moss" title="Revenue ($/mo)">
                    <DollarSign size={14} />
                    <span className="font-mono">{cell.revenue}</span>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CellsPage;

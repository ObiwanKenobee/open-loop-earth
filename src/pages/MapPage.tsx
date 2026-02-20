import DashboardLayout from "@/components/DashboardLayout";
import { Globe } from "lucide-react";

const regions = [
  { name: "East Africa", cells: 34, members: 1020, color: "bg-moss" },
  { name: "South Asia", cells: 28, members: 840, color: "bg-primary" },
  { name: "Latin America", cells: 22, members: 660, color: "bg-warm" },
  { name: "Southeast Asia", cells: 19, members: 570, color: "bg-earth" },
  { name: "West Africa", cells: 15, members: 450, color: "bg-accent" },
  { name: "North America", cells: 9, members: 301, color: "bg-muted-foreground" },
];

const MapPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Global Map <span className="text-muted-foreground font-normal text-lg">// network_view</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            127 active cells across 6 regions
          </p>
        </div>

        {/* Map placeholder */}
        <div className="bg-card border border-border rounded-md p-8 flex flex-col items-center justify-center min-h-[300px]">
          <Globe size={48} className="text-muted-foreground/30 mb-4" />
          <p className="font-mono text-sm text-muted-foreground text-center">
            Interactive map view
            <br />
            <span className="text-xs text-muted-foreground/60">// requires MapLibre integration — Phase 2</span>
          </p>
        </div>

        {/* Region breakdown */}
        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="font-mono text-sm font-semibold text-foreground mb-4">
            // regional_distribution
          </h3>
          <div className="space-y-3">
            {regions.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${r.color} shrink-0`} />
                <span className="font-mono text-sm text-foreground w-36">{r.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${r.color} rounded-full`}
                    style={{ width: `${(r.cells / 34) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground w-20 text-right">
                  {r.cells} cells
                </span>
                <span className="font-mono text-xs text-muted-foreground/60 w-20 text-right">
                  {r.members} ppl
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapPage;

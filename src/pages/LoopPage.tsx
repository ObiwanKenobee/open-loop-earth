import DashboardLayout from "@/components/DashboardLayout";
import LoopDiagram from "@/components/LoopDiagram";
import { CheckCircle, Circle, Clock } from "lucide-react";

const activeLoops = [
  { cell: "Kibera Green Loop", stage: 4, startedDays: 38, completion: 80 },
  { cell: "Dhaka Circular", stage: 3, startedDays: 25, completion: 60 },
  { cell: "Manila Roots", stage: 5, startedDays: 44, completion: 100 },
  { cell: "Detroit Soil Collective", stage: 2, startedDays: 12, completion: 40 },
];

const stages = ["Waste", "Compost", "Crop", "Sale", "Reinvest"];

const LoopPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Loop Tracker <span className="text-muted-foreground font-normal text-lg">// regenerative_cycles</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Waste → Compost → Crop → Sale → Reinvest
          </p>
        </div>

        <LoopDiagram />

        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="font-mono text-sm font-semibold text-foreground mb-4">
            // active_loops
          </h3>
          <div className="space-y-4">
            {activeLoops.map((loop) => (
              <div key={loop.cell} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-medium text-foreground">{loop.cell}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Clock size={12} />
                    {loop.startedDays}d
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stages.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        {i < loop.stage ? (
                          <CheckCircle size={16} className="text-moss" />
                        ) : (
                          <Circle size={16} className="text-border" />
                        )}
                        <span className={`text-xs font-mono ${i < loop.stage ? "text-foreground" : "text-muted-foreground"}`}>
                          {stage}
                        </span>
                      </div>
                      {i < stages.length - 1 && (
                        <div className={`w-4 h-px mx-1 ${i < loop.stage - 1 ? "bg-moss" : "bg-border"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoopPage;

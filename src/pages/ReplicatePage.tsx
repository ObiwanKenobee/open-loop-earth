import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle, ArrowRight, MapPin, Users, Recycle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { label: "Name & Location", icon: MapPin },
  { label: "Roles & Members", icon: Users },
  { label: "First Loop", icon: Recycle },
  { label: "Launch", icon: CheckCircle },
];

const checklist = [
  "Identify waste source (market, restaurant, household cluster)",
  "Secure composting space (min 10m²)",
  "Recruit 3+ founding members",
  "Designate coordinator",
  "Set up emergency fund (min $50)",
  "Complete first waste collection",
  "Begin composting cycle",
  "Document process in knowledge base",
];

const ReplicatePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cellName, setCellName] = useState("");
  const [location, setLocation] = useState("");
  const [checked, setChecked] = useState<boolean[]>(new Array(checklist.length).fill(false));
  const { toast } = useToast();

  const toggleCheck = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const completedChecks = checked.filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Replicate <span className="text-muted-foreground font-normal text-lg">// clone_cell</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fork a new cell from the protocol template
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div key={step.label} className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-moss/15 text-moss"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {step.label}
                </button>
                {i < steps.length - 1 && <ArrowRight size={12} className="text-muted-foreground/40" />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-md p-6">
          {currentStep === 0 && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-mono text-sm font-semibold text-foreground">// cell_identity</h3>
              <div className="space-y-2">
                <Label className="font-mono text-xs">cell_name</Label>
                <Input value={cellName} onChange={(e) => setCellName(e.target.value)} placeholder="e.g. Nairobi Green Loop" className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kibera, Nairobi, Kenya" className="font-mono text-sm" />
              </div>
              <Button onClick={() => setCurrentStep(1)} disabled={!cellName || !location} className="font-mono">
                Next <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-mono text-sm font-semibold text-foreground">// founding_team</h3>
              <p className="text-sm text-muted-foreground">
                A cell needs at least 3 members and 1 coordinator to launch. You will be assigned as coordinator.
              </p>
              <div className="bg-muted/50 rounded-md p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle size={14} className="text-moss" />
                  <span className="text-foreground">You (Coordinator)</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Invite members after launch via the Cells page
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(0)} className="font-mono">Back</Button>
                <Button onClick={() => setCurrentStep(2)} className="font-mono">Next <ArrowRight size={14} /></Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-semibold text-foreground">// starter_checklist</h3>
              <p className="text-sm text-muted-foreground">
                Complete these items to prepare your first regenerative loop.
                <span className="ml-2 font-mono text-moss">{completedChecks}/{checklist.length}</span>
              </p>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={checked[i]}
                      onChange={() => toggleCheck(i)}
                      className="w-4 h-4 rounded border-border accent-moss"
                    />
                    <span className={`text-sm font-mono ${checked[i] ? "text-moss line-through" : "text-foreground"}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="font-mono">Back</Button>
                <Button onClick={() => setCurrentStep(3)} className="font-mono">Next <ArrowRight size={14} /></Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-mono text-sm font-semibold text-foreground">// launch_cell</h3>
              <div className="bg-muted/50 rounded-md p-4 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">name:</span>
                  <span className="text-foreground">{cellName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">location:</span>
                  <span className="text-foreground">{location || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">checklist:</span>
                  <span className="text-moss">{completedChecks}/{checklist.length} complete</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This will create a new cell in the protocol. You will be assigned as coordinator.
                Cell data will be publicly visible in aggregate impact metrics.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="font-mono">Back</Button>
                <Button
                  className="font-mono"
                  onClick={() => {
                    toast({
                      title: "Cell creation requires admin approval",
                      description: "Your request has been submitted. An admin will review and create the cell.",
                    });
                  }}
                >
                  <Copy size={14} /> Launch Cell
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReplicatePage;

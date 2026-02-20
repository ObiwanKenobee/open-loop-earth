import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, FileText, Scale, Sprout } from "lucide-react";

const guides = [
  { title: "Composting Fundamentals", category: "Compost", icon: Sprout, desc: "Aerobic and anaerobic decomposition methods for tropical and temperate climates.", updated: "2025-12" },
  { title: "Vermiculture Guide v2", category: "Compost", icon: Sprout, desc: "Worm farming techniques for accelerated soil creation.", updated: "2026-02" },
  { title: "Urban Micro-Farming", category: "Crops", icon: Sprout, desc: "Growing food in under 50m² spaces using vertical and container methods.", updated: "2025-11" },
  { title: "Cell Governance Handbook", category: "Governance", icon: Scale, desc: "Democratic decision-making structures for cells of all sizes.", updated: "2026-01" },
  { title: "Financial Tracking Template", category: "Operations", icon: FileText, desc: "Simple ledger system for tracking cell income, expenses, and emergency funds.", updated: "2025-10" },
  { title: "Replication Playbook", category: "Growth", icon: BookOpen, desc: "Step-by-step guide for starting a new cell from an existing one.", updated: "2026-02" },
];

const KnowledgePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Knowledge <span className="text-muted-foreground font-normal text-lg">// library</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Open documentation for cell operators and contributors
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.title}
                className="bg-card border border-border rounded-md p-4 hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold text-foreground">{guide.title}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {guide.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{guide.desc}</p>
                    <p className="text-xs text-muted-foreground/60 font-mono mt-2">updated {guide.updated}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgePage;

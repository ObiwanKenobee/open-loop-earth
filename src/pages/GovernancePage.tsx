import DashboardLayout from "@/components/DashboardLayout";
import { Vote, CheckCircle, Clock, Users } from "lucide-react";

const proposals = [
  { id: 23, title: "Increase emergency fund allocation to 15%", status: "passed", votes: { yes: 87, no: 13 }, author: "Cell Council", date: "2026-02-18" },
  { id: 24, title: "Add marketplace module to protocol v0.2", status: "active", votes: { yes: 62, no: 18 }, author: "Tech Working Group", date: "2026-02-19" },
  { id: 25, title: "Regional steward election process reform", status: "active", votes: { yes: 45, no: 30 }, author: "Governance Circle", date: "2026-02-20" },
  { id: 22, title: "Standardize composting quality metrics", status: "passed", votes: { yes: 91, no: 9 }, author: "Knowledge Team", date: "2026-02-10" },
  { id: 21, title: "Open API rate limits for research partners", status: "rejected", votes: { yes: 34, no: 66 }, author: "API Council", date: "2026-02-05" },
];

const statusStyles: Record<string, { bg: string; icon: typeof CheckCircle }> = {
  passed: { bg: "bg-moss/15 text-moss", icon: CheckCircle },
  active: { bg: "bg-warm/15 text-warm", icon: Clock },
  rejected: { bg: "bg-destructive/15 text-destructive", icon: Vote },
};

const GovernancePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">
            Governance <span className="text-muted-foreground font-normal text-lg">// proposals</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transparent, node-weighted democratic proposals
          </p>
        </div>

        <div className="space-y-2">
          {proposals.map((p) => {
            const style = statusStyles[p.status];
            const Icon = style.icon;
            return (
              <div key={p.id} className="bg-card border border-border rounded-md p-4 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <Icon size={18} className={style.bg.split(" ")[1]} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">#{p.id}</span>
                      <h3 className="font-mono text-sm font-semibold text-foreground">{p.title}</h3>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${style.bg}`}>{p.status}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="font-mono">{p.author}</span>
                      <span className="font-mono">{p.date}</span>
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span className="font-mono text-moss">{p.votes.yes}% yes</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className="font-mono">{p.votes.no}% no</span>
                      </div>
                    </div>
                    {/* Vote bar */}
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-moss rounded-full" style={{ width: `${p.votes.yes}%` }} />
                    </div>
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

export default GovernancePage;

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
}

const StatCard = ({ label, value, unit, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-card border border-border rounded-md p-4">
      <div className="flex items-start justify-between">
        <div className="text-muted-foreground">{icon}</div>
        {trend && (
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded ${
              trend.value >= 0
                ? "bg-moss/10 text-moss"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-mono font-bold text-foreground">
          {value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

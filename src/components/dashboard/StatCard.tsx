import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
}

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <div className="bg-vault-surface border border-vault-border rounded-xl p-5 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs uppercase tracking-wide text-vault-muted font-semibold">{title}</h3>
        <div className={`p-2 rounded-full bg-opacity-10 ${iconColor ? "" : "text-vault-primary bg-vault-primary/10"}`}>
          <Icon className="w-5 h-5" style={iconColor ? { color: iconColor } : {}} />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-3xl font-bold text-vault-text">{value}</div>
        {subtitle && <div className="text-sm text-vault-muted mt-1">{subtitle}</div>}
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2 text-sm">
            <span className={
              trend.direction === "up" ? "text-vault-success" :
              trend.direction === "down" ? "text-vault-danger" :
              "text-vault-muted"
            }>
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : ""} {Math.abs(trend.value)}
            </span>
            <span className="text-vault-muted">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

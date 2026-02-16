import { AREA_COUNCILS } from "@/data/abujaData";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";
import { Users, Building2, CheckCircle2, AlertTriangle, Eye } from "lucide-react";

export const AreaCouncilGrid = () => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Area Council Status</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          6 Area Councils
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {AREA_COUNCILS.map((council) => (
          <div
            key={council.id}
            className={cn(
              "relative overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:border-primary/50 cursor-pointer group",
              council.riskLevel === 'critical' && "border-risk-critical/50 bg-risk-critical/5",
              council.riskLevel === 'high' && "border-risk-high/50 bg-risk-high/5",
              council.riskLevel === 'medium' && "border-risk-medium/50 bg-risk-medium/5",
              council.riskLevel === 'low' && "border-risk-low/50 bg-risk-low/5",
              council.riskLevel === 'none' && "border-border/50 bg-card/50"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{council.shortName}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {council.name}
                </p>
              </div>
              <RiskBadge level={council.riskLevel} showLabel={false} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Turnout:</span>
                <span className="font-mono font-semibold">{council.turnoutPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Open:</span>
                <span className="font-mono font-semibold text-success">{council.openUnits}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="text-muted-foreground">Incidents:</span>
                <span className="font-mono font-semibold text-warning">{council.incidentCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-info" />
                <span className="text-muted-foreground">Coverage:</span>
                <span className="font-mono font-semibold text-info">{council.observersCoverage}%</span>
              </div>
            </div>

            {/* Progress bar for turnout */}
            <div className="mt-3">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${council.turnoutPercent}%` }}
                />
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

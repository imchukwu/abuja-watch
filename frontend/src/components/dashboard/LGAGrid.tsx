import { Building2, Eye } from "lucide-react";
import { LGASummary } from "@/data/mockElectionData";
import { RiskBadge } from "@/components/RiskBadge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LGAGridProps {
  data: LGASummary[];
  totalCount: number;
  onSelectLGA?: (lga: LGASummary) => void;
  selectedLGAId?: string | null;
}

export const LGAGrid = ({ data, totalCount, onSelectLGA, selectedLGAId }: LGAGridProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Area Council Status</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {data.length} of {totalCount}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 max-w-[1400px]">
        {data.map((lga) => (
          <div
            key={lga.id}
            onClick={() => onSelectLGA?.(lga)}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all duration-200",
              "hover:shadow-md hover:border-primary/30",
              selectedLGAId === lga.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{lga.shortName}</h4>
                <p className="text-xs text-muted-foreground">{lga.name}</p>
              </div>
              <RiskBadge level={lga.riskLevel} />
            </div>

            {/* Turnout Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Turnout</span>
                <span className={cn(
                  "font-medium font-mono",
                  lga.turnoutPercent >= 55 ? "text-emerald-600" :
                    lga.turnoutPercent >= 50 ? "text-amber-600" : "text-red-600"
                )}>
                  {lga.turnoutPercent ? lga.turnoutPercent.toFixed(2) : "0.00"}%
                </span>
              </div>
              <Progress
                value={lga.turnoutPercent}
                className="h-1.5"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-sm font-bold font-mono text-foreground">
                  {lga.wardsReported}/{lga.wards}
                </div>
                <div className="text-[10px] text-muted-foreground">Wards</div>
              </div>
              <div>
                <div className={cn(
                  "text-sm font-bold font-mono",
                  lga.incidentCount > 10 ? "text-red-600" :
                    lga.incidentCount > 5 ? "text-amber-600" : "text-foreground"
                )}>
                  {lga.incidentCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Incidents</div>
              </div>
              <div>
                <div className={cn(
                  "text-sm font-bold font-mono",
                  lga.complianceScore >= 85 ? "text-emerald-600" :
                    lga.complianceScore >= 70 ? "text-amber-600" : "text-red-600"
                )}>
                  {lga.complianceScore.toFixed(2)}%
                </div>
                <div className="text-[10px] text-muted-foreground">Compliance</div>
              </div>
              <div>
                <div className="text-sm font-bold font-mono text-foreground">
                  {lga.observerCoverage}%
                </div>
                <div className="text-[10px] text-muted-foreground">Coverage</div>
              </div>
            </div>

            {/* Issue Indicators */}
            {(lga.deniedAccessCount > 0 || lga.lateStartCount > 0 || lga.cancelledPUs > 0) && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                {lga.deniedAccessCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    <Eye className="h-2.5 w-2.5" />
                    {lga.deniedAccessCount} denied
                  </span>
                )}
                {lga.lateStartCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                    {lga.lateStartCount} late
                  </span>
                )}
                {lga.cancelledPUs > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    {lga.cancelledPUs} cancelled
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

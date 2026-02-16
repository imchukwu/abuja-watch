import { Shield, AlertTriangle, Users, HandMetal, Siren } from "lucide-react";
import { getSecurityStats, RECENT_INCIDENTS, LGASummary } from "@/data/mockElectionData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface SecurityIncidentsSectionProps {
  data: LGASummary[];
  filterIncidentType?: string | null;
}

export const SecurityIncidentsSection = ({ data, filterIncidentType }: SecurityIncidentsSectionProps) => {
  const stats = getSecurityStats(data);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intimidation': return HandMetal;
      case 'violence': return Siren;
      case 'disruption': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'medium': return 'bg-amber-100 border-amber-300 text-amber-700';
      default: return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  // Get top 3 incidents for heatmap
  const topIncidentLGAs = Object.entries(stats.incidentsByLGA)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-foreground">Security & Incidents</h3>
        </div>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
          {stats.totalIncidents} Total
        </span>
      </div>

      {/* Incident Breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
          <div className="text-xl font-bold text-red-700 font-mono">{stats.intimidationCount}</div>
          <div className="text-xs text-red-600">Intimidation</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
          <div className="text-xl font-bold text-orange-700 font-mono">{stats.disruptionAttempts}</div>
          <div className="text-xs text-orange-600">Disruptions</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
          <div className="text-xl font-bold text-amber-700 font-mono">{stats.disagreements}</div>
          <div className="text-xs text-amber-600">Disagreements</div>
        </div>
      </div>

      {/* Hotspot LGAs */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Incident Hotspots</h4>
        <div className="space-y-2">
          {topIncidentLGAs.map(([lgaId, count]) => {
            const lga = data.find(l => l.id === lgaId);
            if (!lga) return null;
            const maxCount = Math.max(...Object.values(stats.incidentsByLGA));
            const width = (count / maxCount) * 100;

            return (
              <div key={lgaId} className="flex items-center gap-2">
                <span className="text-sm w-16 truncate">{lga.shortName}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      count > 10 ? "bg-red-500" : count > 5 ? "bg-orange-500" : "bg-amber-500"
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-medium w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Latest Incidents</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {RECENT_INCIDENTS
            // We can't easily filter incidents by the 'data' prop since incidents are global mocks. 
            // We'll just show all or filter by type. Ideally we'd filter by LGAs in 'data'.
            .filter(i => data.some(l => l.id === i.lgaId))
            .filter(i => !filterIncidentType || i.type === filterIncidentType)
            .slice(0, 4).map((incident) => {
              const Icon = getTypeIcon(incident.type);
              return (
                <div
                  key={incident.id}
                  className={cn(
                    "p-2 rounded-lg border text-xs",
                    getSeverityStyle(incident.severity)
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{incident.description}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">
                        {incident.wardName}, {incident.lgaName} • {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

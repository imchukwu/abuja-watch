import { cn } from "@/lib/utils";
import { RECENT_INCIDENTS, Incident } from "@/data/abujaData";
import { AlertTriangle, Shield, Zap, Package, Eye, Users, FileWarning, Siren } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

const incidentIcons: Record<Incident['type'], React.ElementType> = {
  violence: Siren,
  intimidation: Shield,
  vote_buying: Users,
  ballot_snatching: FileWarning,
  device_failure: Zap,
  missing_materials: Package,
  result_manipulation: AlertTriangle,
  observer_harassment: Eye,
};

const severityStyles = {
  low: 'border-l-emerald-500 bg-emerald-50',
  medium: 'border-l-amber-500 bg-amber-50',
  high: 'border-l-orange-500 bg-orange-50',
  critical: 'border-l-red-500 bg-red-50',
};

const severityDot = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500 animate-pulse',
};

const statusStyles = {
  reported: 'bg-slate-100 text-slate-600',
  investigating: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export const IncidentFeed = () => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">Live Incidents</h3>
        </div>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
          {RECENT_INCIDENTS.filter(i => i.status !== 'resolved').length} active
        </span>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-2 space-y-2">
          {RECENT_INCIDENTS.map((incident) => {
            const Icon = incidentIcons[incident.type];
            return (
              <div
                key={incident.id}
                className={cn(
                  "p-3 rounded-lg border-l-4 transition-all hover:translate-x-1",
                  severityStyles[incident.severity]
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    incident.severity === 'critical' ? 'bg-red-100 text-red-600' :
                    incident.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                    incident.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("h-2 w-2 rounded-full", severityDot[incident.severity])} />
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {incident.type.replace('_', ' ')}
                      </span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        statusStyles[incident.status]
                      )}>
                        {incident.status}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium mb-1 line-clamp-2">
                      {incident.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{incident.pollingUnit}</span>
                      <span>•</span>
                      <span>{incident.areaCouncil}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

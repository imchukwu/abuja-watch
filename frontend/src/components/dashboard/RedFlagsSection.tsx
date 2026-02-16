import { Flag, EyeOff, Clock, FileX, MapPin, AlertTriangle } from "lucide-react";
import { getRedFlagSummary, LGASummary } from "@/data/mockElectionData";
import { cn } from "@/lib/utils";

interface RedFlagsSectionProps {
  data: LGASummary[];
}

export const RedFlagsSection = ({ data }: RedFlagsSectionProps) => {
  const flags = getRedFlagSummary(data);

  const flagItems = [
    {
      icon: EyeOff,
      label: 'No Observer Access',
      count: flags.noObserverAccess,
      severity: flags.noObserverAccess > 5 ? 'critical' : flags.noObserverAccess > 2 ? 'high' : 'medium'
    },
    {
      icon: FileX,
      label: 'Missing Countersignatures',
      count: flags.noCountersignatures,
      severity: flags.noCountersignatures > 10 ? 'critical' : flags.noCountersignatures > 5 ? 'high' : 'medium'
    },
    {
      icon: Clock,
      label: 'Late Starts',
      count: flags.lateStarts,
      severity: flags.lateStarts > 10 ? 'critical' : flags.lateStarts > 5 ? 'high' : 'medium'
    },
    {
      icon: AlertTriangle,
      label: 'Integrity Violations',
      count: flags.integrityViolations,
      severity: flags.integrityViolations > 8 ? 'critical' : flags.integrityViolations > 4 ? 'high' : 'medium'
    },
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-700';
      default: return 'bg-amber-100 border-amber-300 text-amber-700';
    }
  };

  const totalFlags = flagItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-foreground">Red Flags</h3>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-medium",
          totalFlags > 30 ? "bg-red-100 text-red-700" :
            totalFlags > 15 ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"
        )}>
          {totalFlags} Issues
        </span>
      </div>

      {/* Flag Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {flagItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "p-3 rounded-lg border",
                getSeverityStyle(item.severity)
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{item.count}</div>
            </div>
          );
        })}
      </div>

      {/* Flagged Locations */}
      {flags.flaggedLocations.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Flagged LGAs
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {flags.flaggedLocations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warning Message */}
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-xs text-red-700">
          <strong>Attention Required:</strong> {flags.noObserverAccess} wards reported observer access denial.
          {flags.lateStarts > 5 && ` ${flags.lateStarts} wards had late starts.`}
        </p>
      </div>
    </div>
  );
};

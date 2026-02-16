import { FCT_STATS } from "@/data/abujaData";
import { Eye, Users, MapPin, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ObserverCoverage = () => {
  const coveragePercent = (FCT_STATS.coveredUnits / FCT_STATS.totalPollingUnits) * 100;
  const uncoveredUnits = FCT_STATS.totalPollingUnits - FCT_STATS.coveredUnits;
  
  // Simulated report submission rate
  const reportStats = {
    totalReports: 4280,
    pendingReports: 156,
    submissionRate: 94.2,
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-info" />
          <h3 className="font-semibold">Observer Coverage</h3>
        </div>
        <span className="text-xs font-mono text-info">
          {coveragePercent.toFixed(1)}% covered
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Coverage Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Polling Units with Observers</span>
            <span className="font-mono font-semibold">{FCT_STATS.coveredUnits.toLocaleString()}</span>
          </div>
          <Progress value={coveragePercent} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>{FCT_STATS.totalPollingUnits.toLocaleString()} total</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 mx-auto mb-1 text-info" />
            <div className="text-lg font-bold font-mono">{FCT_STATS.totalObservers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Observers</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-warning" />
            <div className="text-lg font-bold font-mono text-warning">{uncoveredUnits}</div>
            <div className="text-xs text-muted-foreground">Uncovered</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Send className="h-4 w-4 mx-auto mb-1 text-success" />
            <div className="text-lg font-bold font-mono">{reportStats.submissionRate}%</div>
            <div className="text-xs text-muted-foreground">Report Rate</div>
          </div>
        </div>

        {/* Report Status */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Reports submitted today</span>
            <span className="font-mono font-semibold">{reportStats.totalReports.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Pending review</span>
            <span className="font-mono font-semibold text-warning">{reportStats.pendingReports}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

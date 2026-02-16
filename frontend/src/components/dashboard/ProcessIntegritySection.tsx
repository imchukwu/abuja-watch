import { Clock, Eye, Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getProcessIntegrityStats, LGASummary } from "@/data/mockElectionData";
import { cn } from "@/lib/utils";

interface ProcessIntegritySectionProps {
  data: LGASummary[];
}

export const ProcessIntegritySection = ({ data }: ProcessIntegritySectionProps) => {
  const stats = getProcessIntegrityStats(data);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Process Integrity</h3>
      </div>

      {/* Overall Score */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Integrity Score</span>
          <span className={cn("text-2xl font-bold font-mono", getScoreColor(stats.overallIntegrityScore))}>
            {stats.overallIntegrityScore.toFixed(0)}%
          </span>
        </div>
        <Progress
          value={stats.overallIntegrityScore}
          className="h-2"
        />
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Timeliness</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={stats.timelinessScore} className="w-20 h-1.5" />
            <span className={cn("text-sm font-mono font-medium", getScoreColor(stats.timelinessScore))}>
              {stats.timelinessScore.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Observer Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={stats.accessScore} className="w-20 h-1.5" />
            <span className={cn("text-sm font-mono font-medium", getScoreColor(stats.accessScore))}>
              {stats.accessScore.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Form Compliance</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={stats.complianceScore} className="w-20 h-1.5" />
            <span className={cn("text-sm font-mono font-medium", getScoreColor(stats.complianceScore))}>
              {stats.complianceScore.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Issue Indicators */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <div className={cn(
            "w-2 h-2 rounded-full",
            stats.lateStartPercent > 15 ? "bg-red-500" : stats.lateStartPercent > 5 ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <span className="text-muted-foreground">Late Starts:</span>
          <span className="font-medium">{stats.lateStartPercent}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={cn(
            "w-2 h-2 rounded-full",
            stats.deniedAccessPercent > 10 ? "bg-red-500" : stats.deniedAccessPercent > 3 ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <span className="text-muted-foreground">Denied Access:</span>
          <span className="font-medium">{stats.deniedAccessPercent}%</span>
        </div>
      </div>
    </div>
  );
};

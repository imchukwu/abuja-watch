import { TrendingUp, XCircle, Users, AlertCircle } from "lucide-react";
import { getTurnoutStats, LGASummary } from "@/data/mockElectionData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TurnoutCancellationsSectionProps {
  data: LGASummary[];
}

export const TurnoutCancellationsSection = ({ data }: TurnoutCancellationsSectionProps) => {
  const stats = getTurnoutStats(data);
  const dataSource = data;
  const sortedByTurnout = [...dataSource].sort((a, b) => a.turnoutPercent - b.turnoutPercent);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Turnout & Cancellations</h3>
      </div>

      {/* Overall Turnout */}
      <div className="bg-primary/5 rounded-lg p-4 mb-4 border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall FCT Turnout</span>
          <span className="text-2xl font-bold font-mono text-primary">
            {stats.overallTurnout}%
          </span>
        </div>
        <Progress value={stats.overallTurnout} className="h-2" />
      </div>

      {/* Cancellation Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Cancelled PUs</span>
          </div>
          <div className="text-xl font-bold text-red-700 font-mono">{stats.cancelledPUs}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">Lost Voters</span>
          </div>
          <div className="text-xl font-bold text-amber-700 font-mono">
            {stats.lostVoters.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Turnout by LGA */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Turnout by LGA
        </h4>
        <div className="space-y-2">
          {sortedByTurnout.map((lga) => (
            <div key={lga.id} className="flex items-center gap-2">
              <span className="text-sm w-14 truncate">{lga.shortName}</span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    lga.turnoutPercent >= 55 ? "bg-emerald-500" :
                      lga.turnoutPercent >= 50 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${lga.turnoutPercent}%` }}
                />
              </div>
              <span className={cn(
                "text-sm font-mono font-medium w-12 text-right",
                lga.turnoutPercent >= 55 ? "text-emerald-600" :
                  lga.turnoutPercent >= 50 ? "text-amber-600" : "text-red-600"
              )}>
                {lga.turnoutPercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning for low turnout */}
      {sortedByTurnout.length > 0 && sortedByTurnout[0].turnoutPercent < 52 && (
        <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-2 w-2 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-700">
            <strong>{sortedByTurnout[0].name}</strong> has the lowest turnout at {sortedByTurnout[0].turnoutPercent}%
          </p>
        </div>
      )}
    </div>
  );
};

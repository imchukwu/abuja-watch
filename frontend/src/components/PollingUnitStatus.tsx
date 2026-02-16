import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Loader2, Wifi, WifiOff, Zap, Battery } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const PollingUnitStatus = () => {
  const [stats, setStats] = useState({
    totalPollingUnits: 0,
    openPollingUnits: 0,
    pollingUnitBreakdown: {
      operational: 0,
      minorIssues: 0,
      offline: 0,
      notOpened: 0,
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const openPercent = stats.totalPollingUnits > 0
    ? (stats.openPollingUnits / stats.totalPollingUnits) * 100
    : 0;

  // Use data from API
  const statusBreakdown = stats.pollingUnitBreakdown || {
    operational: 0,
    minorIssues: 0,
    offline: 0,
    notOpened: 0,
  };

  const connectivityStats = {
    online: 1580,
    offline: 73,
  };

  const bvasStatus = {
    working: 1598,
    faulty: 42,
    notDeployed: 13,
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-foreground">Polling Unit Status</h3>
        </div>
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {stats.openPollingUnits.toLocaleString()} / {stats.totalPollingUnits.toLocaleString()}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Units Operating</span>
            <span className="font-mono font-semibold text-emerald-600">{openPercent.toFixed(2)}%</span>
          </div>
          <Progress value={openPercent} className="h-3" />
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-foreground">{statusBreakdown.operational}</div>
            <div className="text-xs text-muted-foreground">Operational</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <Loader2 className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-foreground">{statusBreakdown.minorIssues}</div>
            <div className="text-xs text-muted-foreground">Minor Issues</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <WifiOff className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-foreground">{statusBreakdown.offline}</div>
            <div className="text-xs text-muted-foreground">Offline</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <XCircle className="h-5 w-5 text-slate-500 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-foreground">{statusBreakdown.notOpened}</div>
            <div className="text-xs text-muted-foreground">Not Opened</div>
          </div>
        </div>

        {/* Connectivity & BVAS */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Wifi className="h-3.5 w-3.5" />
              Connectivity
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: stats.totalPollingUnits > 0 ? `${(connectivityStats.online / stats.totalPollingUnits) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-mono">
                {stats.totalPollingUnits > 0 ? ((connectivityStats.online / stats.totalPollingUnits) * 100).toFixed(2) : '0.00'}%
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Zap className="h-3.5 w-3.5" />
              BVAS Status
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: stats.totalPollingUnits > 0 ? `${(bvasStatus.working / stats.totalPollingUnits) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-mono">
                {stats.totalPollingUnits > 0 ? ((bvasStatus.working / stats.totalPollingUnits) * 100).toFixed(2) : '0.00'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

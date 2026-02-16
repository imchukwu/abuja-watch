import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { 
  AlertTriangle, Shield, Siren, MapPin, Clock, Eye, 
  Radio, Activity, TrendingUp, Users, ChevronRight, 
  Filter, Bell, Zap, HandMetal
} from "lucide-react";
import { RECENT_INCIDENTS, LGA_DATA, Incident } from "@/data/mockElectionData";
import { RiskBadge } from "@/components/RiskBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const SituationRoom = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = useMemo(() => {
    if (!selectedSeverity) return RECENT_INCIDENTS;
    return RECENT_INCIDENTS.filter(i => i.severity === selectedSeverity);
  }, [selectedSeverity]);

  const criticalCount = RECENT_INCIDENTS.filter(i => i.severity === 'critical').length;
  const highCount = RECENT_INCIDENTS.filter(i => i.severity === 'high').length;
  const activeCount = RECENT_INCIDENTS.filter(i => i.status !== 'resolved').length;
  const investigatingCount = RECENT_INCIDENTS.filter(i => i.status === 'investigating').length;

  // Hotspot clusters - LGAs with most incidents
  const hotspots = useMemo(() => {
    return [...LGA_DATA]
      .sort((a, b) => b.incidentCount - a.incidentCount)
      .slice(0, 4)
      .map(lga => ({
        ...lga,
        criticalIncidents: RECENT_INCIDENTS.filter(i => i.lgaId === lga.id && i.severity === 'critical').length,
        activeIncidents: RECENT_INCIDENTS.filter(i => i.lgaId === lga.id && i.status !== 'resolved').length,
      }));
  }, []);

  // Incident type breakdown
  const typeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    RECENT_INCIDENTS.forEach(i => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intimidation': return HandMetal;
      case 'violence': return Siren;
      case 'disruption': return AlertTriangle;
      case 'observer_harassment': return Eye;
      default: return AlertTriangle;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-amber-500 bg-amber-50';
      default: return 'border-l-slate-400 bg-slate-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reported': return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">Reported</Badge>;
      case 'investigating': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Investigating</Badge>;
      case 'resolved': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">Resolved</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 border border-red-200">
              <Siren className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Situation Room</h1>
              <p className="text-sm text-muted-foreground">
                Live incident tracking & critical alert monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-card border border-border rounded-lg px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-muted-foreground">LIVE</span>
              <span className="font-mono font-medium">{liveTime.toLocaleTimeString()}</span>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                ← Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Alert Banner */}
        {criticalCount > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''} Require Immediate Attention
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {highCount} high-severity incidents also being tracked
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => setSelectedSeverity('critical')}
            >
              View Critical
            </Button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Active Incidents</span>
            </div>
            <div className="text-3xl font-bold font-mono text-red-600">{activeCount}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Critical / High</span>
            </div>
            <div className="text-3xl font-bold font-mono text-orange-600">
              {criticalCount} / {highCount}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Under Investigation</span>
            </div>
            <div className="text-3xl font-bold font-mono text-amber-600">{investigatingCount}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Affected LGAs</span>
            </div>
            <div className="text-3xl font-bold font-mono text-primary">
              {new Set(RECENT_INCIDENTS.map(i => i.lgaId)).size}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Live Incident Feed */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter Chips */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-red-500" />
                  <h3 className="font-semibold text-foreground">Live Incident Feed</h3>
                </div>
                <span className="text-xs text-muted-foreground">{filteredIncidents.length} incidents</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                  <Button
                    key={sev}
                    variant={(selectedSeverity === sev || (!selectedSeverity && sev === 'all')) ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setSelectedSeverity(sev === 'all' ? null : sev)}
                  >
                    {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                    {sev !== 'all' && (
                      <span className="ml-1 text-[10px] opacity-75">
                        ({RECENT_INCIDENTS.filter(i => i.severity === sev).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              <ScrollArea className="h-[480px]">
                <div className="space-y-3 pr-2">
                  {filteredIncidents.map((incident) => {
                    const Icon = getTypeIcon(incident.type);
                    return (
                      <div
                        key={incident.id}
                        className={cn(
                          "p-4 rounded-lg border-l-4 border border-border transition-all hover:shadow-sm",
                          getSeverityStyle(incident.severity)
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {incident.type.replace(/_/g, ' ')}
                            </span>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                              incident.severity === 'critical' ? "bg-red-200 text-red-800" :
                              incident.severity === 'high' ? "bg-orange-200 text-orange-800" :
                              incident.severity === 'medium' ? "bg-amber-200 text-amber-800" :
                              "bg-slate-200 text-slate-800"
                            )}>
                              {incident.severity}
                            </span>
                          </div>
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-2">{incident.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {incident.wardName}, {incident.lgaName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {incident.reportedBy}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right: Hotspots & Analysis */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hotspot Clusters */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">Hotspot Clusters</h3>
              </div>

              <div className="space-y-3">
                {hotspots.map(lga => (
                  <div 
                    key={lga.id}
                    className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{lga.name}</h4>
                        <RiskBadge level={lga.riskLevel} />
                      </div>
                      <span className="text-lg font-bold font-mono text-red-600">{lga.incidentCount}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-card rounded p-2 border border-border">
                        <div className="text-xs text-muted-foreground">Active</div>
                        <div className="text-sm font-bold font-mono text-amber-600">{lga.activeIncidents}</div>
                      </div>
                      <div className="bg-card rounded p-2 border border-border">
                        <div className="text-xs text-muted-foreground">Critical</div>
                        <div className="text-sm font-bold font-mono text-red-600">{lga.criticalIncidents}</div>
                      </div>
                      <div className="bg-card rounded p-2 border border-border">
                        <div className="text-xs text-muted-foreground">Security</div>
                        <div className="text-sm font-bold font-mono">{lga.securityPresent}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident Type Breakdown */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Incident Types</h3>
              </div>

              <div className="space-y-3">
                {typeBreakdown.map(({ type, count }) => {
                  const max = Math.max(...typeBreakdown.map(t => t.count));
                  const width = (count / max) * 100;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-xs w-28 truncate capitalize text-muted-foreground">
                        {type.replace(/_/g, ' ')}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-medium w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LGA Risk Overview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">LGA Risk Overview</h3>
              </div>

              <div className="space-y-2">
                {[...LGA_DATA].sort((a, b) => {
                  const riskOrder = { critical: 4, high: 3, medium: 2, low: 1, none: 0 };
                  return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
                }).map(lga => (
                  <div key={lga.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{lga.shortName}</span>
                      <RiskBadge level={lga.riskLevel} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{lga.incidentCount} incidents</span>
                      <span>{lga.observerCoverage}% coverage</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SituationRoom;

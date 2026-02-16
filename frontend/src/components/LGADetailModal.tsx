import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LGASummary, WardSummary, RECENT_INCIDENTS } from "@/data/mockElectionData";
import { api } from "@/services/api";
import { RiskBadge } from "./RiskBadge";
import {
  Users, CheckCircle2, Vote, AlertTriangle, Eye, MapPin,
  TrendingUp, Clock, Zap, Building2, Shield,
  UserCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LGADetailModalProps {
  lga: LGASummary | null;
  open: boolean;
  onClose: () => void;
}

const hourlyVotingData = [
  { hour: '8AM', votes: 1200 },
  { hour: '9AM', votes: 3400 },
  { hour: '10AM', votes: 5200 },
  { hour: '11AM', votes: 4800 },
  { hour: '12PM', votes: 3600 },
  { hour: '1PM', votes: 2800 },
  { hour: '2PM', votes: 4100 },
  { hour: '3PM', votes: 3200 },
];

const PARTY_COLORS: Record<string, string> = {
  apc: '#0066B3', lp: '#00A651', pdp: '#E31B23',
  nnpp: '#FFC107', apga: '#9C27B0', others: '#78909C',
};

export const LGADetailModal = ({ lga, open, onClose }: LGADetailModalProps) => {
  const [selectedWard, setSelectedWard] = useState<WardSummary | null>(null);
  const [wardData, setWardData] = useState<WardSummary[]>([]);


  // Fetch Ward Data when LGA changes
  useEffect(() => {
    if (lga && open) {
      api.getWards(lga.id).then((data: any) => {
        setWardData(data);
      }).catch(err => console.error(err));
    } else {
      setWardData([]);
    }
  }, [lga, open]);

  const lgaIncidents = useMemo(() => {
    if (!lga) return [];
    return RECENT_INCIDENTS.filter(i => i.lgaId === lga.id);
  }, [lga]);

  const integrityStats = useMemo(() => {
    if (wardData.length === 0) return null;
    const total = wardData.length;
    return {
      ec8bSubmitted: wardData.filter(w => w.integrity.ec8bSubmitted).length,
      ec8cCollated: wardData.filter(w => w.integrity.ec8cCollated).length,
      csrvsDone: wardData.filter(w => w.integrity.csrvsDone).length,
      votesAnnounced: wardData.filter(w => w.integrity.votesAnnounced).length,
      agentsCountersigned: wardData.filter(w => w.integrity.agentsCountersigned).length,
      ec60eDisplayed: wardData.filter(w => w.integrity.ec60eDisplayed).length,
      total,
    };
  }, [wardData]);

  const timelinessStats = useMemo(() => {
    const arrivalBreakdown: Record<string, number> = {};
    const startBreakdown: Record<string, number> = {};
    wardData.forEach(w => {
      arrivalBreakdown[w.arrivalCategory] = (arrivalBreakdown[w.arrivalCategory] || 0) + 1;
      startBreakdown[w.startCategory] = (startBreakdown[w.startCategory] || 0) + 1;
    });
    return { arrivalBreakdown, startBreakdown };
  }, [wardData]);

  if (!lga) return null;

  const partyChartData = [
    { party: 'APC', votes: lga.partyResults.apc, color: PARTY_COLORS.apc },
    { party: 'LP', votes: lga.partyResults.lp, color: PARTY_COLORS.lp },
    { party: 'PDP', votes: lga.partyResults.pdp, color: PARTY_COLORS.pdp },
    { party: 'NNPP', votes: lga.partyResults.nnpp, color: PARTY_COLORS.nnpp },
    { party: 'APGA', votes: lga.partyResults.apga, color: PARTY_COLORS.apga },
    { party: 'Others', votes: lga.partyResults.others, color: PARTY_COLORS.others },
  ].sort((a, b) => b.votes - a.votes);

  const statusData = [
    { name: 'Operational', value: lga.pollingUnits - lga.cancelledPUs, color: '#16a34a' },
    { name: 'Issues', value: Math.floor(lga.pollingUnits * 0.03), color: '#eab308' },
    { name: 'Cancelled', value: lga.cancelledPUs, color: '#ef4444' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{lga.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {lga.wards} Wards • {lga.pollingUnits} Polling Units • {lga.wardsReported} Reported
                </p>
              </div>
            </div>
            <RiskBadge level={lga.riskLevel} />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-5 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard icon={Users} label="Registered" value={lga.registeredVoters.toLocaleString()} color="text-slate-600" bgColor="bg-slate-100" />
              <MetricCard icon={CheckCircle2} label="Accredited" value={lga.accreditedVoters.toLocaleString()} subValue={`${(lga.registeredVoters > 0 ? (lga.accreditedVoters / lga.registeredVoters) * 100 : 0).toFixed(2)}%`} color="text-emerald-600" bgColor="bg-emerald-100" />
              <MetricCard icon={Vote} label="Votes Cast" value={lga.votesCast.toLocaleString()} color="text-blue-600" bgColor="bg-blue-100" />
              <MetricCard icon={TrendingUp} label="Turnout" value={`${lga.turnoutPercent}%`} color="text-primary" bgColor="bg-primary/10" />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-9">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="integrity" className="text-xs">Integrity</TabsTrigger>
                <TabsTrigger value="timeliness" className="text-xs">Timeliness</TabsTrigger>
                <TabsTrigger value="results" className="text-xs">Results</TabsTrigger>
                <TabsTrigger value="wards" className="text-xs">Wards</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Ward Turnout (%)</h4>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={wardData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={40} />
                        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white border rounded-lg p-2 shadow-sm text-xs">
                                  <div className="font-bold">{data.name}</div>
                                  <div>Turnout: {data.turnoutPercent}%</div>
                                  <div>Votes: {data.votesCast.toLocaleString()}</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="turnoutPercent" fill="hsl(145 63% 32%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Polling Unit Status</h4>
                    </div>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {statusData.map(item => (
                          <div key={item.name} className="flex items-center gap-2 text-sm">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-mono font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Observer Coverage</div>
                    <div className="text-xl font-bold font-mono">{lga.observerCoverage}%</div>
                    <Progress value={lga.observerCoverage} className="h-1.5 mt-2" />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Compliance</div>
                    <div className={cn("text-xl font-bold font-mono", lga.complianceScore >= 80 ? "text-emerald-600" : lga.complianceScore >= 60 ? "text-amber-600" : "text-red-600")}>
                      {lga.complianceScore}%
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Incidents</div>
                    <div className={cn("text-xl font-bold font-mono", lga.incidentCount > 10 ? "text-red-600" : "text-amber-600")}>
                      {lga.incidentCount}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Cancelled PUs</div>
                    <div className="text-xl font-bold font-mono text-red-600">{lga.cancelledPUs}</div>
                  </div>
                </div>

                {lgaIncidents.length > 0 && (
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium text-sm">Recent Incidents</h4>
                    </div>
                    <div className="space-y-2">
                      {lgaIncidents.slice(0, 3).map(incident => (
                        <div key={incident.id} className={cn("p-3 rounded-lg border-l-4 bg-card border border-border",
                          incident.severity === 'critical' && "border-l-red-500",
                          incident.severity === 'high' && "border-l-orange-500",
                          incident.severity === 'medium' && "border-l-amber-500",
                        )}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {incident.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{incident.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Integrity Tab */}
              <TabsContent value="integrity" className="space-y-4 mt-4">
                {integrityStats && (
                  <>
                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Collation Integrity Checks</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'EC8B Forms Submitted', value: integrityStats.ec8bSubmitted },
                          { label: 'EC8C Properly Collated', value: integrityStats.ec8cCollated },
                          { label: 'CSRVS Crosscheck Done', value: integrityStats.csrvsDone },
                          { label: 'Votes Announced Loudly', value: integrityStats.votesAnnounced },
                          { label: 'Agents Countersigned', value: integrityStats.agentsCountersigned },
                          { label: 'EC60E Displayed', value: integrityStats.ec60eDisplayed },
                        ].map(item => {
                          const pct = Math.round((item.value / integrityStats.total) * 100);
                          return (
                            <div key={item.label} className="flex items-center gap-3">
                              <span className="text-sm w-48 text-muted-foreground">{item.label}</span>
                              <div className="flex-1">
                                <Progress value={pct} className="h-2" />
                              </div>
                              <span className={cn("text-sm font-mono font-medium w-16 text-right",
                                pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600"
                              )}>
                                {item.value}/{integrityStats.total}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Party Agent Countersignatures</h4>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {['APC', 'LP', 'PDP', 'NNPP', 'APGA', 'Others'].map(party => {
                          const signed = wardData.filter(w => w.integrity.agentsCountersigned).length;
                          const pct = Math.round((signed / wardData.length) * 100);
                          return (
                            <div key={party} className="bg-card rounded-lg p-3 border border-border text-center">
                              <div className="text-xs font-semibold text-muted-foreground">{party}</div>
                              <div className={cn("text-lg font-bold font-mono mt-1",
                                pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"
                              )}>
                                {pct}%
                              </div>
                              <div className="text-[10px] text-muted-foreground">signed</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Timeliness Tab */}
              <TabsContent value="timeliness" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Arrival Time Distribution</h4>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(timelinessStats.arrivalBreakdown).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between p-2 rounded bg-card border border-border">
                          <span className="text-sm text-muted-foreground">{cat}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${(count / wardData.length) * 100}%` }} />
                            </div>
                            <span className="text-sm font-mono font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Collation Start Time</h4>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(timelinessStats.startBreakdown).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between p-2 rounded bg-card border border-border">
                          <span className="text-sm text-muted-foreground">{cat}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                              <div className={cn("h-full rounded-full",
                                cat.includes('midnight') ? "bg-red-500" : cat.includes('9pm') ? "bg-orange-500" : "bg-primary"
                              )} style={{ width: `${(count / wardData.length) * 100}%` }} />
                            </div>
                            <span className="text-sm font-mono font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Late Starts</div>
                    <div className="text-2xl font-bold font-mono text-amber-600">{lga.lateStartCount}</div>
                    <div className="text-xs text-muted-foreground">of {lga.wards} wards</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Denied Access</div>
                    <div className="text-2xl font-bold font-mono text-red-600">{lga.deniedAccessCount}</div>
                    <div className="text-xs text-muted-foreground">observers blocked</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Security Present</div>
                    <div className="text-2xl font-bold font-mono text-emerald-600">{lga.securityPresent}%</div>
                    <div className="text-xs text-muted-foreground">of locations</div>
                  </div>
                </div>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-4 mt-4">
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Vote className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">Party Results</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={partyChartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                      <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="party" tick={{ fontSize: 11 }} width={50} />
                      <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Votes']} contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                        {partyChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Valid Votes</div>
                    <div className="text-xl font-bold font-mono text-emerald-600">{lga.validVotes.toLocaleString()}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Rejected Votes</div>
                    <div className="text-xl font-bold font-mono text-red-600">{lga.rejectedVotes.toLocaleString()}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border text-center">
                    <div className="text-xs text-muted-foreground mb-1">Rejection Rate</div>
                    <div className="text-xl font-bold font-mono text-amber-600">
                      {(lga.votesCast > 0 ? (lga.rejectedVotes / lga.votesCast) * 100 : 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Wards Tab */}
              <TabsContent value="wards" className="space-y-4 mt-4">
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">Ward-Level Breakdown</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {wardData.map(ward => (
                      <div
                        key={ward.id}
                        onClick={() => setSelectedWard(selectedWard?.id === ward.id ? null : ward)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                          selectedWard?.id === ward.id ? "border-primary bg-primary/5" : "border-border bg-card",
                          ward.deniedAccess && "border-l-4 border-l-red-400",
                          ward.lateStart && !ward.deniedAccess && "border-l-4 border-l-amber-400"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{ward.name}</span>
                            <RiskBadge level={ward.riskLevel} showLabel={false} />
                          </div>
                          <span className="text-sm font-bold font-mono">{ward.turnoutPercent.toFixed(2)}%</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div>
                            <div className="font-mono font-medium">{ward.pollingUnits}</div>
                            <div className="text-muted-foreground">PUs</div>
                          </div>
                          <div>
                            <div className="font-mono font-medium">{ward.complianceScore}%</div>
                            <div className="text-muted-foreground">Comply</div>
                          </div>
                          <div>
                            <div className={cn("font-mono font-medium", ward.incidentCount > 0 && "text-amber-600")}>
                              {ward.incidentCount}
                            </div>
                            <div className="text-muted-foreground">Incidents</div>
                          </div>
                          <div>
                            <div className={cn("font-mono font-medium", !ward.securityPresent && "text-red-600")}>
                              {ward.securityPresent ? '✓' : '✗'}
                            </div>
                            <div className="text-muted-foreground">Security</div>
                          </div>
                        </div>

                        {selectedWard?.id === ward.id && (
                          <div className="mt-3 pt-3 border-t border-border space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <span className={cn("h-2 w-2 rounded-full", ward.observerPresent ? "bg-emerald-500" : "bg-red-500")} />
                                <span className="text-muted-foreground">Observer: {ward.observerPresent ? 'Present' : 'Absent'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={cn("h-2 w-2 rounded-full", !ward.lateStart ? "bg-emerald-500" : "bg-amber-500")} />
                                <span className="text-muted-foreground">Start: {ward.lateStart ? 'Late' : 'On Time'}</span>
                              </div>
                              <div className="text-muted-foreground">Arrival: {ward.arrivalCategory}</div>
                              <div className="text-muted-foreground">Collation: {ward.startCategory}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Registered: {ward.registeredVoters.toLocaleString()} •
                              Accredited: {ward.accreditedVoters.toLocaleString()} •
                              Cast: {ward.votesCast.toLocaleString()}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(ward.integrity).map(([key, val]) => (
                                <span key={key} className={cn("text-[10px] px-1.5 py-0.5 rounded",
                                  val ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                )}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color: string;
  bgColor: string;
}

const MetricCard = ({ icon: Icon, label, value, subValue, color, bgColor }: MetricCardProps) => (
  <div className="bg-card rounded-xl p-3 border border-border">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn("p-1.5 rounded-lg", bgColor)}>
        <Icon className={cn("h-3.5 w-3.5", color)} />
      </div>
    </div>
    <div className="text-xl font-bold font-mono">{value}</div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {subValue && <span className={cn("text-xs font-medium", color)}>{subValue}</span>}
    </div>
  </div>
);

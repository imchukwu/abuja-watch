// Abuja FCT Election Monitoring Data Types

// ==========================================
// 1. Geographic & Metadata (Core Dimensions)
// ==========================================

export type CollationLevel = 'WARD' | 'LGA';
export type SupervisorType = 'WARD Supervisor' | 'LGA Supervisor';

export interface GeographicMetadata {
  state: 'FCT';
  lgaId: string;
  lgaName: string;
  wardId?: string;
  wardName?: string;
  collationLevel: CollationLevel;
  observerId: string; // WTVID
  supervisorType: SupervisorType;
  dateOfCollation: string;
  arrivalTime?: string;
  commencementTime?: string;
  completionTime?: string;
}

// ==========================================
// 2. Arrival & Timeliness Metrics
// ==========================================

export type ArrivalTimeCategory = 'Before 4pm' | '4-5pm' | '5-6pm' | 'After 6pm';
export type CollationStartCategory = 'Before 4pm' | '4-6pm' | '6-9pm' | '9pm-12am' | 'Not started at midnight';

export interface TimelinessMetrics {
  arrivalTimeCategory: ArrivalTimeCategory;
  collationStartCategory: CollationStartCategory;
  isLateStart: boolean;
  slaCompliant: boolean;
}

// ==========================================
// 3. Observer Access & Transparency
// ==========================================

export interface ObserverAccess {
  permittedToObserve: boolean;
  denialReason?: string;
}

// ==========================================
// 4. Staffing & Security Presence
// ==========================================

export interface StaffingAndSecurity {
  inecCollationOfficers: number;
  femaleInecOfficers: number;
  securityAgentsPresent: boolean;
  totalPartyAgents: number;
}

// ==========================================
// 5. Collation Process Integrity Checks
// ==========================================

export interface CollationIntegrity {
  ec8bFormsSubmitted: boolean;
  ec8cProperlyCollated: boolean;
  csrvsCrosscheckDone: boolean;
  ec40gTransfersDone: boolean;
  ec40hPwdDataTransferred: boolean;
  votesAnnouncedLoudly: boolean;
  partyAgentsRequestedToCountersign: boolean;
  ec8cCopiesDistributed: boolean;
  ec60eDisplayed: boolean;
}

// ==========================================
// 6. Party Agent Participation
// ==========================================

export type CountersignStatus = 'Yes' | 'No' | 'No agent';

export interface PartyAgentParticipation {
  apcCountersigned: CountersignStatus;
  lpCountersigned: CountersignStatus;
  pdpCountersigned: CountersignStatus;
  apgaCountersigned: CountersignStatus;
  nnppCountersigned: CountersignStatus;
  otherPartiesCountersigned: CountersignStatus;
}

// ==========================================
// 7. Disruptions & Security Incidents
// ==========================================

export interface SecurityIncidents {
  disagreementWithResults: boolean;
  intimidationOrHarassment: boolean;
  attemptedDisruption: boolean;
  incidentDetails?: string;
}

// ==========================================
// 8. Cancelled Polling Units
// ==========================================

export interface CancelledPUs {
  numberOfCancelledPUs: number;
  registeredVotersInCancelledPUs: number;
}

// ==========================================
// 9. Official Results – Party Votes
// ==========================================

export interface PartyResults {
  apc: number;
  lp: number;
  pdp: number;
  nnpp: number;
  apga: number;
  sdp: number;
  apm: number;
  adc: number;
  app: number;
  ypp: number;
  zlp: number;
  others: number;
}

// ==========================================
// 10. Aggregate Voting Statistics
// ==========================================

export interface VotingStatistics {
  totalRegisteredVoters: number;
  totalAccreditedVoters: number;
  totalVotesCast: number;
  totalValidVotes: number;
  totalRejectedVotes: number;
  turnoutPercent: number;
}

// ==========================================
// Combined Ward Collation Report
// ==========================================

export interface WardCollationReport {
  id: string;
  metadata: GeographicMetadata;
  timeliness: TimelinessMetrics;
  observerAccess: ObserverAccess;
  staffing: StaffingAndSecurity;
  integrity: CollationIntegrity;
  partyParticipation: PartyAgentParticipation;
  incidents: SecurityIncidents;
  cancelledPUs: CancelledPUs;
  results: PartyResults;
  votingStats: VotingStatistics;
}

// ==========================================
// Combined LGA Collation Report
// ==========================================

export interface LGACollationReport {
  id: string;
  metadata: Omit<GeographicMetadata, 'wardId' | 'wardName'>;
  timeliness: TimelinessMetrics;
  observerAccess: ObserverAccess;
  staffing: StaffingAndSecurity;
  integrity: CollationIntegrity;
  partyParticipation: PartyAgentParticipation;
  incidents: SecurityIncidents;
  cancelledPUs: CancelledPUs;
  results: PartyResults;
  votingStats: VotingStatistics;
  wardReports: WardCollationReport[];
}

// ==========================================
// Dashboard Summary Types
// ==========================================

export interface OverviewStats {
  totalLGAs: number;
  totalWards: number;
  wardsReported: number;
  lgasReported: number;
  compliancePercent: number;
}

export interface ProcessIntegrityStats {
  timelinessScore: number;
  accessScore: number;
  complianceScore: number;
  overallIntegrityScore: number;
  lateStartPercent: number;
  deniedAccessPercent: number;
}

export interface SecurityStats {
  totalIncidents: number;
  intimidationCount: number;
  disruptionAttempts: number;
  disagreements: number;
  incidentsByLGA: Record<string, number>;
}

export interface ResultsSummary {
  partyTotals: PartyResults;
  leadingParty: string;
  marginOfVictory: number;
  totalValidVotes: number;
  totalRejectedVotes: number;
}

export interface TurnoutStats {
  overallTurnout: number;
  cancelledPUs: number;
  lostVoters: number;
  turnoutByLGA: Record<string, number>;
}

export interface RedFlagSummary {
  noObserverAccess: number;
  noCountersignatures: number;
  lateStarts: number;
  integrityViolations: number;
  flaggedLocations: string[];
}

// ==========================================
// Risk Levels
// ==========================================

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export const calculateRiskLevel = (report: WardCollationReport | LGACollationReport): RiskLevel => {
  let riskScore = 0;
  
  if (!report.observerAccess.permittedToObserve) riskScore += 3;
  if (report.incidents.intimidationOrHarassment) riskScore += 3;
  if (report.incidents.attemptedDisruption) riskScore += 2;
  if (report.incidents.disagreementWithResults) riskScore += 2;
  if (!report.staffing.securityAgentsPresent) riskScore += 1;
  if (report.timeliness.isLateStart) riskScore += 1;
  
  // Integrity checks
  const integrityChecks = Object.values(report.integrity);
  const failedChecks = integrityChecks.filter(v => !v).length;
  riskScore += Math.floor(failedChecks / 2);
  
  if (riskScore >= 8) return 'critical';
  if (riskScore >= 6) return 'high';
  if (riskScore >= 3) return 'medium';
  if (riskScore >= 1) return 'low';
  return 'none';
};

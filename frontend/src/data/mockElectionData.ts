// Mock Election Data for Abuja FCT Dashboard

import {
  WardCollationReport,
  LGACollationReport,
  OverviewStats,
  ProcessIntegrityStats,
  SecurityStats,
  ResultsSummary,
  TurnoutStats,
  RedFlagSummary,
  ArrivalTimeCategory,
  CollationStartCategory,
  CountersignStatus,
  RiskLevel,
} from './electionTypes';

// ==========================================
// LGA Data
// ==========================================

export interface LGASummary {
  id: string;
  name: string;
  shortName: string;
  wards: number;
  pollingUnits: number;
  registeredVoters: number;
  accreditedVoters: number;
  votesCast: number;
  validVotes: number;
  rejectedVotes: number;
  turnoutPercent: number;
  wardsReported: number;
  complianceScore: number;
  incidentCount: number;
  incidentBreakdown: Record<string, number>;
  deniedAccessCount: number;
  lateStartCount: number;
  cancelledPUs: number;
  lostVoters: number;
  securityPresent: number;
  observerCoverage: number;
  riskLevel: RiskLevel;
  coordinates: { lat: number; lng: number };
  partyResults: {
    apc: number;
    lp: number;
    pdp: number;
    nnpp: number;
    apga: number;
    others: number;
  };
}

export const LGA_DATA: LGASummary[] = [
  {
    id: 'abaji',
    name: 'Abaji',
    shortName: 'ABJ',
    wards: 10,
    pollingUnits: 156,
    registeredVoters: 89420,
    accreditedVoters: 52180,
    votesCast: 48650,
    validVotes: 47200,
    rejectedVotes: 1450,
    turnoutPercent: 54.4,
    wardsReported: 10,
    complianceScore: 92,
    incidentCount: 3,
    deniedAccessCount: 0,
    lateStartCount: 1,
    cancelledPUs: 2,
    lostVoters: 1240,
    securityPresent: 95,
    observerCoverage: 78,
    riskLevel: 'low',
    coordinates: { lat: 8.4667, lng: 6.9500 },
    incidentBreakdown: { intimidation: 1, violence: 0, disruption: 1, disagreement: 1 },
    partyResults: { apc: 18500, lp: 12300, pdp: 9800, nnpp: 3200, apga: 1800, others: 1600 },
  },
  {
    id: 'bwari',
    name: 'Bwari',
    shortName: 'BWR',
    wards: 10,
    pollingUnits: 298,
    registeredVoters: 245780,
    accreditedVoters: 156420,
    votesCast: 142800,
    validVotes: 138900,
    rejectedVotes: 3900,
    turnoutPercent: 58.1,
    wardsReported: 9,
    complianceScore: 78,
    incidentCount: 8,
    deniedAccessCount: 2,
    lateStartCount: 3,
    cancelledPUs: 5,
    lostVoters: 4200,
    securityPresent: 85,
    observerCoverage: 85,
    riskLevel: 'medium',
    coordinates: { lat: 9.2833, lng: 7.3833 },
    incidentBreakdown: { intimidation: 2, violence: 1, disruption: 3, disagreement: 2 },
    partyResults: { apc: 52400, lp: 45200, pdp: 28600, nnpp: 7200, apga: 3100, others: 2400 },
  },
  {
    id: 'gwagwalada',
    name: 'Gwagwalada',
    shortName: 'GWG',
    wards: 10,
    pollingUnits: 189,
    registeredVoters: 168540,
    accreditedVoters: 98760,
    votesCast: 91230,
    validVotes: 88400,
    rejectedVotes: 2830,
    turnoutPercent: 54.1,
    wardsReported: 10,
    complianceScore: 88,
    incidentCount: 5,
    deniedAccessCount: 1,
    lateStartCount: 2,
    cancelledPUs: 3,
    lostVoters: 2100,
    securityPresent: 90,
    observerCoverage: 82,
    riskLevel: 'low',
    coordinates: { lat: 8.9500, lng: 7.0833 },
    incidentBreakdown: { intimidation: 1, violence: 0, disruption: 2, disagreement: 2 },
    partyResults: { apc: 32100, lp: 28500, pdp: 18900, nnpp: 4800, apga: 2100, others: 2000 },
  },
  {
    id: 'kuje',
    name: 'Kuje',
    shortName: 'KUJ',
    wards: 10,
    pollingUnits: 178,
    registeredVoters: 142890,
    accreditedVoters: 78540,
    votesCast: 72450,
    validVotes: 69800,
    rejectedVotes: 2650,
    turnoutPercent: 50.7,
    wardsReported: 8,
    complianceScore: 62,
    incidentCount: 12,
    deniedAccessCount: 4,
    lateStartCount: 5,
    cancelledPUs: 8,
    lostVoters: 5600,
    securityPresent: 68,
    observerCoverage: 71,
    riskLevel: 'high',
    coordinates: { lat: 8.8833, lng: 7.2333 },
    incidentBreakdown: { intimidation: 4, violence: 2, disruption: 3, disagreement: 3 },
    partyResults: { apc: 28200, lp: 18900, pdp: 14200, nnpp: 4800, apga: 1900, others: 1800 },
  },
  {
    id: 'kwali',
    name: 'Kwali',
    shortName: 'KWL',
    wards: 10,
    pollingUnits: 145,
    registeredVoters: 98760,
    accreditedVoters: 58420,
    votesCast: 54180,
    validVotes: 52600,
    rejectedVotes: 1580,
    turnoutPercent: 54.9,
    wardsReported: 10,
    complianceScore: 95,
    incidentCount: 2,
    deniedAccessCount: 0,
    lateStartCount: 0,
    cancelledPUs: 1,
    lostVoters: 680,
    securityPresent: 98,
    observerCoverage: 88,
    riskLevel: 'none',
    coordinates: { lat: 8.7500, lng: 7.0167 },
    incidentBreakdown: { intimidation: 0, violence: 0, disruption: 1, disagreement: 1 },
    partyResults: { apc: 21200, lp: 15400, pdp: 9800, nnpp: 3200, apga: 1500, others: 1500 },
  },
  {
    id: 'amac',
    name: 'Abuja Municipal Area Council',
    shortName: 'AMAC',
    wards: 12,
    pollingUnits: 687,
    registeredVoters: 892450,
    accreditedVoters: 534680,
    votesCast: 498200,
    validVotes: 485600,
    rejectedVotes: 12600,
    turnoutPercent: 55.8,
    wardsReported: 11,
    complianceScore: 75,
    incidentCount: 24,
    deniedAccessCount: 6,
    lateStartCount: 8,
    cancelledPUs: 12,
    lostVoters: 15400,
    securityPresent: 82,
    observerCoverage: 92,
    riskLevel: 'medium',
    coordinates: { lat: 9.0765, lng: 7.3986 },
    incidentBreakdown: { intimidation: 6, violence: 2, disruption: 8, disagreement: 8 },
    partyResults: { apc: 178500, lp: 165200, pdp: 89400, nnpp: 28600, apga: 12400, others: 11500 },
  },
];

// ==========================================
// Ward Data Generator
// ==========================================

const WARD_NAMES: Record<string, string[]> = {
  abaji: ['Abaji Central', 'Agyana', 'Alu', 'Ewu', 'Gawu', 'Gurdi', 'Nuku', 'Pandagi', 'Rimba', 'Yaba'],
  bwari: ['Bwari Central', 'Byazhin', 'Igu', 'Kawu', 'Kuduru', 'Shere', 'Tokulo', 'Ushafa', 'Usuma', 'Uzango'],
  gwagwalada: ['Gwagwa I', 'Gwagwa II', 'Ibwa', 'Ikwa', 'Kutunku', 'Paiko', 'Passo', 'Tungamaje', 'Zuba I', 'Zuba II'],
  kuje: ['Chibiri', 'Gaube', 'Gwargwada', 'Kabi', 'Kuje', 'Kujekwa', 'Kwaku', 'Rubochi', 'Sabo Wuse', 'Yenche'],
  kwali: ['Dafa', 'Gbaupe', 'Gwagwa', 'Kilankwa', 'Kundu', 'Kwali', 'Pai', 'Sheda', 'Wako', 'Yangoji'],
  amac: ['City Centre', 'Garki I', 'Garki II', 'Gwarinpa', 'Gwagwa', 'Jiwa', 'Kabusa', 'Karu', 'Nyanya', 'Orozo', 'Wuse I', 'Wuse II'],
};

export interface WardSummary {
  id: string;
  lgaId: string;
  name: string;
  pollingUnits: number;
  registeredVoters: number;
  accreditedVoters: number;
  votesCast: number;
  validVotes: number;
  rejectedVotes: number;
  turnoutPercent: number;
  complianceScore: number;
  incidentCount: number;
  deniedAccess: boolean;
  lateStart: boolean;
  cancelledPUs: number;
  securityPresent: boolean;
  observerPresent: boolean;
  riskLevel: RiskLevel;
  arrivalCategory: ArrivalTimeCategory;
  startCategory: CollationStartCategory;
  partyResults: {
    apc: number;
    lp: number;
    pdp: number;
    nnpp: number;
    apga: number;
    others: number;
  };
  integrity: {
    ec8bSubmitted: boolean;
    ec8cCollated: boolean;
    csrvsDone: boolean;
    votesAnnounced: boolean;
    agentsCountersigned: boolean;
    ec60eDisplayed: boolean;
  };
}

export const generateWardData = (lgaId: string): WardSummary[] => {
  const wardNames = WARD_NAMES[lgaId] || [];
  const lga = LGA_DATA.find(l => l.id === lgaId);
  if (!lga) return [];

  return wardNames.map((name, index) => {
    const baseVoters = Math.floor(lga.registeredVoters / wardNames.length);
    const variance = Math.random() * 0.3 - 0.15;
    const registeredVoters = Math.floor(baseVoters * (1 + variance));
    const turnout = 45 + Math.random() * 25;
    const accreditedVoters = Math.floor(registeredVoters * (turnout / 100));
    const votesCast = Math.floor(accreditedVoters * (0.92 + Math.random() * 0.06));
    const rejectedVotes = Math.floor(votesCast * (0.02 + Math.random() * 0.03));
    const validVotes = votesCast - rejectedVotes;

    const hasIssues = Math.random() < 0.2;
    const arrivalCategories: ArrivalTimeCategory[] = ['Before 4pm', '4-5pm', '5-6pm', 'After 6pm'];
    const startCategories: CollationStartCategory[] = ['Before 4pm', '4-6pm', '6-9pm', '9pm-12am', 'Not started at midnight'];

    const riskLevels: RiskLevel[] = ['none', 'low', 'medium', 'high', 'critical'];
    const riskIndex = hasIssues ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2);

    return {
      id: `${lgaId}-ward-${index + 1}`,
      lgaId,
      name,
      pollingUnits: Math.floor(lga.pollingUnits / wardNames.length) + Math.floor(Math.random() * 10),
      registeredVoters,
      accreditedVoters,
      votesCast,
      validVotes,
      rejectedVotes,
      turnoutPercent: parseFloat(turnout.toFixed(1)),
      complianceScore: hasIssues ? 40 + Math.floor(Math.random() * 30) : 75 + Math.floor(Math.random() * 20),
      incidentCount: hasIssues ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 2),
      deniedAccess: hasIssues && Math.random() < 0.3,
      lateStart: hasIssues && Math.random() < 0.4,
      cancelledPUs: hasIssues ? Math.floor(Math.random() * 3) : 0,
      securityPresent: !hasIssues || Math.random() > 0.3,
      observerPresent: !hasIssues || Math.random() > 0.2,
      riskLevel: riskLevels[riskIndex],
      arrivalCategory: arrivalCategories[Math.floor(Math.random() * (hasIssues ? 4 : 2))],
      startCategory: startCategories[Math.floor(Math.random() * (hasIssues ? 5 : 3))],
      partyResults: {
        apc: Math.floor(validVotes * (0.35 + Math.random() * 0.15)),
        lp: Math.floor(validVotes * (0.25 + Math.random() * 0.15)),
        pdp: Math.floor(validVotes * (0.15 + Math.random() * 0.1)),
        nnpp: Math.floor(validVotes * (0.05 + Math.random() * 0.05)),
        apga: Math.floor(validVotes * (0.02 + Math.random() * 0.03)),
        others: Math.floor(validVotes * (0.01 + Math.random() * 0.02)),
      },
      integrity: {
        ec8bSubmitted: !hasIssues || Math.random() > 0.2,
        ec8cCollated: !hasIssues || Math.random() > 0.15,
        csrvsDone: !hasIssues || Math.random() > 0.25,
        votesAnnounced: !hasIssues || Math.random() > 0.1,
        agentsCountersigned: !hasIssues || Math.random() > 0.3,
        ec60eDisplayed: !hasIssues || Math.random() > 0.2,
      },
    };
  });
};

// ==========================================
// Dashboard Summary Stats
// ==========================================

export const getOverviewStats = (): OverviewStats => {
  const totalWards = LGA_DATA.reduce((sum, lga) => sum + lga.wards, 0);
  const wardsReported = LGA_DATA.reduce((sum, lga) => sum + lga.wardsReported, 0);
  const avgCompliance = LGA_DATA.reduce((sum, lga) => sum + lga.complianceScore, 0) / LGA_DATA.length;

  return {
    totalLGAs: LGA_DATA.length,
    totalWards,
    wardsReported,
    lgasReported: LGA_DATA.filter(l => l.wardsReported > 0).length,
    compliancePercent: parseFloat(avgCompliance.toFixed(1)),
  };
};

export const getProcessIntegrityStats = (data: LGASummary[]): ProcessIntegrityStats => {
  if (!data || data.length === 0) return {
    timelinessScore: 0,
    accessScore: 0,
    complianceScore: 0,
    overallIntegrityScore: 0,
    lateStartPercent: 0,
    deniedAccessPercent: 0
  };

  const totalWards = data.reduce((sum, lga) => sum + lga.wards, 0);
  const lateStarts = data.reduce((sum, lga) => sum + lga.lateStartCount, 0);
  const deniedAccess = data.reduce((sum, lga) => sum + lga.deniedAccessCount, 0);
  const avgCompliance = data.reduce((sum, lga) => sum + lga.complianceScore, 0) / data.length;

  return {
    timelinessScore: 100 - (lateStarts / totalWards) * 100,
    accessScore: 100 - (deniedAccess / totalWards) * 100,
    complianceScore: avgCompliance,
    overallIntegrityScore: (avgCompliance * 0.4 + (100 - (lateStarts / totalWards) * 100) * 0.3 + (100 - (deniedAccess / totalWards) * 100) * 0.3),
    lateStartPercent: parseFloat(((lateStarts / totalWards) * 100).toFixed(1)),
    deniedAccessPercent: parseFloat(((deniedAccess / totalWards) * 100).toFixed(1)),
  };
};

export const getSecurityStats = (data: LGASummary[]): SecurityStats => {
  if (!data || data.length === 0) return {
    totalIncidents: 0,
    intimidationCount: 0,
    disruptionAttempts: 0,
    disagreements: 0,
    incidentsByLGA: {}
  };

  const incidentsByLGA: Record<string, number> = {};
  let totalIncidents = 0;
  let intimidationCount = 0;
  let disruptionAttempts = 0;
  let disagreements = 0;

  data.forEach(lga => {
    incidentsByLGA[lga.id] = lga.incidentCount;
    totalIncidents += lga.incidentCount;
    if (lga.incidentBreakdown) {
      intimidationCount += lga.incidentBreakdown.intimidation || 0;
      disruptionAttempts += lga.incidentBreakdown.disruption || 0;
      disagreements += lga.incidentBreakdown.disagreement || 0;
    }
  });

  return {
    totalIncidents,
    intimidationCount,
    disruptionAttempts,
    disagreements,
    incidentsByLGA,
  };
};

export const getResultsSummary = (data: LGASummary[]): ResultsSummary => {
  if (!data || data.length === 0) return {
    partyTotals: { apc: 0, lp: 0, pdp: 0, nnpp: 0, apga: 0, sdp: 0, apm: 0, adc: 0, app: 0, ypp: 0, zlp: 0, others: 0 },
    totalValidVotes: 0,
    totalRejectedVotes: 0,
    leadingParty: 'None',
    marginOfVictory: 0,
  };

  const partyTotals = {
    apc: 0, lp: 0, pdp: 0, nnpp: 0, apga: 0,
    sdp: 0, apm: 0, adc: 0, app: 0, ypp: 0, zlp: 0, others: 0,
  };

  let totalRejected = 0;

  data.forEach(lga => {
    partyTotals.apc += lga.partyResults?.apc || 0;
    partyTotals.lp += lga.partyResults?.lp || 0;
    partyTotals.pdp += lga.partyResults?.pdp || 0;
    partyTotals.nnpp += lga.partyResults?.nnpp || 0;
    partyTotals.apga += lga.partyResults?.apga || 0;
    partyTotals.others += lga.partyResults?.others || 0;
    totalRejected += lga.rejectedVotes || 0;
  });

  const totalValid = Object.values(partyTotals).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(partyTotals).sort((a, b) => b[1] - a[1]);

  return {
    partyTotals,
    leadingParty: sorted[0][0].toUpperCase(),
    marginOfVictory: sorted[0][1] - sorted[1][1],
    totalValidVotes: totalValid,
    totalRejectedVotes: totalRejected,
  };
};

export const getTurnoutStats = (data: LGASummary[]): TurnoutStats => {
  if (!data || data.length === 0) return {
    overallTurnout: 0,
    cancelledPUs: 0,
    lostVoters: 0,
    turnoutByLGA: {}
  };

  const totalRegistered = data.reduce((sum, lga) => sum + lga.registeredVoters, 0);
  const totalVotes = data.reduce((sum, lga) => sum + lga.votesCast, 0);
  const cancelledPUs = data.reduce((sum, lga) => sum + lga.cancelledPUs, 0);
  const lostVoters = data.reduce((sum, lga) => sum + lga.lostVoters, 0);

  const turnoutByLGA: Record<string, number> = {};
  data.forEach(lga => {
    turnoutByLGA[lga.id] = lga.turnoutPercent;
  });

  return {
    overallTurnout: parseFloat(((totalVotes / totalRegistered) * 100).toFixed(1)),
    cancelledPUs,
    lostVoters,
    turnoutByLGA,
  };
};

export const getRedFlagSummary = (data: LGASummary[]): RedFlagSummary => {
  if (!data || data.length === 0) return {
    noObserverAccess: 0,
    noCountersignatures: 0,
    lateStarts: 0,
    integrityViolations: 0,
    flaggedLocations: []
  };

  const noObserverAccess = data.reduce((sum, lga) => sum + lga.deniedAccessCount, 0);
  const lateStarts = data.reduce((sum, lga) => sum + lga.lateStartCount, 0);

  let integrityViolations = 0;
  let noCountersignatures = 0;
  const flaggedLocations: string[] = [];

  data.forEach(lga => {
    if (lga.wardsReported > 0) {
      if (lga.riskLevel === 'high' || lga.riskLevel === 'critical') {
        flaggedLocations.push(lga.name);
      }
      if (lga.complianceScore < 70) {
        integrityViolations += Math.floor((100 - lga.complianceScore) / 10);
      }
      noCountersignatures += Math.floor(lga.wards * (1 - lga.complianceScore / 100) * 0.3);
    }
  });

  return {
    noObserverAccess,
    noCountersignatures,
    lateStarts,
    integrityViolations,
    flaggedLocations,
  };
};

// ==========================================
// Incident Data
// ==========================================

export interface Incident {
  id: string;
  type: 'violence' | 'intimidation' | 'vote_buying' | 'ballot_snatching' | 'device_failure' | 'missing_materials' | 'result_manipulation' | 'observer_harassment' | 'disagreement' | 'disruption';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  wardName: string;
  lgaId: string;
  lgaName: string;
  timestamp: string;
  status: 'reported' | 'investigating' | 'resolved';
  reportedBy: string;
}

export const RECENT_INCIDENTS: Incident[] = [];

// ==========================================
// FCT Aggregate Stats
// ==========================================

export const FCT_STATS = {
  totalPollingUnits: LGA_DATA.reduce((sum, lga) => sum + lga.pollingUnits, 0),
  totalRegisteredVoters: LGA_DATA.reduce((sum, lga) => sum + lga.registeredVoters, 0),
  totalAccreditedVoters: LGA_DATA.reduce((sum, lga) => sum + lga.accreditedVoters, 0),
  totalVotesCast: LGA_DATA.reduce((sum, lga) => sum + lga.votesCast, 0),
  totalValidVotes: LGA_DATA.reduce((sum, lga) => sum + lga.validVotes, 0),
  totalRejectedVotes: LGA_DATA.reduce((sum, lga) => sum + lga.rejectedVotes, 0),
  turnoutPercent: parseFloat((LGA_DATA.reduce((sum, lga) => sum + lga.votesCast, 0) / LGA_DATA.reduce((sum, lga) => sum + lga.registeredVoters, 0) * 100).toFixed(1)),
  activeIncidents: RECENT_INCIDENTS.filter(i => i.status !== 'resolved').length,
  resolvedIncidents: RECENT_INCIDENTS.filter(i => i.status === 'resolved').length,
  totalObservers: 2340,
  coveredUnits: 1486,
  lastUpdated: new Date().toISOString(),
};

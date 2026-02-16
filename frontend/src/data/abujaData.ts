// Abuja FCT Election Data Model

export interface PollingUnit {
  id: string;
  name: string;
  ward: string;
  areaCouncil: string;
  registeredVoters: number;
  accreditedVoters: number;
  votesCast: number;
  isOpen: boolean;
  openedAt?: string;
  staffPresent: boolean;
  bvasStatus: 'operational' | 'faulty' | 'offline';
  materialsDelivered: boolean;
  votersInQueue: number;
  hasPower: boolean;
  hasConnectivity: boolean;
  hasObserver: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  coordinates: { lat: number; lng: number };
}

export interface Ward {
  id: string;
  name: string;
  areaCouncil: string;
  pollingUnits: number;
  totalRegistered: number;
  totalAccredited: number;
  totalVotes: number;
  openUnits: number;
  incidentCount: number;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface AreaCouncil {
  id: string;
  name: string;
  shortName: string;
  wards: number;
  pollingUnits: number;
  totalRegistered: number;
  totalAccredited: number;
  totalVotes: number;
  turnoutPercent: number;
  openUnits: number;
  incidentCount: number;
  observersCoverage: number;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  color: string;
  coordinates: { lat: number; lng: number };
}

export interface Incident {
  id: string;
  type: 'violence' | 'intimidation' | 'vote_buying' | 'ballot_snatching' | 'device_failure' | 'missing_materials' | 'result_manipulation' | 'observer_harassment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  pollingUnit: string;
  ward: string;
  areaCouncil: string;
  timestamp: string;
  status: 'reported' | 'investigating' | 'resolved';
  reportedBy: string;
}

export const AREA_COUNCILS: AreaCouncil[] = [
  {
    id: 'abaji',
    name: 'Abaji',
    shortName: 'ABJ',
    wards: 10,
    pollingUnits: 156,
    totalRegistered: 89420,
    totalAccredited: 52180,
    totalVotes: 48650,
    turnoutPercent: 54.4,
    openUnits: 148,
    incidentCount: 3,
    observersCoverage: 78,
    riskLevel: 'low',
    color: '#22c55e',
    coordinates: { lat: 8.4667, lng: 6.9500 },
  },
  {
    id: 'bwari',
    name: 'Bwari',
    shortName: 'BWR',
    wards: 10,
    pollingUnits: 298,
    totalRegistered: 245780,
    totalAccredited: 156420,
    totalVotes: 142800,
    turnoutPercent: 58.1,
    openUnits: 290,
    incidentCount: 8,
    observersCoverage: 85,
    riskLevel: 'medium',
    color: '#eab308',
    coordinates: { lat: 9.2833, lng: 7.3833 },
  },
  {
    id: 'gwagwalada',
    name: 'Gwagwalada',
    shortName: 'GWG',
    wards: 10,
    pollingUnits: 189,
    totalRegistered: 168540,
    totalAccredited: 98760,
    totalVotes: 91230,
    turnoutPercent: 54.1,
    openUnits: 182,
    incidentCount: 5,
    observersCoverage: 82,
    riskLevel: 'low',
    color: '#22c55e',
    coordinates: { lat: 8.9500, lng: 7.0833 },
  },
  {
    id: 'kuje',
    name: 'Kuje',
    shortName: 'KUJ',
    wards: 10,
    pollingUnits: 178,
    totalRegistered: 142890,
    totalAccredited: 78540,
    totalVotes: 72450,
    turnoutPercent: 50.7,
    openUnits: 165,
    incidentCount: 12,
    observersCoverage: 71,
    riskLevel: 'high',
    color: '#f97316',
    coordinates: { lat: 8.8833, lng: 7.2333 },
  },
  {
    id: 'kwali',
    name: 'Kwali',
    shortName: 'KWL',
    wards: 10,
    pollingUnits: 145,
    totalRegistered: 98760,
    totalAccredited: 58420,
    totalVotes: 54180,
    turnoutPercent: 54.9,
    openUnits: 140,
    incidentCount: 2,
    observersCoverage: 88,
    riskLevel: 'none',
    color: '#22c55e',
    coordinates: { lat: 8.7500, lng: 7.0167 },
  },
  {
    id: 'amac',
    name: 'Abuja Municipal Area Council',
    shortName: 'AMAC',
    wards: 12,
    pollingUnits: 687,
    totalRegistered: 892450,
    totalAccredited: 534680,
    totalVotes: 498200,
    turnoutPercent: 55.8,
    openUnits: 672,
    incidentCount: 24,
    observersCoverage: 92,
    riskLevel: 'medium',
    color: '#eab308',
    coordinates: { lat: 9.0765, lng: 7.3986 },
  },
];

export const RECENT_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    type: 'device_failure',
    severity: 'high',
    description: 'BVAS machine malfunction preventing voter accreditation',
    pollingUnit: 'PU-AMAC-045',
    ward: 'Wuse I',
    areaCouncil: 'AMAC',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    status: 'investigating',
    reportedBy: 'Observer Team Alpha',
  },
  {
    id: 'INC-002',
    type: 'vote_buying',
    severity: 'critical',
    description: 'Suspected vote buying activity near polling unit entrance',
    pollingUnit: 'PU-KUJE-023',
    ward: 'Rubochi',
    areaCouncil: 'Kuje',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'investigating',
    reportedBy: 'Anonymous Citizen',
  },
  {
    id: 'INC-003',
    type: 'missing_materials',
    severity: 'medium',
    description: 'Ballot papers shortage reported',
    pollingUnit: 'PU-BWARI-089',
    ward: 'Ushafa',
    areaCouncil: 'Bwari',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'resolved',
    reportedBy: 'Presiding Officer',
  },
  {
    id: 'INC-004',
    type: 'intimidation',
    severity: 'high',
    description: 'Armed individuals spotted near polling unit',
    pollingUnit: 'PU-KUJE-067',
    ward: 'Chibiri',
    areaCouncil: 'Kuje',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    status: 'investigating',
    reportedBy: 'Security Personnel',
  },
  {
    id: 'INC-005',
    type: 'observer_harassment',
    severity: 'medium',
    description: 'Observer prevented from entering polling unit',
    pollingUnit: 'PU-AMAC-234',
    ward: 'Garki II',
    areaCouncil: 'AMAC',
    timestamp: new Date(Date.now() - 48 * 60000).toISOString(),
    status: 'reported',
    reportedBy: 'Observer Team Delta',
  },
];

export const FCT_STATS = {
  totalPollingUnits: 1653,
  openPollingUnits: 1597,
  totalRegisteredVoters: 1637840,
  totalAccreditedVoters: 979000,
  totalVotesCast: 907510,
  turnoutPercent: 55.4,
  activeIncidents: 54,
  resolvedIncidents: 128,
  totalObservers: 2340,
  coveredUnits: 1486,
  lastUpdated: new Date().toISOString(),
};

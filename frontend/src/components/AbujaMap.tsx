import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { AREA_COUNCILS, AreaCouncil } from "@/data/abujaData";
import { LGASummary } from "@/data/mockElectionData";
import { RiskBadge } from "./RiskBadge";
import { MapPin, Users, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { FilterType } from "./QuickFilters";

interface AbujaMapProps {
  onSelectCouncil?: (council: AreaCouncil | null) => void;
  selectedCouncil?: AreaCouncil | null;
  activeFilter?: FilterType;
  data: LGASummary[]; // Added data prop, but AbujaMap iterates AREA_COUNCILS constant. 
  // We need to either map over 'data' or mapping 'AREA_COUNCILS' and finding match in 'data'.
  // Using AREA_COUNCILS for geometry is fine, but we need data for coloring.
}

export const AbujaMap = ({ onSelectCouncil, selectedCouncil, activeFilter = 'all', data }: AbujaMapProps) => {
  const [hoveredCouncil, setHoveredCouncil] = useState<string | null>(null);

  // Filter councils based on active filter
  const filteredCouncils = useMemo(() => {
    switch (activeFilter) {
      case 'high-risk':
        return data.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical');
      case 'low-turnout':
        return data.filter(c => c.turnoutPercent < 52);
      case 'incidents':
        return data.filter(c => c.incidentCount > 0);
      case 'open':
        return data; // Open units logic might differ, for now return all
      default:
        return data; // Return LGASummary list
    }
  }, [activeFilter, data]);

  const filteredIds = useMemo(() => new Set(filteredCouncils.map(c => c.id)), [filteredCouncils]);

  // More accurate SVG paths representing Abuja FCT Area Councils
  // Based on actual geographical positions
  // More accurate SVG paths representing Abuja FCT Area Councils
  // Based on approximate geographical shapes
  const councilPaths: Record<string, { path: string; labelPos: { x: number; y: number } }> = {
    // Abaji - Southwest tail
    abaji: {
      path: "M40,320 L75,310 L110,325 L125,360 L100,400 L60,390 L30,350 Z",
      labelPos: { x: 75, y: 350 },
    },
    // Kwali - Central West
    kwali: {
      path: "M50,220 L95,200 L140,210 L155,255 L125,300 L110,325 L75,310 L40,320 L30,260 Z",
      labelPos: { x: 95, y: 260 },
    },
    // Gwagwalada - North West
    gwagwalada: {
      path: "M80,120 L150,110 L180,130 L190,175 L160,220 L140,210 L95,200 L60,165 Z",
      labelPos: { x: 130, y: 170 },
    },
    // Kuje - Central South
    kuje: {
      path: "M160,220 L190,175 L240,190 L260,240 L240,290 L200,310 L125,300 L155,255 Z",
      labelPos: { x: 195, y: 250 },
    },
    // AMAC - East/North East (City Centre)
    amac: {
      path: "M180,130 L230,90 L290,100 L320,150 L310,210 L260,240 L240,190 L190,175 Z",
      labelPos: { x: 250, y: 160 },
    },
    // Bwari - Far North
    bwari: {
      path: "M230,90 L270,40 L330,50 L350,110 L320,150 L290,100 Z",
      labelPos: { x: 295, y: 90 },
    },
  };

  const getRiskColor = (level: AreaCouncil['riskLevel']) => {
    switch (level) {
      case 'critical': return 'fill-red-100 stroke-red-500 hover:fill-red-200';
      case 'high': return 'fill-orange-100 stroke-orange-500 hover:fill-orange-200';
      case 'medium': return 'fill-amber-100 stroke-amber-500 hover:fill-amber-200';
      case 'low': return 'fill-emerald-100 stroke-emerald-500 hover:fill-emerald-200';
      default: return 'fill-slate-100 stroke-slate-400 hover:fill-slate-200';
    }
  };

  const getSelectedColor = (level: AreaCouncil['riskLevel']) => {
    switch (level) {
      case 'critical': return 'fill-red-200 stroke-red-600';
      case 'high': return 'fill-orange-200 stroke-orange-600';
      case 'medium': return 'fill-amber-200 stroke-amber-600';
      case 'low': return 'fill-emerald-200 stroke-emerald-600';
      default: return 'fill-slate-200 stroke-slate-500';
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Abuja FCT Map</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-200 border border-emerald-500" /> Low Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-amber-200 border border-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-orange-200 border border-orange-500" /> High Risk
          </span>
        </div>
      </div>

      <div className="relative p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Compass indicator */}
        <div className="absolute top-4 right-4 text-xs text-muted-foreground font-medium">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-primary font-bold">N</span>
            <div className="h-4 w-px bg-muted-foreground/30" />
          </div>
        </div>

        {/* Map SVG */}
        <svg
          viewBox="0 0 400 420"
          className="w-full h-auto max-h-[420px]"
        >
          {/* Water/background features */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210 20% 96%)" />
              <stop offset="100%" stopColor="hsl(210 20% 93%)" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* FCT Outline */}
          <path
            d="M35,210 L40,180 L60,140 L90,120 L130,100 L180,80 L220,45 L280,35 L340,50 L365,95 L370,150 L340,200 L315,270 L295,330 L250,365 L180,380 L120,395 L55,380 L30,330 L25,270 Z"
            className="fill-slate-200/50 stroke-slate-300"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Area Council regions */}
          {AREA_COUNCILS.map((council) => {
            const pathData = councilPaths[council.id];
            if (!pathData) return null;

            const lga = data.find(d => d.id === council.id); // Find data for this council
            if (!lga) return null; // Or render gray? Let's assume data exists.

            const isSelected = selectedCouncil?.id === council.id;
            const isHovered = hoveredCouncil === council.id;
            const isFiltered = filteredIds.has(council.id);
            const isDimmed = activeFilter !== 'all' && !isFiltered;

            return (
              <g
                key={council.id}
                className={cn(
                  "transition-all duration-300",
                  isDimmed ? "opacity-25 cursor-not-allowed" : "cursor-pointer"
                )}
                onClick={() => !isDimmed && onSelectCouncil?.(isSelected ? null : council)}
                onMouseEnter={() => !isDimmed && setHoveredCouncil(council.id)}
                onMouseLeave={() => setHoveredCouncil(null)}
                filter={isSelected || isHovered ? "url(#shadow)" : undefined}
              >
                <path
                  d={pathData.path}
                  className={cn(
                    "transition-all duration-200 stroke-2",
                    isDimmed
                      ? "fill-slate-100 stroke-slate-300"
                      : isSelected
                        ? getSelectedColor(lga.riskLevel as any) + " stroke-[3]"
                        : getRiskColor(lga.riskLevel as any),
                    isHovered && !isSelected && !isDimmed && "stroke-[2.5]"
                  )}
                />
                {/* Label */}
                <text
                  x={pathData.labelPos.x}
                  y={pathData.labelPos.y - 8}
                  className={cn(
                    "text-[11px] font-bold pointer-events-none transition-all duration-300",
                    isDimmed ? "fill-slate-400" : "fill-slate-700"
                  )}
                  textAnchor="middle"
                >
                  {council.shortName}
                </text>
                <text
                  x={pathData.labelPos.x}
                  y={pathData.labelPos.y + 6}
                  className={cn(
                    "text-[9px] pointer-events-none transition-all duration-300",
                    isDimmed ? "fill-slate-400" : "fill-slate-500"
                  )}
                  textAnchor="middle"
                >
                  {lga.turnoutPercent}% turnout
                </text>

                {/* Incident indicator */}
                {lga.incidentCount > 5 && !isDimmed && (
                  <g className="transition-all duration-300">
                    <circle
                      cx={pathData.labelPos.x + 30}
                      cy={pathData.labelPos.y - 15}
                      r="10"
                      className="fill-white"
                    />
                    <circle
                      cx={pathData.labelPos.x + 30}
                      cy={pathData.labelPos.y - 15}
                      r="8"
                      className="fill-red-500"
                    />
                    <text
                      x={pathData.labelPos.x + 30}
                      y={pathData.labelPos.y - 11}
                      className="text-[8px] font-bold fill-white pointer-events-none"
                      textAnchor="middle"
                    >
                      {lga.incidentCount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* City center marker for AMAC */}
          <g>
            <circle cx="260" cy="150" r="4" className="fill-primary" />
            <circle cx="260" cy="150" r="8" className="fill-primary/20" />
            <text x="260" y="138" className="text-[8px] fill-primary font-medium pointer-events-none" textAnchor="middle">
              City Centre
            </text>
          </g>
        </svg>

        {/* Click instruction */}
        {!selectedCouncil && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Click on an area council to view detailed information
          </p>
        )}
      </div>

      {/* Detail Panel */}
      {selectedCouncil && (
        <div className="border-t border-border p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-lg text-foreground">{selectedCouncil.name}</h4>
              <p className="text-xs text-muted-foreground">
                {selectedCouncil.wards} Wards • {selectedCouncil.pollingUnits} Polling Units
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={selectedCouncil.riskLevel} />
              <button
                onClick={() => onSelectCouncil?.(selectedCouncil)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                View Details <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-xl font-bold font-mono text-foreground">{selectedCouncil.turnoutPercent}%</div>
              <div className="text-xs text-muted-foreground">Turnout</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
              <div className="text-xl font-bold font-mono text-emerald-700">{selectedCouncil.openUnits}</div>
              <div className="text-xs text-emerald-600">Open Units</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
              <div className="text-xl font-bold font-mono text-amber-700">{selectedCouncil.incidentCount}</div>
              <div className="text-xs text-amber-600">Incidents</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-xl font-bold font-mono text-blue-700">{selectedCouncil.observersCoverage}%</div>
              <div className="text-xs text-blue-600">Coverage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

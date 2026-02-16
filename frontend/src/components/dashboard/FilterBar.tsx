import { useState } from "react";
import { Filter, ChevronDown, X, Calendar, MapPin } from "lucide-react";
import { LGA_DATA, generateWardData, WardSummary } from "@/data/mockElectionData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterState {
  lgaId: string | null;
  wardId: string | null;
  incidentType: string | null;
  riskLevel: string | null;
  timeWindow: string | null;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const INCIDENT_TYPES = [
  { value: 'violence', label: 'Violence' },
  { value: 'intimidation', label: 'Intimidation' },
  { value: 'vote_buying', label: 'Vote Buying' },
  { value: 'device_failure', label: 'Device Failure' },
  { value: 'missing_materials', label: 'Missing Materials' },
  { value: 'observer_harassment', label: 'Observer Harassment' },
  { value: 'disagreement', label: 'Result Disagreement' },
  { value: 'disruption', label: 'Disruption' },
];

const RISK_LEVELS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'None' },
];

const TIME_WINDOWS = [
  { value: 'before-4pm', label: 'Before 4pm' },
  { value: '4-6pm', label: '4pm - 6pm' },
  { value: '6-9pm', label: '6pm - 9pm' },
  { value: '9pm-12am', label: '9pm - 12am' },
];

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const [wards, setWards] = useState<WardSummary[]>([]);

  const handleLGAChange = (value: string) => {
    const lgaId = value === 'all' ? null : value;
    if (lgaId) {
      setWards(generateWardData(lgaId));
    } else {
      setWards([]);
    }
    onFiltersChange({ ...filters, lgaId, wardId: null });
  };

  const handleWardChange = (value: string) => {
    onFiltersChange({ ...filters, wardId: value === 'all' ? null : value });
  };

  const handleIncidentChange = (value: string) => {
    onFiltersChange({ ...filters, incidentType: value === 'all' ? null : value });
  };

  const handleRiskChange = (value: string) => {
    onFiltersChange({ ...filters, riskLevel: value === 'all' ? null : value });
  };

  const handleTimeChange = (value: string) => {
    onFiltersChange({ ...filters, timeWindow: value === 'all' ? null : value });
  };

  const clearFilters = () => {
    setWards([]);
    onFiltersChange({
      lgaId: null,
      wardId: null,
      incidentType: null,
      riskLevel: null,
      timeWindow: null,
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Filters & Drill-Down</h3>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* LGA Filter */}
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-muted-foreground mb-1 block">Area Council</label>
          <Select value={filters.lgaId || 'all'} onValueChange={handleLGAChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Area Councils" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="all">All Area Councils</SelectItem>
              {LGA_DATA.map((lga) => (
                <SelectItem key={lga.id} value={lga.id}>
                  {lga.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward Filter */}
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-muted-foreground mb-1 block">Ward</label>
          <Select
            value={filters.wardId || 'all'}
            onValueChange={handleWardChange}
            disabled={!filters.lgaId}
          >
            <SelectTrigger className={cn("h-9 text-sm", !filters.lgaId && "opacity-50")}>
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="all">All Wards</SelectItem>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Incident Type Filter */}
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-muted-foreground mb-1 block">Incident Type</label>
          <Select value={filters.incidentType || 'all'} onValueChange={handleIncidentChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="all">All Types</SelectItem>
              {INCIDENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Risk Level Filter */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 block">Risk Level</label>
          <Select value={filters.riskLevel || 'all'} onValueChange={handleRiskChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="all">All Levels</SelectItem>
              {RISK_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Window Filter */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 block">Time Window</label>
          <Select value={filters.timeWindow || 'all'} onValueChange={handleTimeChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Times" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              <SelectItem value="all">All Times</SelectItem>
              {TIME_WINDOWS.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AREA_COUNCILS } from "@/data/abujaData";
import { Filter, MapPin, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterType = 'all' | 'high-risk' | 'low-turnout' | 'incidents' | 'open';

interface QuickFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const QuickFilters = ({ activeFilter, onFilterChange }: QuickFiltersProps) => {
  // Calculate dynamic counts based on actual data
  const highRiskCount = AREA_COUNCILS.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length;
  const lowTurnoutCount = AREA_COUNCILS.filter(c => c.turnoutPercent < 52).length;
  const incidentsCount = AREA_COUNCILS.reduce((sum, c) => sum + c.incidentCount, 0);
  const openUnitsCount = AREA_COUNCILS.reduce((sum, c) => sum + c.openUnits, 0);

  const filters: { id: FilterType; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'all', label: 'All Areas', icon: MapPin, count: AREA_COUNCILS.length },
    { id: 'high-risk', label: 'High Risk', icon: AlertTriangle, count: highRiskCount },
    { id: 'low-turnout', label: 'Low Turnout', icon: Users, count: lowTurnoutCount },
    { id: 'incidents', label: 'Active Incidents', icon: AlertTriangle, count: incidentsCount },
    { id: 'open', label: 'Units Open', icon: CheckCircle, count: openUnitsCount },
  ];

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Quick Filters</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "gap-2 transition-all",
                activeFilter === filter.id && "glow-primary"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {filter.label}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 px-1.5 py-0",
                  activeFilter === filter.id && "bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                {filter.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

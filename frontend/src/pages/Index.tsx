import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { AbujaMap } from "@/components/AbujaMap";
import { LGADetailModal } from "@/components/LGADetailModal";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { FilterBar, FilterState } from "@/components/dashboard/FilterBar";
import { ProcessIntegritySection } from "@/components/dashboard/ProcessIntegritySection";
import { SecurityIncidentsSection } from "@/components/dashboard/SecurityIncidentsSection";
import { ResultsSection } from "@/components/dashboard/ResultsSection";
import { TurnoutCancellationsSection } from "@/components/dashboard/TurnoutCancellationsSection";
import { RedFlagsSection } from "@/components/dashboard/RedFlagsSection";
import { LGAGrid } from "@/components/dashboard/LGAGrid";
import { LGA_DATA, LGASummary } from "@/data/mockElectionData";
import { api } from "@/services/api";
import { AreaCouncil } from "@/data/abujaData";

const Index = () => {
  const [selectedLGA, setSelectedLGA] = useState<LGASummary | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    lgaId: null,
    wardId: null,
    incidentType: null,
    riskLevel: null,
    timeWindow: null,
  });

  const [lgaData, setLgaData] = useState<LGASummary[]>([]);

  useEffect(() => {
    // Fetch initial data
    api.getAreaCouncils().then(data => setLgaData(data)).catch(console.error);

    // Determine if we should poll? The requirement says "Live Updates ... every 30s"
    const interval = setInterval(() => {
      api.getAreaCouncils().then(data => setLgaData(data)).catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectLGA = (lga: LGASummary) => {
    setSelectedLGA(lga);
    setDetailModalOpen(true);
  };

  // Filtered LGA data based on filter state
  const filteredLGAData = useMemo(() => {
    let data = [...lgaData];
    if (filters.lgaId) {
      data = data.filter(l => l.id === filters.lgaId);
    }
    if (filters.riskLevel) {
      data = data.filter(l => l.riskLevel === filters.riskLevel);
    }
    return data;
  }, [filters.lgaId, filters.riskLevel, lgaData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-[length:40px_40px] pointer-events-none opacity-[0.3]" />

      <Header />

      <main className="container mx-auto px-4 py-6 relative">
        {/* Overview Stats */}
        <OverviewSection lgaData={lgaData} />

        {/* Filter Bar */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left: Map & LGA Grid */}
          <div className="lg:col-span-7 space-y-6">
            <AbujaMap
              onSelectCouncil={(council) => {
                if (council) {
                  const lga = lgaData.find(l => l.id === council.id);
                  if (lga) handleSelectLGA(lga);
                }
              }}
              activeFilter={filters.riskLevel as any || 'all'}
              data={lgaData} // AbujaMap uses full data for rendering, filters internally via activeFilter prop
            />
            <LGAGrid
              onSelectLGA={handleSelectLGA}
              selectedLGAId={selectedLGA?.id}
              data={filteredLGAData}
              totalCount={lgaData.length}
            />
          </div>

          {/* Right: Analysis Panels */}
          <div className="lg:col-span-5 space-y-6">
            <ProcessIntegritySection data={filteredLGAData} />
            <SecurityIncidentsSection data={filteredLGAData} filterIncidentType={filters.incidentType} />
            <RedFlagsSection data={filteredLGAData} />
          </div>
        </div>

        {/* Results & Turnout Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ResultsSection data={filteredLGAData} />
          <TurnoutCancellationsSection data={filteredLGAData} />
        </div>

        {/* Footer */}
        <footer className="mt-8 py-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>Abuja Election Monitor • Federal Capital Territory, Nigeria</p>
          <p className="mt-1 text-xs">Data aggregated from multiple independent sources • Updated every 30 seconds</p>
        </footer>

        {/* LGA Detail Modal */}
        <LGADetailModal
          lga={selectedLGA}
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Index;

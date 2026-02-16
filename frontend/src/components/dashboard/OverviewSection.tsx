import { Users, CheckCircle2, Vote, TrendingUp, AlertTriangle, Eye, FileCheck, MapPin } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LiveIndicator } from "@/components/LiveIndicator";
import { LGASummary } from "@/data/mockElectionData";

interface OverviewSectionProps {
  lgaData: LGASummary[];
}

export const OverviewSection = ({ lgaData }: OverviewSectionProps) => {
  // Calculate specific stats from the data
  const totalLGAs = 6; // FCT has 6
  const lgasReported = lgaData.filter(l => l.wardsReported > 0).length;
  const totalWards = lgaData.reduce((sum, l) => sum + l.wards, 0);
  const wardsReported = lgaData.reduce((sum, l) => sum + l.wardsReported, 0);

  const totalRegistered = lgaData.reduce((sum, l) => sum + l.registeredVoters, 0);
  const totalAccredited = lgaData.reduce((sum, l) => sum + l.accreditedVoters, 0);
  const totalVotesCast = lgaData.reduce((sum, l) => sum + l.votesCast, 0);
  const totalIncidents = lgaData.reduce((sum, l) => sum + l.incidentCount, 0);

  // Calculate Compliance (avg of averages)
  const avgCompliance = lgaData.length > 0
    ? lgaData.reduce((sum, l) => sum + l.complianceScore, 0) / lgaData.length
    : 0;

  // Calculate Turnout
  const turnoutPercent = totalRegistered > 0
    ? ((totalVotesCast / totalRegistered) * 100).toFixed(2)
    : "0.00";

  const accreditationPercent = totalRegistered > 0
    ? ((totalAccredited / totalRegistered) * 100).toFixed(2)
    : "0.00";

  return (
    <section className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-foreground">Election Overview</h2>
        <LiveIndicator />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        <StatCard
          title="Area Councils"
          value={`${lgasReported}/${totalLGAs}`}
          icon={MapPin}
          subtitle="Reporting"
        />
        <StatCard
          title="Wards"
          value={`${wardsReported}/${totalWards}`}
          icon={FileCheck}
          subtitle="Reported"
        />
        <StatCard
          title="Registered"
          value={totalRegistered.toLocaleString()}
          icon={Users}
          subtitle="Voters"
        />
        <StatCard
          title="Accredited"
          value={totalAccredited.toLocaleString()}
          icon={CheckCircle2}
          variant="success"
          subtitle={`${accreditationPercent}%`}
        />
        <StatCard
          title="Votes Cast"
          value={totalVotesCast.toLocaleString()}
          icon={Vote}
          variant="info"
          subtitle="Total"
        />
        <StatCard
          title="Turnout"
          value={`${turnoutPercent}%`}
          icon={TrendingUp}
          subtitle="Overall"
        />
        <StatCard
          title="Incidents"
          value={totalIncidents}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Reported"
        />
        <StatCard
          title="Compliance"
          value={`${avgCompliance.toFixed(2)}%`}
          icon={Eye}
          variant={avgCompliance >= 80 ? "success" : "warning"}
          subtitle="Score"
        />
      </div>
    </section>
  );
};

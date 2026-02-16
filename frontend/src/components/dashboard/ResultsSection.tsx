import { BarChart3, Trophy, TrendingUp } from "lucide-react";
import { getResultsSummary, LGASummary } from "@/data/mockElectionData";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PARTY_COLORS: Record<string, string> = {
  apc: '#0066B3',
  lp: '#00A651',
  pdp: '#E31B23',
  nnpp: '#FFC107',
  apga: '#9C27B0',
  others: '#78909C',
};



interface ResultsSectionProps {
  data: LGASummary[];
}

export const ResultsSection = ({ data }: ResultsSectionProps) => {
  const results = getResultsSummary(data);

  const chartData = [
    { party: 'APC', votes: results.partyTotals.apc, color: PARTY_COLORS.apc },
    { party: 'LP', votes: results.partyTotals.lp, color: PARTY_COLORS.lp },
    { party: 'PDP', votes: results.partyTotals.pdp, color: PARTY_COLORS.pdp },
    { party: 'NNPP', votes: results.partyTotals.nnpp, color: PARTY_COLORS.nnpp },
    { party: 'APGA', votes: results.partyTotals.apga, color: PARTY_COLORS.apga },
    { party: 'Others', votes: results.partyTotals.others, color: PARTY_COLORS.others },
  ].sort((a, b) => b.votes - a.votes);

  const totalVotes = results.totalValidVotes + results.totalRejectedVotes;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Results Summary</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          <Trophy className="h-3 w-3" />
          <span className="font-medium">{results.leadingParty} Leading</span>
        </div>
      </div>

      {/* Lead Margin */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Margin of Victory</span>
          <span className="text-lg font-bold font-mono text-primary">
            {results.marginOfVictory.toLocaleString()} votes
          </span>
        </div>
      </div>

      {/* Party Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <XAxis type="number" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString()} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="party" tick={{ fontSize: 11 }} width={50} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Votes']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vote Breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-emerald-600">
            {results.totalValidVotes.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Valid Votes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-red-600">
            {results.totalRejectedVotes.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Rejected ({totalVotes > 0 ? ((results.totalRejectedVotes / totalVotes) * 100).toFixed(1) : "0.0"}%)
          </div>
        </div>
      </div>
    </div>
  );
};

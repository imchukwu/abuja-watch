import { AREA_COUNCILS } from "@/data/abujaData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = AREA_COUNCILS.map(council => ({
  name: council.shortName,
  turnout: council.turnoutPercent,
  fullName: council.name,
  registered: council.totalRegistered,
  voted: council.totalVotes,
  riskLevel: council.riskLevel,
}));

const getRiskColor = (level: string) => {
  switch (level) {
    case 'critical': return 'hsl(var(--risk-critical))';
    case 'high': return 'hsl(var(--risk-high))';
    case 'medium': return 'hsl(var(--risk-medium))';
    case 'low': return 'hsl(var(--risk-low))';
    default: return 'hsl(var(--primary))';
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-strong rounded-lg p-3 shadow-xl border border-border">
        <p className="font-semibold text-sm">{data.fullName}</p>
        <div className="mt-2 space-y-1 text-xs">
          <p className="text-muted-foreground">
            Turnout: <span className="font-mono font-semibold text-foreground">{Number(data.turnout).toFixed(2)}%</span>
          </p>
          <p className="text-muted-foreground">
            Registered: <span className="font-mono font-semibold text-foreground">{data.registered.toLocaleString()}</span>
          </p>
          <p className="text-muted-foreground">
            Voted: <span className="font-mono font-semibold text-foreground">{data.voted.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const TurnoutChart = () => {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Voter Turnout by Area Council</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          FCT Average: 55.4%
        </span>
      </div>

      <div className="p-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
            <Bar
              dataKey="turnout"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

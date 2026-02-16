import { cn } from "@/lib/utils";

type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showLabel?: boolean;
}

const riskConfig = {
  none: {
    label: 'Normal',
    bgColor: 'bg-risk-none/20',
    textColor: 'text-risk-none',
    borderColor: 'border-risk-none/30',
    dotColor: 'bg-risk-none',
  },
  low: {
    label: 'Low',
    bgColor: 'bg-risk-low/20',
    textColor: 'text-risk-low',
    borderColor: 'border-risk-low/30',
    dotColor: 'bg-risk-low',
  },
  medium: {
    label: 'Medium',
    bgColor: 'bg-risk-medium/20',
    textColor: 'text-risk-medium',
    borderColor: 'border-risk-medium/30',
    dotColor: 'bg-risk-medium',
  },
  high: {
    label: 'High',
    bgColor: 'bg-risk-high/20',
    textColor: 'text-risk-high',
    borderColor: 'border-risk-high/30',
    dotColor: 'bg-risk-high',
  },
  critical: {
    label: 'Critical',
    bgColor: 'bg-risk-critical/20',
    textColor: 'text-risk-critical',
    borderColor: 'border-risk-critical/30',
    dotColor: 'bg-risk-critical',
  },
};

export const RiskBadge = ({ level, className, showLabel = true }: RiskBadgeProps) => {
  const config = riskConfig[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor, level === 'critical' && 'animate-pulse')} />
      {showLabel && config.label}
    </div>
  );
};

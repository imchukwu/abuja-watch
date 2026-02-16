import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
  label?: string;
}

export const LiveIndicator = ({ className, label = "LIVE" }: LiveIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
      </div>
      <span className="text-xs font-semibold text-destructive tracking-wider">{label}</span>
    </div>
  );
};

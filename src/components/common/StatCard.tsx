import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  iconColor?: string;
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  badgeText,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700/80 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg border ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
          {badgeText && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {badgeText}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

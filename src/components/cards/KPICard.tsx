import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatChangeRate } from '@/utils/format';

export type GradientClass =
  | 'gradient-primary'
  | 'gradient-revenue'
  | 'gradient-margin'
  | 'gradient-wastage'
  | 'gradient-turnover'
  | 'gradient-output';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  yoy?: number;
  mom?: number;
  gradientClass: GradientClass;
  icon: LucideIcon;
  delay?: number;
}

export function KPICard({
  title,
  value,
  unit,
  yoy,
  mom,
  gradientClass,
  icon: Icon,
  delay = 0,
}: KPICardProps) {
  const yoyResult = yoy !== undefined ? formatChangeRate(yoy) : null;
  const momResult = mom !== undefined ? formatChangeRate(mom) : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white card-shadow card-shadow-hover animate-slide-up',
        gradientClass
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <p className="text-sm text-white/80 mb-1.5">{title}</p>

        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="font-serif-cn text-3xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-white/70">{unit}</span>}
        </div>

        <div className="flex items-center gap-4 text-xs">
          {yoyResult && (
            <div className="flex items-center gap-1">
              <span className="text-white/70">同比</span>
              {yoyResult.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-300" />
              ) : yoyResult.isNeutral ? (
                <span className="w-3.5 h-3.5 border-t-2 border-white/60 rounded-full"></span>
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-300" />
              )}
              <span
                className={cn(
                  'font-medium',
                  yoyResult.isPositive
                    ? 'text-green-300'
                    : yoyResult.isNeutral
                    ? 'text-white/70'
                    : 'text-red-300'
                )}
              >
                {yoyResult.text}
              </span>
            </div>
          )}

          {momResult && (
            <div className="flex items-center gap-1">
              <span className="text-white/70">环比</span>
              {momResult.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-300" />
              ) : momResult.isNeutral ? (
                <span className="w-3.5 h-3.5 border-t-2 border-white/60 rounded-full"></span>
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-300" />
              )}
              <span
                className={cn(
                  'font-medium',
                  momResult.isPositive
                    ? 'text-green-300'
                    : momResult.isNeutral
                    ? 'text-white/70'
                    : 'text-red-300'
                )}
              >
                {momResult.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

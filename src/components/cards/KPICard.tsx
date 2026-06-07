import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  yoy?: number;
  mom?: number;
  gradientClass: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  unit,
  yoy,
  mom,
  gradientClass,
  icon,
  delay = 0,
}: KPICardProps) {
  const isYoyPositive = (yoy || 0) >= 0;
  const isMomPositive = (mom || 0) >= 0;
  const yoyIsGood = title.includes('损耗') ? !isYoyPositive : isYoyPositive;
  const momIsGood = title.includes('损耗') ? !isMomPositive : isMomPositive;

  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 text-white overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 animate-slide-up',
        gradientClass,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-12 bottom-0 w-40 h-40 rounded-full bg-white/5" />

      <div className="relative flex items-start justify-between mb-3">
        <div className="text-sm text-white/80 font-medium">{title}</div>
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="relative mb-4">
        <span className="text-3xl font-bold font-serif-cn tracking-tight">{value}</span>
        {unit && <span className="ml-1 text-sm text-white/70">{unit}</span>}
      </div>

      {(yoy !== undefined || mom !== undefined) && (
        <div className="relative flex items-center gap-4 text-xs">
          {yoy !== undefined && (
            <div className={cn('flex items-center gap-1', yoyIsGood ? 'text-white' : 'text-white/70')}>
              <span className="text-white/60">同比</span>
              {yoyIsGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="font-semibold">
                {yoy > 0 ? '+' : ''}
                {yoy.toFixed(1)}%
              </span>
            </div>
          )}
          {mom !== undefined && (
            <div className={cn('flex items-center gap-1', momIsGood ? 'text-white' : 'text-white/70')}>
              <span className="text-white/60">环比</span>
              {momIsGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="font-semibold">
                {mom > 0 ? '+' : ''}
                {mom.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

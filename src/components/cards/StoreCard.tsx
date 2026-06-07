import { useNavigate } from 'react-router-dom';
import { MapPin, Users, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import type { Store, HealthLevel } from '@/types';
import { cn } from '@/lib/utils';
import { formatPercent, formatNumber } from '@/utils/format';

export interface StoreCardData extends Store {
  healthLevel?: HealthLevel;
  healthScore?: number;
  turnoverRate?: number;
  wastageRate?: number;
}

export interface StoreCardProps {
  store: StoreCardData;
  delay?: number;
}

const healthLevelConfig: Record<HealthLevel, { label: string; className: string; dotClassName: string }> = {
  excellent: {
    label: '优秀',
    className: 'bg-success/15 text-green-700 border-success/30',
    dotClassName: 'bg-success',
  },
  good: {
    label: '良好',
    className: 'bg-primary-100 text-primary-700 border-primary-200',
    dotClassName: 'bg-primary-600',
  },
  average: {
    label: '一般',
    className: 'bg-warning/15 text-warning border-warning/30',
    dotClassName: 'bg-warning',
  },
  poor: {
    label: '较差',
    className: 'bg-danger/15 text-danger border-danger/30',
    dotClassName: 'bg-danger',
  },
};

export function StoreCard({ store, delay = 0 }: StoreCardProps) {
  const navigate = useNavigate();

  const healthConfig = store.healthLevel
    ? healthLevelConfig[store.healthLevel]
    : null;

  const handleClick = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl p-5 card-shadow card-shadow-hover cursor-pointer animate-slide-up border border-primary-100/50"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif-cn text-lg font-semibold text-primary-900 truncate group-hover:text-primary-700 transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-primary-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{store.city} · {store.address}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-primary-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>

      {healthConfig && (
        <div className="mb-4">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium',
              healthConfig.className
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', healthConfig.dotClassName)}></span>
            健康状态 · {healthConfig.label}
            {store.healthScore !== undefined && (
              <span className="font-bold">{store.healthScore.toFixed(0)}分</span>
            )}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2.5 rounded-xl bg-primary-50/80">
          <div className="flex items-center justify-center gap-1 text-primary-500 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">翻台率</span>
          </div>
          <p className="font-serif-cn text-base font-semibold text-primary-800">
            {store.turnoverRate !== undefined
              ? formatNumber(store.turnoverRate, 1)
              : '--'}
          </p>
        </div>

        <div className="text-center p-2.5 rounded-xl bg-danger/5">
          <div className="flex items-center justify-center gap-1 text-danger/80 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs">损耗率</span>
          </div>
          <p className="font-serif-cn text-base font-semibold text-danger">
            {store.wastageRate !== undefined
              ? formatPercent(store.wastageRate)
              : '--'}
          </p>
        </div>

        <div className="text-center p-2.5 rounded-xl bg-accent-50">
          <div className="flex items-center justify-center gap-1 text-accent-600 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">员工数</span>
          </div>
          <p className="font-serif-cn text-base font-semibold text-accent-700">
            {store.staffCount ?? '--'}
          </p>
        </div>
      </div>
    </div>
  );
}

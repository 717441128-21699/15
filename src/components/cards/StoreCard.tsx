import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Utensils, ChevronRight, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import type { Store } from '../../types';
import { cn } from '../../lib/utils';
import { getHealthStatusLabel } from '../../utils/format';

interface StoreCardProps {
  store: Store;
  delay?: number;
}

const statusIcon: Record<string, React.ReactNode> = {
  excellent: <CheckCircle size={14} className="text-success" />,
  good: <Info size={14} className="text-info" />,
  average: <AlertTriangle size={14} className="text-warning" />,
  poor: <XCircle size={14} className="text-danger" />,
};

const statusBg: Record<string, string> = {
  excellent: 'bg-success/10 text-success',
  good: 'bg-info/10 text-info',
  average: 'bg-warning/10 text-warning',
  poor: 'bg-danger/10 text-danger',
};

export default function StoreCard({ store, delay = 0 }: StoreCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/store/${store.id}`)}
      className="bg-white rounded-xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-primary-800 group-hover:text-primary-600 transition-colors">
            {store.name}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-primary-400">
            <MapPin size={12} />
            <span>{store.city}</span>
          </div>
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium', statusBg[store.healthStatus])}>
          {statusIcon[store.healthStatus]}
          <span>{getHealthStatusLabel(store.healthStatus)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 rounded-lg bg-primary-50">
          <div className="flex items-center justify-center mb-1">
            <Utensils size={14} className="text-info" />
          </div>
          <div className="text-lg font-bold text-primary-700">{store.todayTurnover.toFixed(1)}</div>
          <div className="text-[10px] text-primary-400">翻台率</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-primary-50">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle size={14} className="text-warning" />
          </div>
          <div className={cn('text-lg font-bold', store.todayWastage > 5 ? 'text-danger' : 'text-primary-700')}>
            {store.todayWastage.toFixed(1)}%
          </div>
          <div className="text-[10px] text-primary-400">损耗率</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-primary-50">
          <div className="flex items-center justify-center mb-1">
            <Users size={14} className="text-primary-500" />
          </div>
          <div className="text-lg font-bold text-primary-700">{store.staffCount}</div>
          <div className="text-[10px] text-primary-400">员工数</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary-50">
        <span className="text-xs text-primary-400">{store.totalTables}张餐桌 · {store.brand}</span>
        <ChevronRight size={16} className="text-primary-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

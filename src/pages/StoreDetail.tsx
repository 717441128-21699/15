import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Utensils,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';
import SalesTrendChart from '../components/charts/SalesTrendChart';
import WastagePieChart from '../components/charts/WastagePieChart';
import TimeSlotChart from '../components/charts/TimeSlotChart';
import { api } from '../services/api';
import type { Store, SalesTrend, WastageCategory, TimeSlotData } from '../types';
import { cn } from '../lib/utils';
import { getHealthStatusLabel, formatNumber, formatPercent } from '../utils/format';

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

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [wastage, setWastage] = useState<WastageCategory[]>([]);
  const [timeSlot, setTimeSlot] = useState<TimeSlotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [storeData, trendData, wastageData, timeData] = await Promise.all([
          api.stores.detail(id),
          api.stores.salesTrend(id),
          api.stores.wastageCategory(id),
          api.stores.timeSlot(id),
        ]);
        setStore(storeData);
        setSalesTrend(trendData);
        setWastage(wastageData);
        setTimeSlot(timeData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading || !store) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-primary-400">数据加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white card-shadow hover:card-shadow-hover transition-all"
        >
          <ArrowLeft size={18} className="text-primary-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-serif-cn text-primary-800">{store.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-primary-400">
              <MapPin size={12} />
              {store.address}
            </span>
            <span className="text-xs text-primary-300">|</span>
            <span className="text-xs text-primary-400">{store.brand}</span>
          </div>
        </div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium', statusBg[store.healthStatus])}>
          {statusIcon[store.healthStatus]}
          <span>运营状态：{getHealthStatusLabel(store.healthStatus)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Utensils size={16} className="text-info" />
            </div>
            <span className="text-xs text-primary-400">今日翻台率</span>
          </div>
          <div className="text-2xl font-bold font-serif-cn text-primary-800">{formatNumber(store.todayTurnover)}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">共 {store.totalTables} 张餐桌</div>
        </div>

        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <AlertTriangle size={16} className={cn(store.todayWastage > 5 ? 'text-danger' : 'text-warning')} />
            </div>
            <span className="text-xs text-primary-400">今日损耗率</span>
          </div>
          <div className={cn('text-2xl font-bold font-serif-cn', store.todayWastage > 5 ? 'text-danger' : 'text-primary-800')}>
            {formatPercent(store.todayWastage)}
          </div>
          <div className="text-[10px] text-primary-400 mt-0.5">标准值 ≤ 5%</div>
        </div>

        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Users size={16} className="text-primary-500" />
            </div>
            <span className="text-xs text-primary-400">员工人数</span>
          </div>
          <div className="text-2xl font-bold font-serif-cn text-primary-800">{store.staffCount}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">含后厨 {Math.floor(store.staffCount * 0.6)} 人</div>
        </div>

        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <MapPin size={16} className="text-accent-500" />
            </div>
            <span className="text-xs text-primary-400">所在区域</span>
          </div>
          <div className="text-2xl font-bold font-serif-cn text-primary-800">{store.city}</div>
          <div className="text-[10px] text-primary-400 mt-0.5">{store.province}</div>
        </div>
      </div>

      <SalesTrendChart data={salesTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WastagePieChart data={wastage} />
        <TimeSlotChart data={timeSlot} />
      </div>
    </div>
  );
}

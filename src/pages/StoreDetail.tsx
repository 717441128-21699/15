import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Repeat,
  Trash2,
  Users,
  Table2,
} from 'lucide-react';
import { storeApi } from '@/services/api';
import { KPICard } from '@/components/cards/KPICard';
import SalesTrendChart from '@/components/charts/SalesTrendChart';
import WastagePieChart from '@/components/charts/WastagePieChart';
import TimeSlotChart from '@/components/charts/TimeSlotChart';
import { formatPercent, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import type {
  Store,
  SalesTrend,
  WastageCategory,
  TimeSlotData,
  HealthLevel,
} from '@/types';

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

interface StoreDetailData extends Store {
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    totalProfit: number;
    avgProfitMargin: number;
    avgFoodCostRate: number;
    avgLaborCostRate: number;
    avgSatisfaction: number;
  };
}

export default function StoreDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreDetailData | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [wastageCategories, setWastageCategories] = useState<WastageCategory[]>([]);
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const healthLevel: HealthLevel = 'good';
  const healthScore = 82;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [storeRes, salesRes, wastageRes, timeSlotRes] = await Promise.allSettled([
          storeApi.getStoreById(id),
          storeApi.getSalesTrend(id),
          storeApi.getWastageCategory(id),
          storeApi.getTimeSlots(id),
        ]);

        if (storeRes.status === 'fulfilled') setStore(storeRes.value as StoreDetailData);
        if (salesRes.status === 'fulfilled') setSalesTrend(salesRes.value);
        if (wastageRes.status === 'fulfilled') setWastageCategories(wastageRes.value);
        if (timeSlotRes.status === 'fulfilled') setTimeSlotData(timeSlotRes.value);

        if (storeRes.status === 'rejected') {
          setError(storeRes.reason instanceof Error ? storeRes.reason.message : '门店数据加载失败');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const todayTurnoverRate = 3.2;
  const todayWastageRate = 0.045;

  const healthConfig = healthLevelConfig[healthLevel];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">返回门店列表</span>
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-fade-in mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl card-shadow p-6 border border-primary-100/50">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="font-serif-cn text-2xl font-bold text-primary-900">
                  {loading ? (
                    <div className="h-8 w-48 bg-primary-100 rounded animate-pulse" />
                  ) : (
                    store?.name || '门店详情'
                  )}
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium',
                    healthConfig.className
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', healthConfig.dotClassName)}></span>
                  健康状态 · {healthConfig.label}
                  <span className="font-bold">{healthScore}分</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-500 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>
                  {loading ? (
                    <div className="h-4 w-64 bg-primary-100 rounded animate-pulse inline-block" />
                  ) : (
                    <>
                      {store?.city || ''}
                      {store?.province ? ` · ${store.province}` : ''}
                      {store?.address ? ` · ${store.address}` : ''}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-primary-100/50 animate-pulse"
            />
          ))
        ) : (
          <>
            <KPICard
              title="今日翻台率"
              value={formatNumber(todayTurnoverRate, 1)}
              unit="次/日"
              yoy={0.08}
              mom={0.05}
              gradientClass="gradient-turnover"
              icon={Repeat}
              delay={0}
            />
            <KPICard
              title="今日损耗率"
              value={formatPercent(todayWastageRate)}
              yoy={-0.02}
              mom={-0.01}
              gradientClass="gradient-wastage"
              icon={Trash2}
              delay={50}
            />
            <KPICard
              title="员工数"
              value={formatNumber(store?.staffCount || 0)}
              unit="人"
              gradientClass="gradient-output"
              icon={Users}
              delay={100}
            />
            <KPICard
              title="桌台数"
              value={formatNumber(store?.totalTables || 0)}
              unit="桌"
              gradientClass="gradient-primary"
              icon={Table2}
              delay={150}
            />
          </>
        )}
      </div>

      <div>
        {loading ? (
          <div className="h-[480px] rounded-xl bg-white card-shadow animate-pulse" />
        ) : (
          <SalesTrendChart data={salesTrend} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          {loading ? (
            <div className="h-[480px] rounded-xl bg-white card-shadow animate-pulse" />
          ) : (
            <WastagePieChart data={wastageCategories} />
          )}
        </div>
        <div>
          {loading ? (
            <div className="h-[480px] rounded-xl bg-white card-shadow animate-pulse" />
          ) : (
            <TimeSlotChart data={timeSlotData} />
          )}
        </div>
      </div>
    </div>
  );
}

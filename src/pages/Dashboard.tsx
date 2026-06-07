import { useState, useEffect } from 'react';
import { DollarSign, Repeat, Percent, Trash2, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import { kpiApi, storeApi, dishApi } from '@/services/api';
import { KPICard } from '@/components/cards/KPICard';
import { StoreCard, type StoreCardData } from '@/components/cards/StoreCard';
import TurnoverHeatmap from '@/components/charts/TurnoverHeatmap';
import MarginRanking from '@/components/charts/MarginRanking';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import type { KPIData, RegionHeatmapData, DishMargin, Store } from '@/types';

const fallbackHeatmapData: RegionHeatmapData[] = [
  { province: '上海', city: '上海', turnoverRate: 3.8, storeCount: 2, avgRevenue: 95000 },
  { province: '北京', city: '北京', turnoverRate: 3.5, storeCount: 1, avgRevenue: 88000 },
  { province: '广东', city: '广州', turnoverRate: 3.2, storeCount: 1, avgRevenue: 78000 },
  { province: '广东', city: '深圳', turnoverRate: 3.6, storeCount: 1, avgRevenue: 85000 },
  { province: '浙江', city: '杭州', turnoverRate: 3.1, storeCount: 1, avgRevenue: 75000 },
  { province: '四川', city: '成都', turnoverRate: 2.9, storeCount: 1, avgRevenue: 72000 },
  { province: '江苏', city: '南京', turnoverRate: 3.0, storeCount: 1, avgRevenue: 73000 },
  { province: '湖北', city: '武汉', turnoverRate: 2.7, storeCount: 1, avgRevenue: 68000 },
];

export default function Dashboard() {
  const { storeFilters, user } = useAppStore();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [stores, setStores] = useState<StoreCardData[]>([]);
  const [marginData, setMarginData] = useState<DishMargin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          city: storeFilters.city,
          brand: storeFilters.brand,
        };

        const [kpiResult, storesResult, marginResult] = await Promise.all([
          kpiApi.getSummary(params),
          storeApi.getStores(params),
          dishApi.getMarginRanking({ limit: 15 }),
        ]);

        setKpiData(kpiResult);

        const storesWithHealth: StoreCardData[] = storesResult.map((s, index) => ({
          ...(s as Store),
          brand: (s as Store & { brand?: string }).brand || '味道轩',
          province: (s as Store & { province?: string }).province || '',
          healthLevel: (['excellent', 'good', 'average', 'poor'] as const)[index % 4],
          healthScore: 75 + (index * 3) % 20,
          turnoverRate: 2.5 + (index * 0.15),
          wastageRate: 0.032 + (index * 0.004),
          staffCount: 15 + (index * 3),
        }));
        setStores(storesWithHealth);

        setMarginData(marginResult);
      } catch (e) {
        setError(e instanceof Error ? e.message : '数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeFilters.city, storeFilters.brand, user?.role]);

  const subtitleText = [
    storeFilters.city || '全部城市',
    storeFilters.brand || '全部品牌',
  ].join(' · ');

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-serif-cn text-3xl font-bold text-primary-900 mb-1">
          运营概览
        </h1>
        <p className="text-primary-500">{subtitleText}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {loading || !kpiData ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-primary-100/50 animate-pulse"
            />
          ))
        ) : (
          <>
            <KPICard
              title="总营收"
              value={formatCurrency(kpiData.totalRevenue)}
              yoy={kpiData.revenueYoY}
              mom={kpiData.revenueMoM}
              gradientClass="gradient-revenue"
              icon={DollarSign}
              delay={0}
            />
            <KPICard
              title="翻台率"
              value={formatNumber(kpiData.turnoverRate, 1)}
              unit="次/日"
              yoy={kpiData.turnoverRateYoY}
              mom={kpiData.turnoverRateMoM}
              gradientClass="gradient-turnover"
              icon={Repeat}
              delay={50}
            />
            <KPICard
              title="毛利率"
              value={formatPercent(kpiData.grossMargin)}
              yoy={kpiData.grossMarginYoY}
              mom={kpiData.grossMarginMoM}
              gradientClass="gradient-margin"
              icon={Percent}
              delay={100}
            />
            <KPICard
              title="食材损耗率"
              value={formatPercent(kpiData.wastageRate)}
              yoy={kpiData.wastageRateYoY}
              mom={kpiData.wastageRateMoM}
              gradientClass="gradient-wastage"
              icon={Trash2}
              delay={150}
            />
            <KPICard
              title="后厨人均产出"
              value={formatCurrency(kpiData.outputPerCapita)}
              unit="/人"
              yoy={kpiData.outputYoY}
              mom={kpiData.outputMoM}
              gradientClass="gradient-output"
              icon={Users}
              delay={200}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-[480px] rounded-xl bg-white card-shadow animate-pulse" />
          ) : (
            <TurnoverHeatmap data={fallbackHeatmapData} />
          )}
        </div>
        <div>
          {loading ? (
            <div className="h-[480px] rounded-xl bg-white card-shadow animate-pulse" />
          ) : (
            <MarginRanking data={marginData} />
          )}
        </div>
      </div>

      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif-cn text-xl font-semibold text-primary-800">
            门店列表
          </h2>
          <span className="text-sm text-primary-500">
            共 {stores.length} 家门店
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-white card-shadow animate-pulse"
              />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-xl card-shadow p-16 text-center">
            <p className="text-primary-500">暂无门店数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {stores.map((store, index) => (
              <StoreCard
                key={store.id}
                store={store}
                delay={index * 30}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

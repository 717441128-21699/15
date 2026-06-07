import { useEffect, useState } from 'react';
import { DollarSign, Repeat, Percent, Trash2, Users } from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import StoreCard from '../components/cards/StoreCard';
import TurnoverHeatmap from '../components/charts/TurnoverHeatmap';
import MarginRanking from '../components/charts/MarginRanking';
import { api } from '../services/api';
import { useAppStore } from '../store';
import type { KPIData, Store, RegionHeatmapData, DishMargin } from '../types';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

export default function Dashboard() {
  const { selectedCity, selectedBrand } = useAppStore();
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [heatmap, setHeatmap] = useState<RegionHeatmapData[]>([]);
  const [dishes, setDishes] = useState<DishMargin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [kpiData, storesData, heatmapData, dishesData] = await Promise.all([
          api.kpi.summary(),
          api.stores.list({ city: selectedCity === 'all' ? undefined : selectedCity, brand: selectedBrand === 'all' ? undefined : selectedBrand }),
          api.kpi.heatmap(),
          api.dishes.marginRanking({ type: 'top' }),
        ]);
        setKpi(kpiData);
        setStores(storesData);
        setHeatmap(heatmapData);
        setDishes(dishesData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCity, selectedBrand]);

  if (loading || !kpi) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-primary-400">数据加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold font-serif-cn text-primary-800">运营概览</h1>
        <p className="text-sm text-primary-400 mt-1">
          {selectedCity === 'all' ? '全国' : selectedCity} · {selectedBrand === 'all' ? '全部品牌' : selectedBrand} · 实时经营数据监控
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="总营收"
          value={formatCurrency(kpi.totalRevenue)}
          yoy={kpi.revenueYoY}
          mom={kpi.revenueMoM}
          gradientClass="gradient-revenue"
          icon={<DollarSign size={20} />}
          delay={0}
        />
        <KPICard
          title="翻台率"
          value={formatNumber(kpi.turnoverRate)}
          unit="次/日"
          yoy={kpi.turnoverRateYoY}
          mom={kpi.turnoverRateMoM}
          gradientClass="gradient-turnover"
          icon={<Repeat size={20} />}
          delay={50}
        />
        <KPICard
          title="毛利率"
          value={formatPercent(kpi.grossMargin)}
          yoy={kpi.grossMarginYoY}
          mom={kpi.grossMarginMoM}
          gradientClass="gradient-margin"
          icon={<Percent size={20} />}
          delay={100}
        />
        <KPICard
          title="食材损耗率"
          value={formatPercent(kpi.wastageRate)}
          yoy={kpi.wastageRateYoY}
          mom={kpi.wastageRateMoM}
          gradientClass="gradient-wastage"
          icon={<Trash2 size={20} />}
          delay={150}
        />
        <KPICard
          title="后厨人均产出"
          value={formatCurrency(kpi.outputPerCapita)}
          unit="/人"
          yoy={kpi.outputYoY}
          mom={kpi.outputMoM}
          gradientClass="gradient-output"
          icon={<Users size={20} />}
          delay={200}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TurnoverHeatmap data={heatmap} />
        </div>
        <div>
          <MarginRanking data={dishes} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold font-serif-cn text-primary-800">门店列表</h2>
            <p className="text-xs text-primary-400 mt-0.5">共 {stores.length} 家门店，点击查看详情</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stores.map((store, idx) => (
            <StoreCard key={store.id} store={store} delay={idx * 30} />
          ))}
        </div>
      </div>
    </div>
  );
}

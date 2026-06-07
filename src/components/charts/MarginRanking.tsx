import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { DishMargin } from '@/types';
import { dishApi } from '@/services/api';

interface MarginRankingProps {
  data: DishMargin[];
  storeId?: string;
}

type SortType = 'high' | 'low';
type CategoryType = 'all' | '热菜' | '素菜' | '海鲜' | '主食' | '凉菜';

const categories: { key: CategoryType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: '热菜', label: '热菜' },
  { key: '素菜', label: '素菜' },
  { key: '海鲜', label: '海鲜' },
  { key: '主食', label: '主食' },
  { key: '凉菜', label: '凉菜' },
];

function getMarginColor(margin: number): string {
  if (margin >= 60) return '#065f46';
  if (margin >= 50) return '#10b981';
  if (margin >= 40) return '#34d399';
  if (margin >= 30) return '#fbbf24';
  if (margin >= 20) return '#f97316';
  return '#ef4444';
}

function formatCurrency(value: number): string {
  return '¥' + value.toLocaleString('zh-CN');
}

export default function MarginRanking({ data, storeId }: MarginRankingProps) {
  const [sortType, setSortType] = useState<SortType>('high');
  const [category, setCategory] = useState<CategoryType>('all');
  const [loading, setLoading] = useState(false);

  const displayData = useMemo(() => {
    let filtered = [...data];

    if (category !== 'all') {
      filtered = filtered.filter((d) => d.category === category);
    }

    filtered.sort((a, b) =>
      sortType === 'high'
        ? b.grossMargin - a.grossMargin
        : a.grossMargin - b.grossMargin
    );

    return filtered.slice(0, 15);
  }, [data, sortType, category]);

  const handleSortChange = async (type: SortType) => {
    if (type === sortType) return;
    setSortType(type);
    setLoading(true);
    try {
      await dishApi.getMarginRanking({
        category: category === 'all' ? undefined : category,
        storeId,
        sort: type === 'high' ? 'desc' : 'asc',
        limit: 15,
      });
    } catch (e) {
      console.error('Failed to load margin ranking:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (cat: CategoryType) => {
    if (cat === category) return;
    setCategory(cat);
    setLoading(true);
    try {
      await dishApi.getMarginRanking({
        category: cat === 'all' ? undefined : cat,
        storeId,
        sort: sortType === 'high' ? 'desc' : 'asc',
        limit: 15,
      });
    } catch (e) {
      console.error('Failed to load margin ranking:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h3 className="font-serif-cn text-xl font-semibold text-primary-800">
          菜品毛利排名
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-primary-50 rounded-lg p-1">
            <button
              onClick={() => handleSortChange('high')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                sortType === 'high'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              高毛利
            </button>
            <button
              onClick={() => handleSortChange('low')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                sortType === 'low'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              低毛利
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === cat.key
                    ? 'bg-primary-700 text-white'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: Math.max(400, displayData.length * 36) }}>
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-3 border-primary-200 border-t-accent-500 rounded-full animate-spin" />
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 110, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              domain={[0, 80]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={{ stroke: '#bcccdc' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#334e68', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DishMargin;
                  return (
                    <div className="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-xl">
                      <div className="font-serif-cn text-base font-semibold text-accent-400 mb-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-primary-300 mb-2">{item.category}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-6">
                          <span className="text-primary-300">毛利率</span>
                          <span
                            className="font-semibold"
                            style={{ color: getMarginColor(item.grossMargin) }}
                          >
                            {item.grossMargin.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-6">
                          <span className="text-primary-300">销量</span>
                          <span className="font-semibold">{item.salesVolume} 份</span>
                        </div>
                        <div className="flex justify-between gap-6">
                          <span className="text-primary-300">营收</span>
                          <span className="font-semibold text-accent-400">
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-6">
                          <span className="text-primary-300">成本</span>
                          <span className="font-semibold">
                            {formatCurrency(item.cost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="grossMargin"
              radius={[0, 6, 6, 0]}
              barSize={20}
              label={{
                position: 'right',
                fill: '#334e68',
                fontSize: 12,
                fontWeight: 600,
                formatter: (value: number) => `${value.toFixed(1)}%`,
              }}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getMarginColor(entry.grossMargin)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SalesTrend } from '@/types';

interface SalesTrendChartProps {
  data: SalesTrend[];
}

type MetricType = 'quantity' | 'revenue';

const LINE_COLORS = [
  '#f97316',
  '#10b981',
  '#0ea5e9',
  '#8b5cf6',
  '#ef4444',
  '#eab308',
  '#ec4899',
  '#14b8a6',
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatCurrency(value: number): string {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万';
  }
  return value.toLocaleString('zh-CN');
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [metric, setMetric] = useState<MetricType>('quantity');
  const [visibleDishes, setVisibleDishes] = useState<Set<string>>(new Set());

  const allDishes = useMemo(() => {
    const dishMap = new Map<string, string>();
    data.forEach((day) => {
      day.dishes.forEach((d) => {
        if (!dishMap.has(d.dishId)) {
          dishMap.set(d.dishId, d.dishName);
        }
      });
    });
    return Array.from(dishMap.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  if (visibleDishes.size === 0 && allDishes.length > 0) {
    setVisibleDishes(new Set(allDishes.slice(0, 5).map((d) => d.id)));
  }

  const chartData = useMemo(() => {
    return data.map((day) => {
      const row: Record<string, string | number> = {
        date: formatDate(day.date),
        fullDate: day.date,
      };
      day.dishes.forEach((d) => {
        if (visibleDishes.has(d.dishId)) {
          row[d.dishId] = metric === 'quantity' ? d.quantity : d.revenue;
        }
      });
      return row;
    });
  }, [data, visibleDishes, metric]);

  const toggleDish = (dishId: string) => {
    setVisibleDishes((prev) => {
      const next = new Set(prev);
      if (next.has(dishId)) {
        if (next.size > 1) {
          next.delete(dishId);
        }
      } else {
        next.add(dishId);
      }
      return next;
    });
  };

  const handleLegendClick = (o: { value?: string }) => {
    const dish = allDishes.find((d) => d.name === o.value);
    if (dish) {
      toggleDish(dish.id);
    }
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h3 className="font-serif-cn text-xl font-semibold text-primary-800">
          近7天菜品销量趋势
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-primary-50 rounded-lg p-1">
            <button
              onClick={() => setMetric('quantity')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                metric === 'quantity'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              销量
            </button>
            <button
              onClick={() => setMetric('revenue')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                metric === 'revenue'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-primary-600 hover:text-primary-800'
              }`}
            >
              营收
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allDishes.map((dish, index) => {
          const isVisible = visibleDishes.has(dish.id);
          return (
            <button
              key={dish.id}
              onClick={() => toggleDish(dish.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isVisible
                  ? 'text-white border-transparent'
                  : 'bg-white text-primary-500 border-primary-200 hover:border-primary-300'
              }`}
              style={
                isVisible
                  ? { backgroundColor: LINE_COLORS[index % LINE_COLORS.length] }
                  : undefined
              }
            >
              {dish.name}
            </button>
          );
        })}
      </div>

      <div style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <defs>
              {allDishes.map((dish, index) => (
                <linearGradient
                  key={`gradient-${dish.id}`}
                  id={`gradient-${dish.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={LINE_COLORS[index % LINE_COLORS.length]}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={LINE_COLORS[index % LINE_COLORS.length]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={{ stroke: '#bcccdc' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                metric === 'revenue' ? formatCurrency(v) : v.toLocaleString()
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#102a43',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(16, 42, 67, 0.3)',
              }}
              labelStyle={{ color: '#f97316', fontWeight: 600, fontFamily: 'Noto Serif SC, serif', marginBottom: '8px' }}
              itemStyle={{ color: '#ffffff', fontSize: 13 }}
              formatter={(value: number) => [
                metric === 'revenue'
                  ? '¥' + value.toLocaleString('zh-CN')
                  : value.toLocaleString() + ' 份',
                metric === 'revenue' ? '营收' : '销量',
              ]}
            />
            <Legend
              onClick={handleLegendClick}
              formatter={(value) => (
                <span className="text-sm text-primary-600 cursor-pointer">{value}</span>
              )}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {allDishes.map((dish, index) => {
              if (!visibleDishes.has(dish.id)) return null;
              return (
                <Line
                  key={dish.id}
                  type="monotone"
                  dataKey={dish.id}
                  name={dish.name}
                  stroke={LINE_COLORS[index % LINE_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{
                    fill: LINE_COLORS[index % LINE_COLORS.length],
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

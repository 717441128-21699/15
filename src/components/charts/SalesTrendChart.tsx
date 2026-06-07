import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SalesTrend } from '../../types';
import { cn } from '../../lib/utils';

interface SalesTrendChartProps {
  data: SalesTrend[];
}

const COLORS = ['#1e3a5f', '#e8823b', '#0ea5e9', '#16a34a', '#7c3aed'];

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  const allDishes = data[0]?.dishes.map((d) => d.dishName) || [];
  const [activeDishes, setActiveDishes] = useState<string[]>(allDishes.slice(0, 3));

  const chartData = data.map((item) => {
    const row: Record<string, unknown> = { date: item.date };
    item.dishes.forEach((d) => {
      row[d.dishName] = d.quantity;
    });
    return row;
  });

  const toggleDish = (name: string) => {
    setActiveDishes((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name],
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-800 font-serif-cn">近7天菜品销量趋势</h3>
          <p className="text-xs text-primary-400 mt-0.5">选择菜品查看对比趋势</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allDishes.map((name, idx) => (
          <button
            key={name}
            onClick={() => toggleDish(name)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
              activeDishes.includes(name)
                ? 'text-white shadow-sm'
                : 'bg-primary-50 text-primary-400 hover:bg-primary-100',
            )}
            style={
              activeDishes.includes(name)
                ? { backgroundColor: COLORS[idx % COLORS.length] }
                : undefined
            }
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeDishes.includes(name) ? 'white' : COLORS[idx % COLORS.length] }}
            />
            {name}
          </button>
        ))}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {allDishes.map((name, idx) => (
                <linearGradient key={name} id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#829ab1' }} axisLine={{ stroke: '#d9e2ec' }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#829ab1' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d9e2ec',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(15,31,51,0.1)',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {allDishes.map((name, idx) =>
              activeDishes.includes(name) ? (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  fill={`url(#color-${idx})`}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

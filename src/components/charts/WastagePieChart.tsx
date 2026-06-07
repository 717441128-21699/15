import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { WastageCategory } from '@/types';

interface WastagePieChartProps {
  data: WastageCategory[];
}

const CATEGORY_COLORS: Record<string, string> = {
  expired: '#ef4444',
  operation: '#f97316',
  over_prep: '#eab308',
  quality: '#3b82f6',
  other: '#6b7280',
};

const CATEGORY_ICONS: Record<string, string> = {
  expired: '⏰',
  operation: '👨‍🍳',
  over_prep: '📦',
  quality: '⚠️',
  other: '📋',
};

function formatCurrency(value: number): string {
  return '¥' + value.toLocaleString('zh-CN');
}

export default function WastagePieChart({ data }: WastagePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif-cn text-xl font-semibold text-primary-800">
            食材损耗分类分析
          </h3>
          <p className="text-sm text-primary-500 mt-1">
            总损耗金额：
            <span className="font-semibold text-accent-500 ml-1">
              {formatCurrency(totalAmount)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1" style={{ height: 320, minWidth: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={2}
                dataKey="amount"
                nameKey="label"
                labelLine={false}
                label={renderCustomLabel}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#6b7280'}
                    stroke="#ffffff"
                    strokeWidth={activeIndex === index ? 3 : 2}
                    style={{
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as WastageCategory;
                    return (
                      <div className="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {CATEGORY_ICONS[item.category]}
                          </span>
                          <span className="font-serif-cn text-base font-semibold text-accent-400">
                            {item.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-6">
                            <span className="text-primary-300">损耗金额</span>
                            <span
                              className="font-semibold"
                              style={{
                                color: CATEGORY_COLORS[item.category],
                              }}
                            >
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-primary-300">占比</span>
                            <span className="font-semibold">
                              {item.percentage.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-[280px]">
          <div className="space-y-3">
            {sortedData.map((item, index) => {
              const color = CATEGORY_COLORS[item.category] || '#6b7280';
              const isActive = activeIndex === index;
              return (
                <div
                  key={item.category}
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-primary-50/50'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">
                        {CATEGORY_ICONS[item.category]}
                      </span>
                      <span
                        className={`font-medium ${
                          isActive ? 'text-primary-800' : 'text-primary-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="font-semibold text-sm"
                      style={{ color }}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-primary-100 rounded-full overflow-hidden mr-4">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className="text-sm text-primary-600 font-medium min-w-[80px] text-right">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

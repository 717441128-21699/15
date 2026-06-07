import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { WastageCategory } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/format';

interface WastagePieChartProps {
  data: WastageCategory[];
}

export default function WastagePieChart({ data }: WastagePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl p-5 card-shadow h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-800 font-serif-cn">食材损耗分类占比</h3>
        <p className="text-xs text-primary-400 mt-0.5">损耗金额合计 {formatCurrency(total)}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="amount"
                strokeWidth={0}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #d9e2ec',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold font-serif-cn text-primary-800">{formatPercent((data.find((d) => d.category === 'expired')?.percentage || 0), 0)}</div>
            <div className="text-[10px] text-primary-400">最大占比</div>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.category} className="group">
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-primary-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-primary-400">{formatCurrency(item.amount)}</span>
                  <span className="font-semibold text-primary-800 w-10 text-right">{formatPercent(item.percentage, 0)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-primary-50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

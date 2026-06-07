import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TimeSlotData } from '../../types';
import { formatCurrency } from '../../utils/format';

interface TimeSlotChartProps {
  data: TimeSlotData[];
}

export default function TimeSlotChart({ data }: TimeSlotChartProps) {
  return (
    <div className="bg-white rounded-xl p-5 card-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-800 font-serif-cn">时段运营分析</h3>
        <p className="text-xs text-primary-400 mt-0.5">今日各时段翻台率、订单量、营收分布</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#829ab1' }} axisLine={{ stroke: '#d9e2ec' }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#829ab1' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#829ab1' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return formatCurrency(value);
                if (name === 'turnover') return `${value.toFixed(2)} 次`;
                return value;
              }}
              labelFormatter={(label) => `${label} 时段`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d9e2ec',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  orders: '订单量',
                  revenue: '营收',
                  turnover: '翻台率',
                };
                return labels[value] || value;
              }}
            />
            <Bar yAxisId="left" dataKey="orders" fill="#1e3a5f" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Bar yAxisId="left" dataKey="revenue" fill="#e8823b" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Line yAxisId="right" type="monotone" dataKey="turnover" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

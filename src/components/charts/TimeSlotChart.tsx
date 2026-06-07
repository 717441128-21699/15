import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TimeSlotData } from '@/types';

interface TimeSlotChartProps {
  data: TimeSlotData[];
}

function formatCurrency(value: number): string {
  if (value >= 10000) {
    return '¥' + (value / 10000).toFixed(1) + '万';
  }
  return '¥' + value.toLocaleString('zh-CN');
}

export default function TimeSlotChart({ data }: TimeSlotChartProps) {
  const filteredData = data.filter((d) => {
    const hour = parseInt(d.time.split(':')[0], 10);
    return hour >= 10 && hour <= 22;
  });

  const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const peakOrders = Math.max(...filteredData.map((d) => d.orders));
  const peakRevenue = Math.max(...filteredData.map((d) => d.revenue));

  const peakHour = filteredData.reduce(
    (max, d) => (d.orders > max.orders ? d : max),
    filteredData[0]
  );

  return (
    <div className="bg-white rounded-xl card-shadow p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif-cn text-xl font-semibold text-primary-800">
            时段运营分析
          </h3>
          <p className="text-sm text-primary-500 mt-1">
            营业时段 10:00 - 22:00
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="bg-primary-50 rounded-lg px-4 py-2">
            <div className="text-xs text-primary-500">总订单数</div>
            <div className="font-serif-cn text-xl font-semibold text-primary-800">
              {totalOrders.toLocaleString()}
              <span className="text-xs text-primary-500 ml-1">单</span>
            </div>
          </div>
          <div className="bg-accent-50 rounded-lg px-4 py-2">
            <div className="text-xs text-primary-500">总营收</div>
            <div className="font-serif-cn text-xl font-semibold text-accent-600">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          <div className="bg-success/10 rounded-lg px-4 py-2">
            <div className="text-xs text-primary-500">高峰时段</div>
            <div className="font-serif-cn text-xl font-semibold text-success">
              {peakHour?.time || '--'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334e68" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#486581" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={{ stroke: '#bcccdc' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: '订单数',
                angle: -90,
                position: 'insideLeft',
                fill: '#486581',
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#627d98', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v)}
              label={{
                value: '营收(元)',
                angle: 90,
                position: 'insideRight',
                fill: '#ea580c',
                fontSize: 12,
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const orders = payload.find((p) => p.dataKey === 'orders');
                  const revenue = payload.find((p) => p.dataKey === 'revenue');
                  const customers = payload.find((p) => p.dataKey === 'customers');
                  return (
                    <div className="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-xl">
                      <div className="font-serif-cn text-base font-semibold text-accent-400 mb-3">
                        {label}
                      </div>
                      <div className="space-y-1.5 text-sm">
                        {orders && (
                          <div className="flex justify-between gap-8">
                            <span className="text-primary-300">订单数</span>
                            <span className="font-semibold text-white">
                              {(orders.value as number).toLocaleString()} 单
                            </span>
                          </div>
                        )}
                        {customers && (
                          <div className="flex justify-between gap-8">
                            <span className="text-primary-300">客流量</span>
                            <span className="font-semibold text-white">
                              {(customers.value as number).toLocaleString()} 人
                            </span>
                          </div>
                        )}
                        {revenue && (
                          <div className="flex justify-between gap-8">
                            <span className="text-primary-300">营收</span>
                            <span className="font-semibold text-accent-400">
                              ¥{(revenue.value as number).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-primary-600">{value}</span>
              )}
              wrapperStyle={{ paddingTop: '15px' }}
              iconType="circle"
            />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="订单数"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              barSize={36}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="营收"
              stroke="#f97316"
              strokeWidth={3}
              dot={{
                fill: '#f97316',
                stroke: '#ffffff',
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                r: 7,
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-primary-50 rounded-lg p-3 text-center">
          <div className="text-xs text-primary-500 mb-1">平均订单数</div>
          <div className="font-semibold text-primary-800">
            {Math.round(totalOrders / filteredData.length).toLocaleString()} 单
          </div>
        </div>
        <div className="bg-primary-50 rounded-lg p-3 text-center">
          <div className="text-xs text-primary-500 mb-1">平均营收</div>
          <div className="font-semibold text-accent-600">
            {formatCurrency(Math.round(totalRevenue / filteredData.length))}
          </div>
        </div>
        <div className="bg-primary-50 rounded-lg p-3 text-center">
          <div className="text-xs text-primary-500 mb-1">峰值订单</div>
          <div className="font-semibold text-primary-800">
            {peakOrders.toLocaleString()} 单
          </div>
        </div>
        <div className="bg-primary-50 rounded-lg p-3 text-center">
          <div className="text-xs text-primary-500 mb-1">峰值营收</div>
          <div className="font-semibold text-accent-600">
            {formatCurrency(peakRevenue)}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Activity,
  Percent,
  Package,
  Users,
  Award,
  Lightbulb,
  Download,
  ChevronUp,
  ChevronDown,
  Minus as MinusIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { reportApi } from '@/services/api';
import type { HealthReport, HealthLevel } from '@/types';
import { cn } from '@/lib/utils';
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatChangeRate,
  formatHealthStatus,
} from '@/utils/format';

interface MetricComparison {
  metric: string;
  currentWeek: number;
  lastWeek: number;
  samePeriodLastYear: number;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
  formatter: (v: number) => string;
}

const METRIC_CONFIG: Omit<MetricComparison, 'currentWeek' | 'lastWeek' | 'samePeriodLastYear'>[] = [
  {
    metric: 'totalRevenue',
    label: '总营收',
    unit: '元',
    icon: DollarSign,
    gradientClass: 'gradient-revenue',
    formatter: (v) => formatCurrency(v),
  },
  {
    metric: 'turnoverRate',
    label: '翻台率',
    unit: '次',
    icon: Activity,
    gradientClass: 'gradient-turnover',
    formatter: (v) => formatNumber(v, 1),
  },
  {
    metric: 'grossMargin',
    label: '毛利率',
    unit: '%',
    icon: Percent,
    gradientClass: 'gradient-margin',
    formatter: (v) => formatPercent(v / 100),
  },
  {
    metric: 'wastageRate',
    label: '损耗率',
    unit: '%',
    icon: Package,
    gradientClass: 'gradient-wastage',
    formatter: (v) => formatPercent(v / 100),
  },
  {
    metric: 'outputPerCapita',
    label: '人均产出',
    unit: '元',
    icon: Users,
    gradientClass: 'gradient-output',
    formatter: (v) => formatCurrency(v),
  },
];

const WASTAGE_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#6b7280'];

const HEALTH_COMMENTS: Record<HealthLevel, string> = {
  excellent: '本周运营表现优异，各项指标均处于健康区间，继续保持！',
  good: '本周运营状况良好，个别指标有优化空间，建议关注细节提升。',
  average: '本周运营表现一般，部分指标出现波动，建议及时调整运营策略。',
  poor: '本周运营状况欠佳，多项指标低于基准线，请立即排查问题并采取措施。',
};

function HealthScoreCard({
  score,
  level,
  weekStart,
  weekEnd,
  scoreChange,
}: {
  score: number;
  level: HealthLevel;
  weekStart: string;
  weekEnd: string;
  scoreChange: number;
}) {
  const status = formatHealthStatus(level, score);
  const change = formatChangeRate(scoreChange / 100);

  const healthColors: Record<HealthLevel, string> = {
    excellent: 'from-emerald-400 to-emerald-600',
    good: 'from-sky-400 to-primary-600',
    average: 'from-amber-400 to-amber-600',
    poor: 'from-red-400 to-red-600',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 text-white card-shadow gradient-primary animate-slide-up">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-white/5"></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <div className={cn(
            'w-36 h-36 rounded-full flex items-center justify-center',
            'bg-gradient-to-br',
            healthColors[level],
            'shadow-2xl'
          )}>
            <div className="w-32 h-32 rounded-full bg-primary-900/80 backdrop-blur flex flex-col items-center justify-center">
              <span className="font-serif-cn text-5xl font-bold text-white leading-none">
                {Math.round(score)}
              </span>
              <span className="text-sm text-white/60 mt-0.5">/ 100</span>
            </div>
          </div>
          <div className={cn(
            'mt-4 px-5 py-1.5 rounded-full font-semibold text-sm',
            status.bgClassName,
            status.className
          )}>
            {status.label}
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm text-white/60 mb-1">报告周期</p>
          <h2 className="font-serif-cn text-2xl font-bold text-white mb-3">
            {weekStart} ~ {weekEnd}
          </h2>
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <span className="text-white/70 text-sm">较上周</span>
            <div className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold',
              change.isPositive
                ? 'bg-green-500/20 text-green-300'
                : change.isNeutral
                ? 'bg-white/10 text-white/70'
                : 'bg-red-500/20 text-red-300'
            )}>
              {change.isPositive ? (
                <ChevronUp className="w-4 h-4" />
              ) : change.isNeutral ? (
                <MinusIcon className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {Math.abs(scoreChange).toFixed(1)} 分
            </div>
          </div>
          <p className="text-white/80 leading-relaxed max-w-xl">
            {HEALTH_COMMENTS[level]}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricComparison }) {
  const mom = metric.lastWeek > 0 ? (metric.currentWeek - metric.lastWeek) / metric.lastWeek : 0;
  const yoy = metric.samePeriodLastYear > 0
    ? (metric.currentWeek - metric.samePeriodLastYear) / metric.samePeriodLastYear
    : 0;
  const momResult = formatChangeRate(mom);
  const yoyResult = formatChangeRate(yoy);
  const Icon = metric.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white card-shadow card-shadow-hover animate-slide-up',
        metric.gradientClass
      )}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-sm text-white/80 mb-1.5">{metric.label}</p>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-serif-cn text-2xl font-bold tracking-tight">
            {metric.formatter(metric.currentWeek)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-white/70">环比</span>
            {momResult.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
            ) : momResult.isNeutral ? (
              <Minus className="w-3.5 h-3.5 text-white/60" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-300" />
            )}
            <span
              className={cn(
                'font-medium',
                momResult.isPositive
                  ? 'text-green-300'
                  : momResult.isNeutral
                  ? 'text-white/70'
                  : 'text-red-300'
              )}
            >
              {momResult.text}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white/70">同比</span>
            {yoyResult.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
            ) : yoyResult.isNeutral ? (
              <Minus className="w-3.5 h-3.5 text-white/60" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-300" />
            )}
            <span
              className={cn(
                'font-medium',
                yoyResult.isPositive
                  ? 'text-green-300'
                  : yoyResult.isNeutral
                  ? 'text-white/70'
                  : 'text-red-300'
              )}
            >
              {yoyResult.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StaffRanking {
  staffId: string;
  staffName: string;
  storeName: string;
  output: number;
  trend: 'up' | 'down' | 'stable';
}

function RankingBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg">
        <Award className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md">
        <span className="font-serif-cn font-bold text-white text-sm">2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-md">
        <span className="font-serif-cn font-bold text-white text-sm">3</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
      <span className="font-serif-cn font-bold text-primary-600 text-sm">{rank}</span>
    </div>
  );
}

export function Report() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<HealthReport | null>(null);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await reportApi.getWeeklyReport();
      const reportData = Array.isArray(data) ? data[0] : data;
      if (reportData) setReport(reportData);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const mockMetrics: MetricComparison[] = report?.metricsComparison?.length
    ? report.metricsComparison.map((m, idx) => {
        const cfg = METRIC_CONFIG[idx % METRIC_CONFIG.length];
        return {
          ...m,
          ...cfg,
          metric: cfg.metric,
        } as MetricComparison;
      })
    : METRIC_CONFIG.map((cfg) => ({
        ...cfg,
        currentWeek: 0,
        lastWeek: 0,
        samePeriodLastYear: 0,
      }));

  const chartData = mockMetrics.map((m) => ({
    name: m.label,
    本周: m.currentWeek,
    上周: m.lastWeek,
    去年同期: m.samePeriodLastYear,
  }));

  const wastageData = report?.wastageReasonDistribution?.length
    ? report.wastageReasonDistribution
    : [
        { reason: '过期浪费', percentage: 28 },
        { reason: '操作损耗', percentage: 25 },
        { reason: '备料过多', percentage: 20 },
        { reason: '品质问题', percentage: 15 },
        { reason: '其他原因', percentage: 12 },
      ];

  const mockStaff: StaffRanking[] = report?.staffRanking?.length
    ? report.staffRanking.map((s) => ({
        ...s,
        trend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)],
      }))
    : [
        { staffId: '1', staffName: '王大厨', storeName: '上海旗舰店', output: 9850, trend: 'up' },
        { staffId: '2', staffName: '李师傅', storeName: '北京中心店', output: 9320, trend: 'up' },
        { staffId: '3', staffName: '张主厨', storeName: '广州万象城店', output: 8980, trend: 'stable' },
        { staffId: '4', staffName: '陈厨工', storeName: '深圳大悦城店', output: 8650, trend: 'down' },
        { staffId: '5', staffName: '刘帮厨', storeName: '杭州万达广场店', output: 8230, trend: 'up' },
        { staffId: '6', staffName: '赵师傅', storeName: '成都太古里店', output: 7980, trend: 'stable' },
        { staffId: '7', staffName: '孙厨工', storeName: '南京德基店', output: 7620, trend: 'down' },
        { staffId: '8', staffName: '周帮厨', storeName: '武汉光谷店', output: 7350, trend: 'stable' },
      ];

  const suggestions = report?.suggestions?.length
    ? report.suggestions
    : [
        '建议优化早高峰排班制度，增加7:00-9:00时段厨房人手配置，可提升出餐效率约15%。',
        '针对食材损耗率较高的门店，建议引入先进先出(FIFO)库存管理，预计可降低损耗率3-5个百分点。',
        '推广招牌菜组合套餐，结合周末满减活动，预计可提升客单价8-12%。',
        '对翻台率低于2.5的门店进行动线优化分析，建议调整桌位布局以提升周转效率。',
        '建立员工技能交叉培训机制，降低关键岗位人员请假对运营的影响。',
      ];

  const weekStart = report?.weekStart || '2026-06-01';
  const weekEnd = report?.weekEnd || '2026-06-07';
  const healthScore = report?.healthScore ?? 82;
  const healthLevel: HealthLevel = report?.healthLevel || 'good';
  const scoreChange = 2.5;

  const totalWastage = wastageData.reduce((sum, w) => sum + w.percentage, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif-cn text-2xl font-bold text-primary-900">运营健康诊断报告</h1>
          <p className="text-sm text-primary-500 mt-1">
            报告周期：{weekStart} ~ {weekEnd}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-700 text-white font-medium hover:bg-primary-800 transition-colors card-shadow">
          <Download className="w-4 h-4" />
          导出PDF
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <HealthScoreCard
            score={healthScore}
            level={healthLevel}
            weekStart={weekStart}
            weekEnd={weekEnd}
            scoreChange={scoreChange}
          />

          <div>
            <h2 className="font-serif-cn text-xl font-semibold text-primary-800 mb-4">核心指标同比环比</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">
              {mockMetrics.map((metric, idx) => (
                <MetricCard key={metric.metric} metric={metric} />
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow border border-primary-100/50">
              <h3 className="font-serif-cn text-lg font-semibold text-primary-800 mb-4">三期数据对比</h3>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#627d98', fontSize: 13 }}
                      axisLine={{ stroke: '#bcccdc' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#627d98', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => (v >= 10000 ? (v / 10000).toFixed(1) + '万' : v.toFixed(0))}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#102a43',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(16, 42, 67, 0.3)',
                      }}
                      labelStyle={{
                        color: '#f97316',
                        fontWeight: 600,
                        fontFamily: 'Noto Serif SC, serif',
                        marginBottom: '8px',
                      }}
                      itemStyle={{ color: '#ffffff', fontSize: 13 }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-sm text-primary-600">{value}</span>
                      )}
                      wrapperStyle={{ paddingTop: '16px' }}
                    />
                    <Bar dataKey="本周" fill="#f97316" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="上周" fill="#486581" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="去年同期" fill="#9fb3c8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-primary-100/50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif-cn text-xl font-semibold text-primary-800">
                  食材损耗原因分布
                </h2>
                <span className="text-sm text-primary-500">
                  总损耗率：
                  <span className="font-semibold text-accent-600 ml-1">
                    {formatPercent(totalWastage / 100)}
                  </span>
                </span>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1" style={{ height: 260, minWidth: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wastageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="percentage"
                        nameKey="reason"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          if (percent < 0.06) return null;
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
                              fontSize={12}
                              fontWeight={600}
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {wastageData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={WASTAGE_COLORS[index % WASTAGE_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#102a43',
                          border: 'none',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, '占比']}
                        labelStyle={{ color: '#f97316', fontWeight: 600 }}
                        itemStyle={{ color: '#ffffff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 min-w-[240px] w-full space-y-2.5">
                  {wastageData.map((item, index) => {
                    const color = WASTAGE_COLORS[index % WASTAGE_COLORS.length];
                    return (
                      <div
                        key={item.reason}
                        className="p-3 rounded-xl bg-primary-50/60 hover:bg-primary-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-primary-700">
                              {item.reason}
                            </span>
                          </div>
                          <span
                            className="text-sm font-semibold"
                            style={{ color }}
                          >
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(item.percentage / totalWastage) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow border border-primary-100/50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif-cn text-xl font-semibold text-primary-800">
                  后厨员工效率排名
                </h2>
                <span className="text-sm text-primary-500">TOP 8</span>
              </div>
              <div className="space-y-2.5">
                {mockStaff.slice(0, 8).map((staff, idx) => (
                  <div
                    key={staff.staffId}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-xl transition-all animate-slide-up',
                      idx < 3 ? 'bg-gradient-to-r from-accent-50/60 to-transparent' : 'hover:bg-primary-50/60'
                    )}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <RankingBadge rank={idx + 1} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary-800">
                          {staff.staffName}
                        </span>
                        {staff.trend === 'up' && (
                          <TrendingUp className="w-4 h-4 text-success" />
                        )}
                        {staff.trend === 'down' && (
                          <TrendingDown className="w-4 h-4 text-danger" />
                        )}
                        {staff.trend === 'stable' && (
                          <Minus className="w-4 h-4 text-primary-400" />
                        )}
                      </div>
                      <p className="text-xs text-primary-400 truncate">{staff.storeName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif-cn font-bold text-lg text-primary-800">
                        {formatCurrency(staff.output)}
                      </p>
                      <p className="text-xs text-primary-400">周产出</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif-cn text-xl font-semibold text-primary-800">
                  AI智能优化建议
                </h2>
                <p className="text-sm text-primary-500">基于数据分析的可执行改进方案</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'relative overflow-hidden rounded-2xl p-5 card-shadow card-shadow-hover animate-slide-up text-white',
                    idx % 5 === 0 && 'gradient-primary',
                    idx % 5 === 1 && 'gradient-revenue',
                    idx % 5 === 2 && 'gradient-margin',
                    idx % 5 === 3 && 'gradient-wastage',
                    idx % 5 === 4 && 'gradient-output'
                  )}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full bg-white/5"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-serif-cn font-bold text-white text-sm">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-xs text-white/70 font-medium">优化建议</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Report;

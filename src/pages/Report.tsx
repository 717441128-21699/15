import { useEffect, useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Minus, Award, Lightbulb, Activity, ArrowUpRight, ArrowDownRight, Minus as MinusIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../services/api';
import type { HealthReport } from '../types';
import { formatCurrency, formatNumber, formatPercent, formatChange, getHealthStatusLabel, getHealthLevelColor } from '../utils/format';
import { cn } from '../lib/utils';

const WASTAGE_COLORS = ['#dc2626', '#e8823b', '#f59e0b', '#0ea5e9', '#9fb3c8'];

export default function Report() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const data = await api.report.weekly();
        setReport(data);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight size={14} className="text-success" />;
    if (trend === 'down') return <ArrowDownRight size={14} className="text-danger" />;
    return <MinusIcon size={14} className="text-primary-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-info';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-success/20 to-success/5';
    if (score >= 80) return 'from-info/20 to-info/5';
    if (score >= 70) return 'from-warning/20 to-warning/5';
    return 'from-danger/20 to-danger/5';
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-primary-400">报告生成中...</div>
      </div>
    );
  }

  const comparisonChartData = report.metricsComparison.map((m) => ({
    name: m.label,
    本周: m.currentWeek,
    上周: m.lastWeek,
    去年同期: m.samePeriodLastYear,
  }));

  const wastageChartData = report.wastageReasonDistribution.map((w) => ({
    name: w.reason,
    value: w.percentage,
    amount: w.amount,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif-cn text-primary-800">运营健康诊断报告</h1>
          <p className="text-sm text-primary-400 mt-1">
            报告周期：{report.weekStart} 至 {report.weekEnd} · 每周一自动生成
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <FileText size={16} />
          导出PDF
        </button>
      </div>

      <div className={cn('bg-gradient-to-br rounded-2xl p-8 card-shadow', getScoreGradient(report.healthScore))}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={20} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-600">综合健康评分</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={cn('text-6xl font-bold font-serif-cn', getScoreColor(report.healthScore))}>
                {report.healthScore}
              </span>
              <span className="text-2xl text-primary-400">/100</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                report.healthLevel === 'excellent' && 'bg-success text-white',
                report.healthLevel === 'good' && 'bg-info text-white',
                report.healthLevel === 'average' && 'bg-warning text-white',
                report.healthLevel === 'poor' && 'bg-danger text-white',
              )}>
                {getHealthStatusLabel(report.healthLevel)}
              </span>
              <span className="text-sm text-primary-500">运营状态</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-primary-500 mb-1">较上周变化</div>
            <div className="flex items-center justify-end gap-1 text-success font-bold text-xl">
              <TrendingUp size={20} />
              +5.2分
            </div>
            <div className="text-xs text-primary-400 mt-4 max-w-xs">
              本周整体运营状况良好，翻台率和毛利率均有提升，食材损耗率持续下降。建议重点关注广州区域门店的客流提升。
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg gradient-turnover flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-serif-cn text-primary-800">核心指标同比环比</h3>
            <p className="text-xs text-primary-400">本周、上周与去年同期核心经营指标对比</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {report.metricsComparison.map((metric, idx) => {
            const momChange = ((metric.currentWeek - metric.lastWeek) / metric.lastWeek) * 100;
            const yoyChange = ((metric.currentWeek - metric.samePeriodLastYear) / metric.samePeriodLastYear) * 100;
            const formatValue = (v: number) => {
              if (metric.unit === '万元') return `¥${v.toFixed(1)}万`;
              if (metric.unit === '%') return formatPercent(v);
              if (metric.unit === '元') return formatCurrency(v);
              return formatNumber(v);
            };
            const isPositiveBetter = metric.metric !== 'wastage';
            return (
              <div key={metric.metric} className="border border-primary-100 rounded-xl p-4">
                <div className="text-xs text-primary-400 mb-1">{metric.label}</div>
                <div className="text-xl font-bold font-serif-cn text-primary-800 mb-2">
                  {formatValue(metric.currentWeek)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-primary-400">较上周</span>
                    <span className={cn(
                      'font-medium',
                      (isPositiveBetter && momChange > 0) || (!isPositiveBetter && momChange < 0)
                        ? 'text-success'
                        : (momChange === 0 ? 'text-primary-400' : 'text-danger'),
                    )}>
                      {formatChange(momChange)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-primary-400">同比</span>
                    <span className={cn(
                      'font-medium',
                      (isPositiveBetter && yoyChange > 0) || (!isPositiveBetter && yoyChange < 0)
                        ? 'text-success'
                        : (yoyChange === 0 ? 'text-primary-400' : 'text-danger'),
                    )}>
                      {formatChange(yoyChange)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: 16 }} iconType="circle" />
              <Bar dataKey="本周" fill="#3b5998" radius={[6, 6, 0, 0]} />
              <Bar dataKey="上周" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="去年同期" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg gradient-wastage flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-serif-cn text-primary-800">食材损耗原因分布</h3>
              <p className="text-xs text-primary-400">本周各类损耗占比及金额</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastageChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wastageChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={WASTAGE_COLORS[index % WASTAGE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: { payload: { amount: number } }) => [
                    `${value}% (¥${formatCurrency(props.payload.amount)})`,
                    name,
                  ]}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {report.wastageReasonDistribution.slice(0, 3).map((w, idx) => (
              <div key={w.reason} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WASTAGE_COLORS[idx] }} />
                  <span className="text-primary-600">{w.reason}</span>
                </div>
                <span className="font-medium text-primary-800">
                  ¥{formatCurrency(w.amount)} <span className="text-primary-400 font-normal">({w.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg gradient-output flex items-center justify-center">
              <Award size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-serif-cn text-primary-800">后厨员工效率排名</h3>
              <p className="text-xs text-primary-400">按本周人均产出金额排序</p>
            </div>
          </div>
          <div className="space-y-3">
            {report.staffRanking.map((staff) => (
              <div
                key={staff.staffId}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  staff.rank <= 3 ? 'bg-gradient-to-r from-accent-50/80 to-transparent' : 'bg-primary-50/30',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold font-serif-cn text-sm flex-shrink-0',
                    staff.rank === 1 && 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
                    staff.rank === 2 && 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
                    staff.rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
                    staff.rank > 3 && 'bg-primary-100 text-primary-600',
                  )}
                >
                  {staff.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-primary-800 truncate">{staff.staffName}</span>
                    {getTrendIcon(staff.trend)}
                  </div>
                  <div className="text-xs text-primary-400 truncate">{staff.storeName}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold font-serif-cn text-primary-800">{formatCurrency(staff.output)}</div>
                  <div className="text-[10px] text-primary-400">人均产出/周</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg gradient-margin flex items-center justify-center">
            <Lightbulb size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-serif-cn text-primary-800">AI智能优化建议</h3>
            <p className="text-xs text-primary-400">基于数据分析生成的运营优化方案，预计可提升整体毛利1-3%</p>
          </div>
        </div>
        <div className="space-y-3">
          {report.suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-50/60 to-transparent border border-primary-100"
            >
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold font-serif-cn">{idx + 1}</span>
              </div>
              <p className="text-sm text-primary-700 leading-relaxed pt-0.5">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

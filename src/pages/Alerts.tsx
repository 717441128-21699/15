import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { AlertCard } from '@/components/cards/AlertCard';
import { alertApi } from '@/services/api';
import type { Alert, AlertLevel, AlertStatus } from '@/types';
import { cn } from '@/lib/utils';

type LevelFilter = 'all' | AlertLevel;
type StatusFilter = 'all' | AlertStatus;

const LEVEL_OPTIONS: { key: LevelFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'level1', label: '一级预警' },
  { key: 'level2', label: '二级预警' },
];

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'confirmed', label: '店长已确认' },
  { key: 'reviewed', label: '区域已复核' },
  { key: 'approved', label: '总部已批准' },
  { key: 'resolved', label: '已解决' },
];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
  delay: number;
}

function StatCard({ title, value, icon: Icon, gradientClass, delay }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 text-white card-shadow card-shadow-hover animate-slide-up',
        gradientClass
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-white/80 mb-1.5">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif-cn text-3xl font-bold tracking-tight">{value}</span>
          <span className="text-sm text-white/70">条</span>
        </div>
      </div>
    </div>
  );
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const params: { level?: AlertLevel; status?: AlertStatus } = {};
      if (levelFilter !== 'all') params.level = levelFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await alertApi.getAlerts(params);
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [levelFilter, statusFilter]);

  const stats = {
    total: alerts.length,
    level2: alerts.filter((a) => a.level === 'level2').length,
    pending: alerts.filter((a) => a.status === 'pending').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  const handleAlertAction = (updatedAlert: Alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif-cn text-2xl font-bold text-primary-900">
            预警中心
          </h1>
          <p className="text-sm text-primary-500 mt-1">
            实时监控门店异常指标，三级审批流程闭环管理
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="预警总数"
          value={stats.total}
          icon={Bell}
          gradientClass="gradient-primary"
          delay={0}
        />
        <StatCard
          title="二级预警数"
          value={stats.level2}
          icon={AlertOctagon}
          gradientClass="gradient-wastage"
          delay={80}
        />
        <StatCard
          title="待处理数"
          value={stats.pending}
          icon={Clock}
          gradientClass="gradient-turnover"
          delay={160}
        />
        <StatCard
          title="已解决数"
          value={stats.resolved}
          icon={CheckCircle2}
          gradientClass="gradient-margin"
          delay={240}
        />
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow border border-primary-100/50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-700">预警级别</span>
            <div className="flex flex-wrap gap-2">
              {LEVEL_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setLevelFilter(option.key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                    levelFilter === option.key
                      ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                      : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400 hover:text-primary-800'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-px h-12 bg-primary-200"></div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-primary-700">处理状态</span>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setStatusFilter(option.key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                    statusFilter === option.key
                      ? 'bg-accent-500 text-white border-accent-500 shadow-sm'
                      : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400 hover:text-primary-800'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 card-shadow border border-primary-100/50 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-primary-300" />
          </div>
          <p className="font-serif-cn text-lg font-medium text-primary-700">暂无预警信息</p>
          <p className="text-sm text-primary-400 mt-1">所有指标均在正常范围内</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <AlertCard alert={alert} onAction={handleAlertAction} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;

import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import AlertCard from '../components/cards/AlertCard';
import { api } from '../services/api';
import type { Alert, AlertLevel, AlertStatus } from '../types';
import { cn } from '../lib/utils';

const levelFilters: { value: string; label: string }[] = [
  { value: 'all', label: '全部级别' },
  { value: 'level2', label: '二级预警' },
  { value: 'level1', label: '一级预警' },
];

const statusFilters: { value: string; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '待处理' },
  { value: 'confirmed', label: '店长已确认' },
  { value: 'reviewed', label: '区域已复核' },
  { value: 'approved', label: '总部已批准' },
  { value: 'resolved', label: '已解决' },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params: { level?: string; status?: string } = {};
      if (levelFilter !== 'all') params.level = levelFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await api.alerts.list(params);
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  }, [levelFilter, statusFilter]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const stats = {
    total: alerts.length,
    level2: alerts.filter((a) => a.level === 'level2').length,
    pending: alerts.filter((a) => a.status === 'pending').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-serif-cn text-primary-800">预警中心</h1>
        <p className="text-sm text-primary-400 mt-1">实时监控门店异常指标，三级审批流程闭环管理</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow">
          <div className="text-xs text-primary-400 mb-1">预警总数</div>
          <div className="text-2xl font-bold font-serif-cn text-primary-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border-l-4 border-danger">
          <div className="text-xs text-primary-400 mb-1">二级预警</div>
          <div className="text-2xl font-bold font-serif-cn text-danger">{stats.level2}</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border-l-4 border-warning">
          <div className="text-xs text-primary-400 mb-1">待处理</div>
          <div className="text-2xl font-bold font-serif-cn text-warning">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow border-l-4 border-success">
          <div className="text-xs text-primary-400 mb-1">已解决</div>
          <div className="text-2xl font-bold font-serif-cn text-success">{stats.resolved}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 card-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary-500" />
          <span className="text-sm font-medium text-primary-700">筛选条件</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {levelFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setLevelFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                levelFilter === f.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-50 text-primary-500 hover:bg-primary-100',
              )}
            >
              {f.label}
            </button>
          ))}
          <div className="w-px bg-primary-200 mx-1" />
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'bg-accent-500 text-white'
                  : 'bg-primary-50 text-primary-500 hover:bg-primary-100',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-primary-400">加载中...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center card-shadow">
          <AlertTriangle size={48} className="mx-auto text-primary-200 mb-4" />
          <div className="text-lg font-medium text-primary-600 mb-1">暂无预警信息</div>
          <div className="text-sm text-primary-400">所有门店运营状态正常</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAction={loadAlerts} />
          ))}
        </div>
      )}
    </div>
  );
}

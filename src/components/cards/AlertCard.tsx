import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  User,
  ChevronRight,
  Send,
} from 'lucide-react';
import type { Alert } from '../../types';
import { cn } from '../../lib/utils';
import { getAlertTypeLabel, getAlertLevelLabel, getAlertStatusLabel, formatPercent, formatNumber } from '../../utils/format';
import { api } from '../../services/api';
import { useAppStore } from '../../store';

interface AlertCardProps {
  alert: Alert;
  onAction?: () => void;
}

const levelConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  level1: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', label: '一级' },
  level2: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/30', label: '二级' },
};

const statusBg: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  reviewed: 'bg-accent-500/10 text-accent-500',
  approved: 'bg-success/10 text-success',
  resolved: 'bg-primary-100 text-primary-500',
  expired: 'bg-primary-100 text-primary-400',
};

export default function AlertCard({ alert, onAction }: AlertCardProps) {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const level = levelConfig[alert.level];

  const canConfirm = user?.role === 'store' && alert.status === 'pending';
  const canReview = user?.role === 'region' && alert.status === 'confirmed';
  const canApprove = user?.role === 'headquarters' && alert.status === 'reviewed';
  const canResolve = (user?.role === 'region' || user?.role === 'headquarters') && alert.status !== 'resolved';

  const handleAction = async (action: 'confirm' | 'review' | 'approve' | 'resolve') => {
    if (!user) return;
    setLoading(true);
    try {
      if (action === 'confirm') {
        await api.alerts.confirm(alert.id, { comment, userName: user.name, userId: user.id });
      } else if (action === 'review') {
        await api.alerts.review(alert.id, { comment, userName: user.name, userId: user.id });
      } else if (action === 'approve') {
        await api.alerts.approve(alert.id, { comment, userName: user.name, userId: user.id });
      } else if (action === 'resolve') {
        await api.alerts.resolve(alert.id);
      }
      onAction?.();
    } finally {
      setLoading(false);
      setComment('');
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border-l-4 card-shadow overflow-hidden transition-all duration-300 animate-slide-up',
        level.border,
      )}
      style={{ borderLeftWidth: 4 }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', level.bg)}>
              {alert.type === 'wastage' ? (
                <AlertTriangle size={20} className={level.text} />
              ) : (
                <TrendingDown size={20} className={level.text} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-primary-800">{alert.storeName}</h3>
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', level.bg, level.text)}>
                  {getAlertLevelLabel(alert.level)}
                </span>
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', statusBg[alert.status])}>
                  {getAlertStatusLabel(alert.status)}
                </span>
              </div>
              <div className="text-xs text-primary-400">
                {getAlertTypeLabel(alert.type)} · 已连续 {alert.consecutiveDays} 天
              </div>
            </div>
          </div>

          <div className="text-right">
            {alert.daysRemaining !== undefined && alert.daysRemaining > 0 && (
              <div className="flex items-center gap-1 text-xs text-danger mb-1">
                <Clock size={12} />
                <span>剩余 {alert.daysRemaining} 天升级</span>
              </div>
            )}
            <div className="text-[10px] text-primary-400">
              {new Date(alert.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-primary-50 rounded-lg">
          <div>
            <div className="text-[10px] text-primary-400 mb-0.5">当前值</div>
            <div className={cn('text-lg font-bold font-serif-cn', level.text)}>
              {alert.type === 'wastage' ? formatPercent(alert.metricValue) : formatNumber(alert.metricValue) + ' 次'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-primary-400 mb-0.5">标准阈值</div>
            <div className="text-lg font-bold font-serif-cn text-primary-600">
              {alert.type === 'wastage' ? formatPercent(alert.threshold) : formatNumber(alert.threshold) + ' 次'}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-primary-400 mb-1">智能建议</div>
          <p className="text-sm text-primary-700 leading-relaxed">{alert.suggestion}</p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2 border-t border-primary-50 text-xs text-primary-500 hover:text-primary-700 transition-colors"
        >
          <span>{expanded ? '收起审批流程' : '查看审批流程'}</span>
          <ChevronRight size={14} className={cn('transition-transform', expanded && 'rotate-90')} />
        </button>

        {expanded && alert.approvalFlow && (
          <div className="pt-3 border-t border-primary-50 space-y-3">
            {[
              { key: 'storeManagerConfirm', label: '店长确认', step: alert.approvalFlow.storeManagerConfirm },
              { key: 'regionManagerReview', label: '区域经理复核', step: alert.approvalFlow.regionManagerReview },
              { key: 'hqDirectorApprove', label: '总部总监批准', step: alert.approvalFlow.hqDirectorApprove },
            ].map((item, idx, arr) => (
              <div key={item.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center',
                      item.step?.status === 'approved' ? 'bg-success text-white' : 'bg-primary-100 text-primary-400',
                    )}
                  >
                    {item.step?.status === 'approved' ? <CheckCircle size={14} /> : item.step?.status === 'rejected' ? <XCircle size={14} /> : <User size={12} />}
                  </div>
                  {idx < arr.length - 1 && <div className="w-px flex-1 bg-primary-100 mt-1" />}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-700">{item.label}</span>
                    {item.step?.timestamp && (
                      <span className="text-[10px] text-primary-400">
                        {new Date(item.step.timestamp).toLocaleString('zh-CN')}
                      </span>
                    )}
                  </div>
                  {item.step ? (
                    <>
                      <div className="text-xs text-primary-500 mt-0.5">{item.step.userName}</div>
                      {item.step.comment && (
                        <div className="mt-1.5 p-2 bg-primary-50 rounded text-xs text-primary-600">{item.step.comment}</div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-primary-400 mt-0.5">待处理</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {(canConfirm || canReview || canApprove || canResolve) && (
          <div className="pt-3 border-t border-primary-50 space-y-2">
            {(canConfirm || canReview || canApprove) && (
              <input
                type="text"
                placeholder="请输入处理意见..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-primary-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary-200 placeholder-primary-400"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/store/${alert.storeId}`)}
                className="flex-1 py-2 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
              >
                查看门店详情
              </button>
              {canConfirm && (
                <button
                  onClick={() => handleAction('confirm')}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-info text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Send size={12} />
                  店长确认
                </button>
              )}
              {canReview && (
                <button
                  onClick={() => handleAction('review')}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-accent-500 text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Send size={12} />
                  区域复核
                </button>
              )}
              {canApprove && (
                <button
                  onClick={() => handleAction('approve')}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg gradient-primary text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Send size={12} />
                  总部批准
                </button>
              )}
              {canResolve && !canConfirm && !canReview && !canApprove && (
                <button
                  onClick={() => handleAction('resolve')}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-success text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  标记已解决
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

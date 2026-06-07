import { useState } from 'react';
import { AlertTriangle, TrendingDown, Check, Clock, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Alert } from '@/types';
import { useAppStore } from '@/store';
import { alertApi } from '@/services/api';
import { cn } from '@/lib/utils';
import {
  formatAlertLevelLabel,
  formatAlertStatusLabel,
  formatAlertTypeLabel,
  formatDate,
  formatPercent,
  formatNumber,
} from '@/utils/format';

export interface AlertCardProps {
  alert: Alert;
  onAction?: (updatedAlert: Alert) => void;
}

interface TimelineStep {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCompleted: boolean;
  isCurrent: boolean;
  completedAt?: string;
  userName?: string;
}

function getTimelineSteps(alert: Alert): TimelineStep[] {
  const statusOrder: Alert['status'][] = ['pending', 'confirmed', 'reviewed', 'approved', 'resolved'];
  const currentIdx = statusOrder.indexOf(alert.status);

  const steps: TimelineStep[] = [
    {
      key: 'confirm',
      label: '店长确认',
      icon: UserCheck,
      isCompleted: currentIdx >= 1,
      isCurrent: currentIdx === 0,
      completedAt: alert.approvalFlow?.storeManagerConfirm?.timestamp,
      userName: alert.approvalFlow?.storeManagerConfirm?.userName,
    },
    {
      key: 'review',
      label: '区域经理复核',
      icon: ShieldCheck,
      isCompleted: currentIdx >= 2,
      isCurrent: currentIdx === 1,
      completedAt: alert.approvalFlow?.regionManagerReview?.timestamp,
      userName: alert.approvalFlow?.regionManagerReview?.userName,
    },
    {
      key: 'approve',
      label: '总部总监批准',
      icon: CheckCircle2,
      isCompleted: currentIdx >= 3 || alert.status === 'resolved',
      isCurrent: currentIdx === 2,
      completedAt: alert.approvalFlow?.hqDirectorApprove?.timestamp,
      userName: alert.approvalFlow?.hqDirectorApprove?.userName,
    },
  ];

  return steps;
}

export function AlertCard({ alert, onAction }: AlertCardProps) {
  const { user } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  const typeLabel = formatAlertTypeLabel(alert.type);
  const levelLabel = formatAlertLevelLabel(alert.level);
  const statusLabel = formatAlertStatusLabel(alert.status);
  const timelineSteps = getTimelineSteps(alert);

  const TypeIcon = alert.type === 'wastage' ? AlertTriangle : TrendingDown;

  const canConfirm = user?.role === 'store' && alert.status === 'pending';
  const canReview = user?.role === 'region' && alert.status === 'confirmed';
  const canApprove = user?.role === 'headquarters' && alert.status === 'reviewed';
  const canResolve = user?.role === 'headquarters' && alert.status === 'approved';

  const handleAction = async (action: 'confirm' | 'review' | 'approve' | 'resolve') => {
    setLoading(action);
    try {
      let updated: Alert;
      switch (action) {
        case 'confirm':
          updated = await alertApi.confirmAlert(alert.id);
          break;
        case 'review':
          updated = await alertApi.reviewAlert(alert.id);
          break;
        case 'approve':
          updated = await alertApi.approveAlert(alert.id);
          break;
        case 'resolve':
          updated = await alertApi.resolveAlert(alert.id);
          break;
      }
      onAction?.(updated);
    } catch (error) {
      console.error(`Alert ${action} failed:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 card-shadow border border-primary-100/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
              alert.type === 'wastage' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
            )}
          >
            <TypeIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-serif-cn text-base font-semibold text-primary-900">
                {typeLabel.label}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium',
                  levelLabel.className
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', levelLabel.dotClassName)}></span>
                {levelLabel.label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  statusLabel.className
                )}
              >
                {statusLabel.label}
              </span>
            </div>
            <p className="text-sm text-primary-500">
              {alert.storeName} · {formatDate(alert.createdAt, 'full')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-primary-50/60">
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-0.5">当前值</p>
          <p className={cn('font-serif-cn text-lg font-semibold', typeLabel.className)}>
            {formatPercent(alert.metricValue / 100)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-0.5">阈值</p>
          <p className="font-serif-cn text-lg font-semibold text-primary-700">
            {formatPercent(alert.threshold / 100)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-primary-500 mb-0.5">持续天数</p>
          <p className="font-serif-cn text-lg font-semibold text-accent-600">
            {alert.consecutiveDays}天
          </p>
        </div>
      </div>

      {alert.suggestion && (
        <div className="mb-4 p-3 rounded-xl bg-accent-50/80 border border-accent-100">
          <p className="text-xs text-accent-700 font-medium mb-1">优化建议</p>
          <p className="text-sm text-accent-800">{alert.suggestion}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between">
          {timelineSteps.map((step, idx) => {
            const StepIcon = step.icon;
            const isLast = idx === timelineSteps.length - 1;
            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      step.isCompleted
                        ? 'bg-success text-white'
                        : step.isCurrent
                        ? 'bg-accent-500 text-white ring-4 ring-accent-100'
                        : 'bg-primary-100 text-primary-400'
                    )}
                  >
                    {step.isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-xs mt-1.5 font-medium whitespace-nowrap',
                      step.isCompleted
                        ? 'text-success'
                        : step.isCurrent
                        ? 'text-accent-600'
                        : 'text-primary-400'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.completedAt && (
                    <p className="text-[10px] text-primary-400 mt-0.5 whitespace-nowrap">
                      {formatDate(step.completedAt, 'short')}
                    </p>
                  )}
                  {!step.completedAt && step.isCompleted && step.userName && (
                    <p className="text-[10px] text-primary-400 mt-0.5 whitespace-nowrap">
                      {step.userName}
                    </p>
                  )}
                  {!step.isCompleted && !step.isCurrent && (
                    <p className="text-[10px] text-primary-400 mt-0.5 whitespace-nowrap">
                      <Clock className="w-3 h-3 inline" /> 待处理
                    </p>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-1 -mt-6',
                      step.isCompleted ? 'bg-success' : 'bg-primary-100'
                    )}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end pt-3 border-t border-primary-100">
        {canConfirm && (
          <button
            onClick={() => handleAction('confirm')}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-info text-white text-sm font-medium hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'confirm' ? '处理中...' : '确认'}
          </button>
        )}
        {canReview && (
          <button
            onClick={() => handleAction('review')}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'review' ? '处理中...' : '复核'}
          </button>
        )}
        {canApprove && (
          <button
            onClick={() => handleAction('approve')}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'approve' ? '处理中...' : '批准'}
          </button>
        )}
        {canResolve && (
          <button
            onClick={() => handleAction('resolve')}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'resolve' ? '处理中...' : '标记已解决'}
          </button>
        )}
      </div>
    </div>
  );
}

import type {
  UserRole,
  AlertLevel,
  AlertStatus,
  AlertType,
  HealthLevel,
  WastageCategoryType,
} from '@/types';

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export interface ChangeRateResult {
  text: string;
  isPositive: boolean;
  isNeutral: boolean;
  direction: 'up' | 'down' | 'flat';
}

export function formatChangeRate(value: number): ChangeRateResult {
  const percentage = value * 100;
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const direction = isPositive ? 'up' : isNeutral ? 'flat' : 'down';
  const sign = isPositive ? '+' : '';
  return {
    text: `${sign}${percentage.toFixed(1)}%`,
    isPositive,
    isNeutral,
    direction,
  };
}

export interface RoleLabel {
  label: string;
  className: string;
}

export function formatRoleLabel(role: UserRole): RoleLabel {
  const map: Record<UserRole, RoleLabel> = {
    headquarters: {
      label: '总部运营总监',
      className: 'bg-primary-100 text-primary-800',
    },
    region: {
      label: '区域运营经理',
      className: 'bg-accent-100 text-accent-800',
    },
    store: {
      label: '门店店长',
      className: 'bg-success/20 text-green-700',
    },
  };
  return map[role];
}

export interface AlertLevelLabel {
  label: string;
  className: string;
  dotClassName: string;
}

export function formatAlertLevelLabel(level: AlertLevel): AlertLevelLabel {
  const map: Record<AlertLevel, AlertLevelLabel> = {
    level1: {
      label: '一级预警',
      className: 'bg-warning/20 text-warning border-warning',
      dotClassName: 'bg-warning',
    },
    level2: {
      label: '二级预警',
      className: 'bg-danger/20 text-danger border-danger',
      dotClassName: 'bg-danger',
    },
  };
  return map[level];
}

export interface AlertStatusLabel {
  label: string;
  className: string;
}

export function formatAlertStatusLabel(status: AlertStatus): AlertStatusLabel {
  const map: Record<AlertStatus, AlertStatusLabel> = {
    pending: {
      label: '待处理',
      className: 'bg-warning/20 text-warning',
    },
    confirmed: {
      label: '已确认',
      className: 'bg-info/20 text-info',
    },
    reviewed: {
      label: '已复核',
      className: 'bg-primary-100 text-primary-700',
    },
    approved: {
      label: '已批准',
      className: 'bg-success/20 text-green-700',
    },
    resolved: {
      label: '已解决',
      className: 'bg-success/20 text-green-700',
    },
    expired: {
      label: '已过期',
      className: 'bg-gray-200 text-gray-600',
    },
  };
  return map[status];
}

export interface AlertTypeLabel {
  label: string;
  icon: string;
  className: string;
}

export function formatAlertTypeLabel(type: AlertType): AlertTypeLabel {
  const map: Record<AlertType, AlertTypeLabel> = {
    wastage: {
      label: '损耗率异常',
      icon: 'alert-triangle',
      className: 'text-danger',
    },
    turnover: {
      label: '翻台率异常',
      icon: 'trending-down',
      className: 'text-warning',
    },
  };
  return map[type];
}

export interface HealthStatusLabel {
  label: string;
  score: string;
  className: string;
  bgClassName: string;
}

export function formatHealthStatus(level: HealthLevel, score: number): HealthStatusLabel {
  const map: Record<HealthLevel, Omit<HealthStatusLabel, 'score'>> = {
    excellent: {
      label: '优秀',
      className: 'text-green-700',
      bgClassName: 'bg-success/10',
    },
    good: {
      label: '良好',
      className: 'text-primary-700',
      bgClassName: 'bg-primary-100',
    },
    average: {
      label: '一般',
      className: 'text-warning',
      bgClassName: 'bg-warning/10',
    },
    poor: {
      label: '较差',
      className: 'text-danger',
      bgClassName: 'bg-danger/10',
    },
  };
  return {
    ...map[level],
    score: score.toFixed(0),
  };
}

export interface WastageCategoryLabel {
  label: string;
  className: string;
}

export function formatWastageCategoryLabel(
  category: WastageCategoryType
): WastageCategoryLabel {
  const map: Record<WastageCategoryType, WastageCategoryLabel> = {
    expired: {
      label: '过期浪费',
      className: 'text-danger',
    },
    operation: {
      label: '操作损耗',
      className: 'text-warning',
    },
    over_prep: {
      label: '备料过多',
      className: 'text-accent-600',
    },
    quality: {
      label: '品质问题',
      className: 'text-primary-600',
    },
    other: {
      label: '其他原因',
      className: 'text-gray-600',
    },
  };
  return map[category];
}

export function formatCompactNumber(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}亿`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return formatNumber(value);
}

export function formatDate(dateStr: string, format: 'full' | 'short' | 'date' = 'short'): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'full':
      return `${y}-${m}-${d} ${hh}:${mm}`;
    case 'date':
      return `${y}-${m}-${d}`;
    default:
      return `${m}-${d} ${hh}:${mm}`;
  }
}

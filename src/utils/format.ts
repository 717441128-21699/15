export const formatCurrency = (value: number): string => {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString('zh-CN')}`;
};

export const formatNumber = (value: number, decimals = 1): string => {
  return value.toFixed(decimals);
};

export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatChange = (value: number, decimals = 1): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const getRoleLabel = (role: string): string => {
  const map: Record<string, string> = {
    headquarters: '总部运营总监',
    region: '区域运营经理',
    store: '门店店长',
  };
  return map[role] || role;
};

export const getAlertTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    wastage: '食材损耗超标',
    turnover: '翻台率偏低',
  };
  return map[type] || type;
};

export const getAlertLevelLabel = (level: string): string => {
  const map: Record<string, string> = {
    level1: '一级预警',
    level2: '二级预警',
  };
  return map[level] || level;
};

export const getAlertStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待处理',
    confirmed: '店长已确认',
    reviewed: '区域已复核',
    approved: '总部已批准',
    resolved: '已解决',
    expired: '已过期',
  };
  return map[status] || status;
};

export const getHealthStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    poor: '较差',
  };
  return map[status] || status;
};

export const getHealthLevelColor = (level: string): string => {
  const map: Record<string, string> = {
    excellent: 'text-success',
    good: 'text-info',
    average: 'text-warning',
    poor: 'text-danger',
  };
  return map[level] || 'text-primary-500';
};

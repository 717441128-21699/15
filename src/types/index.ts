export type UserRole = 'headquarters' | 'region' | 'store';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  regionId?: string;
  storeId?: string;
  avatar?: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
  brand: string;
  address: string;
  totalTables: number;
  staffCount: number;
  regionId: string;
  healthStatus: 'excellent' | 'good' | 'average' | 'poor';
  todayTurnover: number;
  todayWastage: number;
}

export interface KPIData {
  totalRevenue: number;
  revenueYoY: number;
  revenueMoM: number;
  turnoverRate: number;
  turnoverRateYoY: number;
  turnoverRateMoM: number;
  grossMargin: number;
  grossMarginYoY: number;
  grossMarginMoM: number;
  wastageRate: number;
  wastageRateYoY: number;
  wastageRateMoM: number;
  outputPerCapita: number;
  outputYoY: number;
  outputMoM: number;
}

export interface RegionHeatmapData {
  province: string;
  city: string;
  turnoverRate: number;
  storeCount: number;
  avgRevenue: number;
}

export interface DishMargin {
  id: string;
  name: string;
  category: string;
  salesVolume: number;
  revenue: number;
  cost: number;
  grossMargin: number;
}

export interface SalesTrend {
  date: string;
  dishes: {
    dishId: string;
    dishName: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface WastageCategory {
  category: 'expired' | 'operation' | 'over_prep' | 'quality' | 'other';
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

export type AlertLevel = 'level1' | 'level2';
export type AlertStatus = 'pending' | 'confirmed' | 'reviewed' | 'approved' | 'resolved' | 'expired';
export type AlertType = 'wastage' | 'turnover';

export interface Alert {
  id: string;
  storeId: string;
  storeName: string;
  type: AlertType;
  level: AlertLevel;
  status: AlertStatus;
  metricValue: number;
  threshold: number;
  consecutiveDays: number;
  createdAt: string;
  suggestion: string;
  approvalFlow?: ApprovalFlow;
  daysRemaining?: number;
}

export interface ApprovalFlow {
  storeManagerConfirm?: ApprovalStep;
  regionManagerReview?: ApprovalStep;
  hqDirectorApprove?: ApprovalStep;
}

export interface ApprovalStep {
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

export interface ForecastItem {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  hourlyDemand: number[];
  totalDemand: number;
  suggestedOrder: number;
  currentStock: number;
}

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  ingredientId: string;
  ingredientName: string;
  price: number;
  minOrder: number;
  deliveryTime: string;
  isRecommended?: boolean;
  savedCost?: number;
}

export interface HealthReport {
  weekStart: string;
  weekEnd: string;
  healthScore: number;
  healthLevel: 'excellent' | 'good' | 'average' | 'poor';
  metricsComparison: {
    metric: string;
    label: string;
    unit: string;
    currentWeek: number;
    lastWeek: number;
    samePeriodLastYear: number;
  }[];
  wastageReasonDistribution: {
    reason: string;
    percentage: number;
    amount: number;
  }[];
  staffRanking: {
    staffId: string;
    staffName: string;
    storeName: string;
    output: number;
    rank: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  suggestions: string[];
}

export interface TimeSlotData {
  hour: string;
  turnover: number;
  orders: number;
  revenue: number;
}

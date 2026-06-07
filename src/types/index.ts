export type UserRole = 'headquarters' | 'region' | 'store';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  regionId?: string;
  storeId?: string;
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
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

export type WastageCategoryType = 'expired' | 'operation' | 'over_prep' | 'quality' | 'other';

export interface WastageCategory {
  category: WastageCategoryType;
  label: string;
  amount: number;
  percentage: number;
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
}

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  ingredientId: string;
  ingredientName: string;
  price: number;
  minOrder: number;
  deliveryTime: string;
  unit?: string;
}

export type HealthLevel = 'excellent' | 'good' | 'average' | 'poor';

export interface HealthReport {
  weekStart: string;
  weekEnd: string;
  healthScore: number;
  healthLevel: HealthLevel;
  metricsComparison: {
    metric: string;
    currentWeek: number;
    lastWeek: number;
    samePeriodLastYear: number;
  }[];
  wastageReasonDistribution: {
    reason: string;
    percentage: number;
  }[];
  staffRanking: {
    staffId: string;
    staffName: string;
    storeName: string;
    output: number;
    rank: number;
  }[];
  suggestions: string[];
}

export interface AlertQueryParams {
  level?: AlertLevel;
  status?: AlertStatus;
  type?: AlertType;
  storeId?: string;
}

export interface StoreFilters {
  city?: string;
  brand?: string;
  regionId?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TimeSlotData {
  time: string;
  revenue: number;
  orders: number;
  customers: number;
}
